import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, saveDb, Order } from '@/lib/db';
import { syncOrderToCloud, getOrderFromCloud } from '@/lib/cloudDb';
import { verifyAdminSessionToken, sanitizeString } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('valcura_admin_session');
    const auth = verifyAdminSessionToken(sessionCookie?.value);
    if (!auth.valid) {
      return NextResponse.json({ error: 'Unauthorized: Atelier session required' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, newStatus, note, isDelivered, trackingNumber, trackingPartner } = body;

    const cleanOrderId = sanitizeString(orderId);
    if (!cleanOrderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const db = getDb();
    let order: any = db.orders.find((o) => o.id === orderId);

    if (!order) {
      const cloudOrder = await getOrderFromCloud(orderId);
      if (cloudOrder) {
        order = cloudOrder;
        db.orders.unshift(cloudOrder);
      }
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

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

    const finalIndex = db.orders.findIndex((o) => o.id === order.id);
    if (finalIndex >= 0) {
      db.orders[finalIndex] = order;
    } else {
      db.orders.unshift(order);
    }
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

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('valcura_admin_session');
    const auth = verifyAdminSessionToken(sessionCookie?.value);
    if (!auth.valid) {
      return NextResponse.json({ error: 'Unauthorized: Atelier session required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = sanitizeString(searchParams.get('id') || '');
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Remove from local store
    const db = getDb();
    const beforeCount = db.orders.length;
    db.orders = db.orders.filter((o) => o.id !== orderId);
    saveDb(db);

    // 2. Remove from Supabase Cloud DB
    try {
      const { deleteOrderFromCloud } = await import('@/lib/cloudDb');
      await deleteOrderFromCloud(orderId);
    } catch (e) {
      console.warn('Failed to delete order from cloud:', e);
    }

    return NextResponse.json({
      success: true,
      message: `Order #${orderId} deleted successfully from atelier database and cloud.`,
      deletedCount: beforeCount - db.orders.length,
    });
  } catch (err: any) {
    console.error('Delete order error:', err);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
