import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();

    const totalOrders = db.orders.length;
    const fullyPaidOrders = db.orders.filter(
      (o) => o.paymentStatus === 'Fully Paid' || o.orderStatus === 'Fully Paid' || o.orderStatus === 'Ready for Fulfilment'
    );
    const partiallyPaidOrders = db.orders.filter(
      (o) => o.paymentStatus === 'Deposit Paid' || o.orderStatus.includes('Deposit Paid')
    );

    const totalRevenueCollected = db.orders.reduce((acc, o) => acc + (o.amountPaidToday || 0), 0);
    const totalPendingBalances = db.orders.reduce((acc, o) => acc + (o.remainingBalance || 0), 0);
    const totalBottlesReserved = db.orders.reduce((acc, o) => acc + (o.totalQuantity || 0), 0);

    return NextResponse.json({
      products: db.products,
      orders: db.orders,
      stats: {
        totalOrders,
        fullyPaidCount: fullyPaidOrders.length,
        partiallyPaidCount: partiallyPaidOrders.length,
        totalRevenueCollected,
        totalPendingBalances,
        totalBottlesReserved,
      },
    });
  } catch (err: any) {
    console.error('Admin data fetch error:', err);
    return NextResponse.json({ error: 'Server error fetching admin data' }, { status: 500 });
  }
}
