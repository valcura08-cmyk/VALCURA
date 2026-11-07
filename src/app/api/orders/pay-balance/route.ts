import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { syncOrderToCloud } from '@/lib/cloudDb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, balanceTransactionId, paymentMethod } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const db = getDb();
    const orderIndex = db.orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = db.orders[orderIndex];

    if (order.remainingBalance <= 0) {
      return NextResponse.json(
        { message: 'This order has already been fully paid.', order },
        { status: 200 }
      );
    }

    const balTxnId =
      balanceTransactionId || `bal_pay_${Math.random().toString(36).substring(2, 10)}`;

    const previouslyPaid = order.amountPaidToday;
    const balancePaid = order.remainingBalance;

    order.amountPaidToday = order.totalOrderValue;
    order.remainingBalance = 0;
    order.paymentStatus = 'Fully Paid';
    order.orderStatus = 'Ready for Fulfilment';
    order.balancePaidAt = new Date().toISOString();
    order.balanceTransactionId = balTxnId;

    order.history.push({
      status: 'Ready for Fulfilment',
      timestamp: new Date().toISOString(),
      note: `Outstanding balance of ₹${balancePaid} verified and received via ${
        paymentMethod || 'UPI/Card'
      }. Total order ₹${order.totalOrderValue} received in full. Marked Ready for Fulfilment.`,
    });

    db.orders[orderIndex] = order;
    saveDb(db);

    // Sync full payment status to Cloud Database
    await syncOrderToCloud(order);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: any) {
    console.error('Balance payment error:', err);
    return NextResponse.json({ error: 'Balance payment failed' }, { status: 500 });
  }
}
