import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, orderId, customer } = body;

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Razorpay gateway credentials are not configured on the server. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
        },
        { status: 500 }
      );
    }

    const payableAmount = Math.max(1, Number(amount) || 399);

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(payableAmount * 100), // amount in paise
      currency: 'INR',
      receipt: (orderId || `VAL-${Date.now()}`).slice(0, 40),
      notes: {
        valcuraOrderId: orderId || '',
        customerName: customer?.fullName || '',
        customerPhone: customer?.phone || '',
        customerEmail: customer?.email || '',
      },
    });

    return NextResponse.json({
      success: true,
      rzpOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId,
    });
  } catch (err: any) {
    console.error('Razorpay create order error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to initialize official payment gateway order.',
      },
      { status: 500 }
    );
  }
}
