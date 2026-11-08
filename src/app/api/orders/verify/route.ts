import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { syncOrderToCloud } from '@/lib/cloudDb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentTransactionId, paymentMethod } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    if (!paymentTransactionId || typeof paymentTransactionId !== 'string') {
      return NextResponse.json(
        { error: 'Valid 12-digit UPI UTR is required. Fake or unverified orders are rejected.' },
        { status: 400 }
      );
    }

    const cleanUtr = paymentTransactionId.trim().replace(/\D/g, '');
    if (!/^\d{12}$/.test(cleanUtr)) {
      return NextResponse.json(
        { error: 'Invalid UTR format. Indian UPI Reference Numbers must be exactly 12 numeric digits.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const orderIndex = db.orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = db.orders[orderIndex];

    // Anti-Fraud Check: Prevent duplicate UTR submission
    const duplicate = db.orders.find(
      (o) =>
        o.id !== orderId &&
        o.paymentTransactionId &&
        o.paymentTransactionId.trim() === cleanUtr &&
        (o.paymentStatus === 'Fully Paid' || o.paymentStatus === 'Deposit Paid')
    );
    if (duplicate) {
      return NextResponse.json(
        { error: `This UTR (${cleanUtr}) has already been recorded on Order #${duplicate.id}. Duplicate payments are rejected.` },
        { status: 400 }
      );
    }

    order.paymentStatus = 'Fully Paid';
    order.orderStatus = 'Ready for Fulfilment';
    order.remainingBalance = 0;
    order.paymentMethod = paymentMethod || 'UPI QR Code (Verified UTR)';
    order.paymentTransactionId = cleanUtr;
    order.history.push({
      status: 'Fully Paid',
      timestamp: new Date().toISOString(),
      note: `Pre-order payment of ₹${order.amountPaidToday} fully verified via UPI (UTR: ${cleanUtr}).`,
    });

    db.orders[orderIndex] = order;
    saveDb(db);

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
