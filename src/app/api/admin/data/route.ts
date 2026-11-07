import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCustomersFromCloud } from '@/lib/cloudDb';

export async function GET() {
  try {
    const db = getDb();

    // 1. Order metrics
    const totalOrders = db.orders.length;
    const fullyPaidOrders = db.orders.filter(
      (o) =>
        o.paymentStatus === 'Fully Paid' ||
        o.orderStatus === 'Fully Paid' ||
        o.orderStatus === 'Ready for Fulfilment'
    );
    const partiallyPaidOrders = db.orders.filter(
      (o) => o.paymentStatus === 'Deposit Paid' || o.orderStatus.includes('Deposit Paid')
    );

    const totalRevenueCollected = db.orders.reduce((acc, o) => acc + (o.amountPaidToday || 0), 0);
    const totalPendingBalances = db.orders.reduce((acc, o) => acc + (o.remainingBalance || 0), 0);
    const totalBottlesReserved = db.orders.reduce((acc, o) => acc + (o.totalQuantity || 0), 0);

    // 2. Aggregate Customers from Cloud (Supabase) + Local store.json + Order history
    const customerMap = new Map<string, any>();

    // From local registeredUsers
    const localUsers = Array.isArray(db.settings?.registeredUsers)
      ? db.settings.registeredUsers
      : [];
    localUsers.forEach((u: any) => {
      if (u && u.email) {
        const cleanEmail = u.email.toLowerCase().trim();
        customerMap.set(cleanEmail, {
          email: cleanEmail,
          fullName: u.fullName || cleanEmail.split('@')[0],
          phone: u.phone || '',
          registeredAt: u.registeredAt || u.createdAt || new Date().toISOString(),
          lastActiveAt: u.lastLoginAt || u.lastActiveAt || new Date().toISOString(),
          provider: u.provider || 'email',
          source: 'Account Registration',
        });
      }
    });

    // From Order records
    db.orders.forEach((o) => {
      if (o.customer && o.customer.email) {
        const cleanEmail = o.customer.email.toLowerCase().trim();
        const existing = customerMap.get(cleanEmail) || {};
        customerMap.set(cleanEmail, {
          email: cleanEmail,
          fullName: existing.fullName || o.customer.fullName || cleanEmail.split('@')[0],
          phone: existing.phone || o.customer.phone || '',
          address: `${o.customer.address}, ${o.customer.city}, ${o.customer.state} - ${o.customer.pincode}`,
          registeredAt: existing.registeredAt || o.createdAt,
          lastActiveAt: o.createdAt,
          provider: existing.provider || 'checkout',
          source: existing.source || 'Direct Checkout',
        });
      }
    });

    // From Cloud Supabase (if configured)
    try {
      const cloudCustomers = await getCustomersFromCloud();
      cloudCustomers.forEach((c: any) => {
        if (c && c.email) {
          const cleanEmail = c.email.toLowerCase().trim();
          const existing = customerMap.get(cleanEmail) || {};
          customerMap.set(cleanEmail, {
            ...existing,
            email: cleanEmail,
            fullName: c.full_name || existing.fullName || cleanEmail.split('@')[0],
            phone: c.phone || existing.phone || '',
            address: c.address || existing.address || '',
            lastActiveAt: c.last_active_at || existing.lastActiveAt || new Date().toISOString(),
            registeredAt: c.created_at || existing.registeredAt || new Date().toISOString(),
          });
        }
      });
    } catch (e) {
      // Gracefully continue if cloud query fails
    }

    // Compute order counts and spend for each customer
    const customers = Array.from(customerMap.values()).map((cust) => {
      const customerOrders = db.orders.filter(
        (o) => o.customer?.email?.toLowerCase().trim() === cust.email
      );
      const ordersCount = customerOrders.length;
      const totalSpent = customerOrders.reduce((sum, o) => sum + (o.amountPaidToday || 0), 0);
      const pendingBalance = customerOrders.reduce((sum, o) => sum + (o.remainingBalance || 0), 0);

      return {
        ...cust,
        ordersCount,
        totalSpent,
        pendingBalance,
        recentOrderId: customerOrders[0]?.id || null,
      };
    });

    // Sort newest activity first
    customers.sort(
      (a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
    );

    return NextResponse.json({
      products: db.products,
      orders: db.orders,
      customers,
      stats: {
        totalOrders,
        fullyPaidCount: fullyPaidOrders.length,
        partiallyPaidCount: partiallyPaidOrders.length,
        totalRevenueCollected,
        totalPendingBalances,
        totalBottlesReserved,
        totalRegisteredCustomers: customers.length,
      },
    });
  } catch (err: any) {
    console.error('Admin data fetch error:', err);
    return NextResponse.json({ error: 'Server error fetching admin data' }, { status: 500 });
  }
}
