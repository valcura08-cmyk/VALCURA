import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb, saveDb, Order } from '@/lib/db';
import { syncOrderToCloud, getOrderFromCloud } from '@/lib/cloudDb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      valcuraOrderId,
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !valcuraOrderId
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Incomplete payment proof received from gateway.',
        },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Server payment key is not configured for signature verification.',
        },
        { status: 500 }
      );
    }

    // 1. Cryptographic HMAC SHA256 Signature Verification
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Razorpay signature verification mismatch!');
      return NextResponse.json(
        {
          success: false,
          error:
            'Security validation failed: Payment signature does not match official bank confirmation.',
        },
        { status: 400 }
      );
    }

    // 2. Fetch Order from local DB or Supabase cloud
    const db = getDb();
    let order: Order | undefined = db.orders.find(
      (o) => o.id === valcuraOrderId.trim()
    );

    if (!order) {
      const cloudOrder = await getOrderFromCloud(valcuraOrderId.trim());
      if (cloudOrder) {
        order = cloudOrder;
        db.orders.unshift(cloudOrder);
      }
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order reference not found on server.' },
        { status: 404 }
      );
    }

    // 3. Mark Order as Fully Paid & Ready for Fulfilment (ONLY AFTER AUTHENTICATED PAYMENT)
    order.paymentStatus = 'Fully Paid';
    order.orderStatus = 'Ready for Fulfilment';
    order.remainingBalance = 0;
    order.paymentMethod = 'Official Razorpay Payment Gateway';
    order.paymentTransactionId = razorpay_payment_id;

    order.history.push({
      status: 'Fully Paid',
      timestamp: new Date().toISOString(),
      note: `Official Payment Captured via Razorpay. Payment ID: ${razorpay_payment_id}, Gateway Order ID: ${razorpay_order_id}. Verified by Bank Gateway.`,
    });

    const index = db.orders.findIndex((o) => o.id === order!.id);
    if (index >= 0) {
      db.orders[index] = order;
    } else {
      db.orders.unshift(order);
    }
    saveDb(db);

    // Sync to Supabase Cloud
    await syncOrderToCloud(order);

    return NextResponse.json({
      success: true,
      verified: true,
      orderId: order.id,
      order,
      paymentId: razorpay_payment_id,
      redirectUrl: `/order-confirmation/${order.id}`,
    });
  } catch (err: any) {
    console.error('Verify official payment error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Server error while verifying official payment.',
      },
      { status: 500 }
    );
  }
}
