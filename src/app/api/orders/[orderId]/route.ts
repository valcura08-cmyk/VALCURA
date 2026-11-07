import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getOrderFromCloud } from '@/lib/cloudDb';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const db = getDb();
    let order = db.orders.find((o) => o.id === params.orderId);

    if (!order) {
      order = (await getOrderFromCloud(params.orderId)) || undefined;
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('Fetch order error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
