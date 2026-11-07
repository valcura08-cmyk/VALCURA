import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const db = getDb();
    const order = db.orders.find((o) => o.id === params.orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('Fetch order error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
