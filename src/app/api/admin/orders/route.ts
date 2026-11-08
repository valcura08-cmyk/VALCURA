import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, saveDb } from '@/lib/db';
import { syncOrderToCloud } from '@/lib/cloudDb';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('valcura_admin_session');
    if (!sessionCookie || sessionCookie.value !== 'valcura_auth_session_token_verified_2026') {
      return NextResponse.json({ error: 'Unauthorized: Atelier session required' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, newStatus, note, isDelivered, trackingNumber, trackingPartner } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const db = getDb();
    const orderIndex = db.orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = db.orders[orderIndex] as any;

    // Handle delivery tick checkbox
    if (typeof isDelivered === 'boolean') {
      order.isDelivered = isDelivered;
      if (isDelivered) {
        order.orderStatus = 'Delivered';
        order.deliveredAt = new Date().toISOString();
        if (!order.history) order.history = [];
        order.history.push({
          status: 'Delivered',
          timestamp: new Date().toISOString(),
          note: note || `Admin ticked order as DELIVERED to client ${order.customer?.fullName || ''}.`,
        });
      } else {
        order.orderStatus = 'Ready for Fulfilment';
        order.deliveredAt = null;
        if (!order.history) order.history = [];
        order.history.push({
          status: 'Ready for Fulfilment',
          timestamp: new Date().toISOString(),
          note: note || 'Admin unticked delivered status. Order reset to Ready for Fulfilment.',
        });
      }
    } else if (newStatus) {
      order.orderStatus = newStatus;

      if (newStatus === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date().toISOString();
      } else if (newStatus === 'Fully Paid') {
        order.paymentStatus = 'Fully Paid';
        order.remainingBalance = 0;
      } else if (newStatus === 'Cancelled') {
        order.orderStatus = 'Cancelled';
        order.paymentStatus = 'Cancelled';
      } else if (newStatus === 'Refunded') {
        order.orderStatus = 'Cancelled';
        order.paymentStatus = 'Refunded';
      }

      if (!order.history) order.history = [];
      order.history.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note || `Admin updated order status to "${newStatus}".`,
      });
    }

    // Handle courier tracking info
    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber.trim();
    }
    if (trackingPartner !== undefined) {
      order.trackingPartner = trackingPartner.trim();
    }

    db.orders[orderIndex] = order;
    saveDb(db);

    // Sync updated order state to Cloud Database
    try {
      await syncOrderToCloud(order);
    } catch (e) {
      // Gracefully continue
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error('Update order error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
