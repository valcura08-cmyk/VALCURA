import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, saveDb } from '@/lib/db';
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
    const { productId, status, inventory, shortDescription, notes, fullPrice, standardPrice } = body;

    const cleanProductId = sanitizeString(productId);
    if (!cleanProductId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const db = getDb();
    const productIndex = db.products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = db.products[productIndex];
    const oldStatus = product.status;

    if (status) {
      product.status = status;
      product.isAvailable = status === 'Available';
      product.isPreorder = status === 'Pre-order';
      product.isComingSoon = status === 'Coming Soon';
    }

    if (typeof inventory === 'number') product.inventory = inventory;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (Array.isArray(notes)) product.notes = notes;
    if (typeof fullPrice === 'number') product.fullPrice = fullPrice;
    if (typeof standardPrice === 'number') product.standardPrice = standardPrice;

    db.products[productIndex] = product;

    // WORKFLOW: If status transitioned to 'Available' from 'Pre-order', trigger automated customer notification process!
    let notifiedOrdersCount = 0;
    if (status === 'Available' && oldStatus === 'Pre-order') {
      const now = new Date().toISOString();

      db.orders = db.orders.map((order) => {
        const containsProduct = order.items.some((i) => i.productId === productId);
        if (!containsProduct) return order;

        notifiedOrdersCount++;
        order.availabilityNotified = true;
        order.availabilityNotifiedAt = now;

        if (order.remainingBalance > 0) {
          // Partially paid customer: initiate balance payment link
          order.orderStatus = 'Ready for Balance Payment';
          order.history.push({
            status: 'Ready for Balance Payment',
            timestamp: now,
            note: `Product "${product.name}" marked Available. Availability alert triggered. Secure balance payment link sent: /pay-balance/${order.id} for remaining ₹${order.remainingBalance}.`,
          });
        } else {
          // Fully paid customer: move to Ready for Fulfilment
          order.orderStatus = 'Ready for Fulfilment';
          order.history.push({
            status: 'Ready for Fulfilment',
            timestamp: now,
            note: `Product "${product.name}" marked Available. Availability alert triggered. Customer notified of priority fulfilment.`,
          });
        }

        return order;
      });
    }

    saveDb(db);

    return NextResponse.json({
      success: true,
      product,
      notifiedOrdersCount,
      triggeredWorkflow: status === 'Available' && oldStatus === 'Pre-order',
    });
  } catch (err: any) {
    console.error('Update product error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
