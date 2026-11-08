import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, Order } from '@/lib/db';
import { syncOrderToCloud, getOrderFromCloud, getOrdersFromCloud } from '@/lib/cloudDb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('payment_id');
    const paymentStatus = searchParams.get('payment_status');
    const paymentRequest = searchParams.get('payment_request_id');

    // Retrieve pending order ID from cookie or query param
    const cookieOrderId = req.cookies.get('valcura_pending_order_id')?.value;
    const queryOrderId = searchParams.get('order_id');
    let orderId = queryOrderId || cookieOrderId;

    // Check if payment was credited successfully
    if (!paymentId || paymentStatus?.toLowerCase() !== 'credit') {
      console.warn('Instamojo payment failed or was not credited:', { paymentId, paymentStatus });
      return NextResponse.redirect(
        new URL('/checkout?error=Payment+was+not+completed+or+was+declined+by+bank', req.url)
      );
    }

    const db = getDb();
    let order: Order | undefined;

    if (orderId) {
      order = db.orders.find((o) => o.id === orderId);
      if (!order) {
        const cloudOrder = await getOrderFromCloud(orderId);
        if (cloudOrder) {
          order = cloudOrder;
          db.orders.unshift(cloudOrder);
        }
      }
    }

    // Fallback: If cookie was missing or expired, find the most recent pending order
    if (!order) {
      const pendingLocal = db.orders.find((o) => o.paymentStatus === 'Payment Pending');
      if (pendingLocal) {
        order = pendingLocal;
      } else {
        const cloudOrders = await getOrdersFromCloud();
        const pendingCloud = cloudOrders.find((o) => o.paymentStatus === 'Payment Pending');
        if (pendingCloud) {
          order = pendingCloud;
          db.orders.unshift(pendingCloud);
        }
      }
    }

    if (order) {
      // Mark Order as Fully Paid & Ready for Fulfilment
      order.paymentStatus = 'Fully Paid';
      order.orderStatus = 'Ready for Fulfilment';
      order.remainingBalance = 0;
      order.paymentMethod = 'Instamojo Official Gateway (Verified)';
      order.paymentTransactionId = paymentId;

      order.history.push({
        status: 'Fully Paid',
        timestamp: new Date().toISOString(),
        note: `Official Payment Captured via Instamojo. Payment ID: ${paymentId}, Request ID: ${paymentRequest || 'N/A'}. Verified settlement.`,
      });

      const index = db.orders.findIndex((o) => o.id === order!.id);
      if (index >= 0) {
        db.orders[index] = order;
      } else {
        db.orders.unshift(order);
      }
      saveDb(db);

      // Sync confirmed order to Supabase
      await syncOrderToCloud(order);

      const targetOrderId = order.id;
      const response = NextResponse.redirect(new URL(`/order-confirmation/${targetOrderId}`, req.url));
      response.cookies.delete('valcura_pending_order_id');
      return response;
    }

    // If order was not found in DB but payment is verified credit, direct to confirmed order page
    const response = NextResponse.redirect(
      new URL(`/order-confirmation/confirmed?payment_id=${paymentId}`, req.url)
    );
    response.cookies.delete('valcura_pending_order_id');
    return response;
  } catch (err: any) {
    console.error('Instamojo callback processing error:', err);
    return NextResponse.redirect(
      new URL('/checkout?error=Payment+verification+error.+Please+contact+concierge', req.url)
    );
  }
}
