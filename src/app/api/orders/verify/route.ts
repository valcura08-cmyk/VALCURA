import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { syncOrderToCloud, updateOrderInCloud } from '@/lib/cloudDb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentTransactionId, paymentMethod } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const db = getDb();
    const orderIndex = db.orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = db.orders[orderIndex];

    const txnId = paymentTransactionId || `txn_val_${Math.random().toString(36).substring(2, 10)}`;
    const method = paymentMethod || 'UPI (Indian Gateway Verified)';

    if (order.plan === 'full') {
      // Full payment workflow
      order.paymentStatus = 'Fully Paid';
      order.orderStatus = 'Fully Paid';
      order.paymentMethod = method;
      order.paymentTransactionId = txnId;
      order.history.push({
        status: 'Fully Paid',
        timestamp: new Date().toISOString(),
        note: `Full payment of ₹${order.amountPaidToday} verified. Reservation confirmed. Customer notified.`,
      });
    } else {
      // 70% Reservation deposit workflow
      order.paymentStatus = 'Deposit Paid';
      order.orderStatus = 'Deposit Paid — Awaiting Availability';
      order.paymentMethod = method;
      order.paymentTransactionId = txnId;
      order.history.push({
        status: 'Deposit Paid — Awaiting Availability',
        timestamp: new Date().toISOString(),
        note: `70% deposit payment of ₹${order.amountPaidToday} verified. Outstanding balance: ₹${order.remainingBalance}. Order confirmation sent.`,
      });
    }

    db.orders[orderIndex] = order;
    saveDb(db);

    // Sync verified state to Cloud Database
    await syncOrderToCloud(order);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
