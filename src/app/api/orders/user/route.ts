import { NextRequest, NextResponse } from 'next/server';
import { getDb, Order } from '@/lib/db';
import { getUserOrdersFromCloud } from '@/lib/cloudDb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = getDb();

    // 1. Local orders
    const localUserOrders = db.orders.filter(
      (order) => order.customer?.email?.trim().toLowerCase() === cleanEmail
    );

    // 2. Cloud Supabase orders
    let cloudUserOrders: Order[] = [];
    try {
      cloudUserOrders = await getUserOrdersFromCloud(cleanEmail);
    } catch (e) {
      // Gracefully continue
    }

    // Merge and deduplicate by order ID
    const orderMap = new Map<string, Order>();
    [...cloudUserOrders, ...localUserOrders].forEach((ord) => {
      if (ord && ord.id) {
        orderMap.set(ord.id, ord);
      }
    });

    const userOrders = Array.from(orderMap.values());
    userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      orders: userOrders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}
