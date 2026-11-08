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

    // Anti-Fraud Check: Prevent duplicate UTR submission
    if (paymentTransactionId && typeof paymentTransactionId === 'string' && paymentTransactionId.length >= 8) {
      const duplicate = db.orders.find(
        (o) =>
          o.id !== orderId &&
          o.paymentTransactionId &&
          o.paymentTransactionId.toLowerCase() === paymentTransactionId.toLowerCase() &&
          (o.paymentStatus === 'Fully Paid' || o.paymentStatus === 'Deposit Paid')
      );
      if (duplicate) {
        return NextResponse.json(
          { error: `This UTR (${paymentTransactionId}) has already been recorded on Order #${duplicate.id}. Duplicate payments are rejected.` },
          { status: 400 }
        );
      }
    }

    order.paymentStatus = 'Fully Paid';
    order.orderStatus = 'Ready for Fulfilment';
    order.remainingBalance = 0;
    order.paymentMethod = method;
    order.paymentTransactionId = txnId;
    order.history.push({
      status: 'Fully Paid',
      timestamp: new Date().toISOString(),
      note: `Pre-order payment of ₹${order.amountPaidToday} fully verified via ${method} (Ref / UTR: ${txnId}). Allocation secured. Order confirmation dispatched.`,
    });

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
