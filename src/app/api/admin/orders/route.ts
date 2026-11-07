import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { syncOrderToCloud } from '@/lib/cloudDb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, newStatus, note } = body;

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'Order ID and new status are required' }, { status: 400 });
    }

    const db = getDb();
    const orderIndex = db.orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = db.orders[orderIndex];
    order.orderStatus = newStatus;

    if (newStatus === 'Fully Paid') {
      order.paymentStatus = 'Fully Paid';
      order.remainingBalance = 0;
    } else if (newStatus === 'Cancelled') {
      order.orderStatus = 'Cancelled';
      order.paymentStatus = 'Cancelled';
    } else if (newStatus === 'Refunded') {
      order.orderStatus = 'Cancelled';
      order.paymentStatus = 'Refunded';
    }

    order.history.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Admin updated order status to "${newStatus}".`,
    });

    db.orders[orderIndex] = order;
    saveDb(db);

    // Sync updated order state to Cloud Database
    await syncOrderToCloud(order);

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error('Update order error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
