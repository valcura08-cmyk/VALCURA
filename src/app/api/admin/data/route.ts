import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, saveDb, Order } from '@/lib/db';
import { getCustomersFromCloud, getOrdersFromCloud } from '@/lib/cloudDb';
import { verifyAdminSessionToken } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SESSION_COOKIE_NAME = 'valcura_admin_session';

// Helper to generate a consistent, deterministic client account ID
function generateAccountId(email: string, phone: string = ''): string {
  const seed = (email + phone).toLowerCase();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const code = Math.abs(hash % 90000) + 10000;
  return `VAL-CUST-${code}`;
}

export async function GET() {
  try {
    // Cryptographic Session Guard
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    const auth = verifyAdminSessionToken(sessionCookie?.value);
    if (!auth.valid) {
      return NextResponse.json({ error: 'Unauthorized: Atelier session required' }, { status: 401 });
    }

    const db = getDb();

    // 1. Fetch Cloud Orders from Supabase and merge with local store
    let cloudOrders: Order[] = [];
    try {
      cloudOrders = await getOrdersFromCloud();
    } catch (e) {
      console.error('Failed to fetch cloud orders in /api/admin/data:', e);
    }

    const orderMap = new Map<string, Order>();

    // Seed with local orders
    db.orders.forEach((ord) => {
      if (ord && ord.id) {
        orderMap.set(ord.id, ord);
      }
    });

    // Cloud orders take precedence and enrich local state
    cloudOrders.forEach((cloudOrd) => {
      if (!cloudOrd || !cloudOrd.id) return;
      const localOrd = orderMap.get(cloudOrd.id);
      if (!localOrd) {
        orderMap.set(cloudOrd.id, cloudOrd);
      } else {
        const isPaid = cloudOrd.paymentStatus === 'Fully Paid' || localOrd.paymentStatus === 'Fully Paid';
        const isDelivered =
          cloudOrd.orderStatus === 'Delivered' ||
          (cloudOrd as any).isDelivered === true ||
          localOrd.orderStatus === 'Delivered' ||
          (localOrd as any).isDelivered === true;

        orderMap.set(cloudOrd.id, {
          ...localOrd,
          ...cloudOrd,
          paymentStatus: isPaid ? 'Fully Paid' : (cloudOrd.paymentStatus || localOrd.paymentStatus),
          orderStatus: isDelivered
            ? 'Delivered'
            : isPaid
            ? cloudOrd.orderStatus !== 'Payment Pending'
              ? cloudOrd.orderStatus
              : 'Ready for Fulfilment'
            : cloudOrd.orderStatus,
          paymentTransactionId: cloudOrd.paymentTransactionId || localOrd.paymentTransactionId || '',
          isDelivered: !!isDelivered,
          history: (cloudOrd.history?.length || 0) >= (localOrd.history?.length || 0) ? cloudOrd.history : localOrd.history,
          customer: {
            ...localOrd.customer,
            ...cloudOrd.customer,
          },
        });
      }
    });

    const allOrders = Array.from(orderMap.values());
    allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Sync cloud orders into local store cache
    if (cloudOrders.length > 0 && db.orders.length !== allOrders.length) {
      db.orders = allOrders;
      saveDb(db);
    }

    // Ensure all orders have client account ID
    allOrders.forEach((o: any) => {
      if (o.customer) {
        if (!o.customer.accountId) {
          o.customer.accountId = generateAccountId(o.customer.email || '', o.customer.phone || '');
        }
        if (o.orderStatus === 'Delivered') {
          o.isDelivered = true;
        } else if (o.isDelivered === undefined) {
          o.isDelivered = false;
        }
      }
    });

    // 2. Load Inquiries / Requests from db.settings.contactInquiries
    const contactInquiries: any[] = Array.isArray(db.settings?.contactInquiries)
      ? db.settings.contactInquiries
      : [];

    // Ensure all inquiries have accountId and timestamps
    contactInquiries.forEach((inq: any) => {
      if (!inq.accountId) {
        inq.accountId = generateAccountId(inq.email || '', inq.phone || '');
      }
    });

    // 3. Load Newsletter Subscribers
    const subscribers: any[] = Array.isArray(db.settings?.newsletterSubscribers)
      ? db.settings.newsletterSubscribers
      : [];

    // 4. Metrics
    const totalOrders = allOrders.length;
    const fullyPaidOrders = allOrders.filter(
      (o) =>
        o.paymentStatus === 'Fully Paid' ||
        o.orderStatus === 'Fully Paid' ||
        o.orderStatus === 'Ready for Fulfilment' ||
        o.orderStatus === 'Delivered'
    );
    const deliveredOrders = allOrders.filter(
      (o: any) => o.isDelivered === true || o.orderStatus === 'Delivered'
    );
    const pendingDeliveryOrders = allOrders.filter(
      (o: any) =>
        o.orderStatus !== 'Cancelled' &&
        o.orderStatus !== 'Refunded' &&
        o.isDelivered !== true &&
        o.orderStatus !== 'Delivered'
    );
    const partiallyPaidOrders = allOrders.filter(
      (o) => o.paymentStatus === 'Deposit Paid' || o.orderStatus.includes('Deposit Paid')
    );

    const totalRevenueCollected = allOrders.reduce((acc, o) => acc + (o.amountPaidToday || 0), 0);
    const totalPendingBalances = allOrders.reduce((acc, o) => acc + (o.remainingBalance || 0), 0);
    const totalBottlesReserved = allOrders.reduce((acc, o) => acc + (o.totalQuantity || 0), 0);

    const openRequestsCount = contactInquiries.filter(
      (r: any) => r.status === 'New' || r.status === 'In Progress'
    ).length;

    // 5. Aggregate Customers with Action Diagnostics ("Where We Are Lacking")
    const customerMap = new Map<string, any>();

    // From local registeredUsers
    const localUsers = Array.isArray(db.settings?.registeredUsers)
      ? db.settings.registeredUsers
      : [];
    localUsers.forEach((u: any) => {
      if (u && u.email) {
        const cleanEmail = u.email.toLowerCase().trim();
        customerMap.set(cleanEmail, {
          accountId: generateAccountId(cleanEmail, u.phone || ''),
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
    allOrders.forEach((o: any) => {
      if (o.customer && o.customer.email) {
        const cleanEmail = o.customer.email.toLowerCase().trim();
        const existing = customerMap.get(cleanEmail) || {};
        const accountId =
          o.customer.accountId || existing.accountId || generateAccountId(cleanEmail, o.customer.phone || '');

        customerMap.set(cleanEmail, {
          accountId,
          email: cleanEmail,
          fullName: existing.fullName || o.customer.fullName || cleanEmail.split('@')[0],
          phone: existing.phone || o.customer.phone || '',
          address: `${o.customer.addressLine1 || o.customer.address || ''}${
            o.customer.addressLine2 ? ', ' + o.customer.addressLine2 : ''
          }`,
          addressLine1: o.customer.addressLine1 || o.customer.address || '',
          addressLine2: o.customer.addressLine2 || '',
          landmark: o.customer.landmark || '',
          city: o.customer.city || '',
          state: o.customer.state || '',
          pincode: o.customer.pincode || '',
          registeredAt: existing.registeredAt || o.createdAt,
          lastActiveAt: o.createdAt,
          provider: existing.provider || 'checkout',
          source: existing.source || 'Direct Pre-Order',
        });
      }
    });

    // From Inquiries
    contactInquiries.forEach((inq: any) => {
      if (inq.email) {
        const cleanEmail = inq.email.toLowerCase().trim();
        if (!customerMap.has(cleanEmail)) {
          customerMap.set(cleanEmail, {
            accountId: inq.accountId || generateAccountId(cleanEmail, inq.phone || ''),
            email: cleanEmail,
            fullName: inq.name || cleanEmail.split('@')[0],
            phone: inq.phone || '',
            registeredAt: inq.createdAt,
            lastActiveAt: inq.createdAt,
            provider: 'contact_form',
            source: 'Website Inquiry',
          });
        }
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
            accountId: existing.accountId || generateAccountId(cleanEmail, c.phone || ''),
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
      // Gracefully continue
    }

    // Compute Diagnostics & Gaps for each customer
    const customers = Array.from(customerMap.values()).map((cust) => {
      const cleanEmail = cust.email.toLowerCase().trim();
      const customerOrders = allOrders.filter(
        (o) => o.customer?.email?.toLowerCase().trim() === cleanEmail
      );
      const customerInquiries = contactInquiries.filter(
        (inq) => inq.email?.toLowerCase().trim() === cleanEmail
      );

      const ordersCount = customerOrders.length;
      const totalSpent = customerOrders.reduce((sum, o) => sum + (o.amountPaidToday || 0), 0);
      const pendingBalance = customerOrders.reduce((sum, o) => sum + (o.remainingBalance || 0), 0);

      // Audit gaps ("where we are lacking")
      const lackingGaps: Array<{
        type: 'delivery' | 'inquiry' | 'address' | 'payment' | 'tracking';
        severity: 'high' | 'medium' | 'info';
        title: string;
        description: string;
        orderId?: string;
        inquiryId?: string;
      }> = [];

      // 1. Delivery Gap Check: Is an order awaiting delivery tick?
      customerOrders.forEach((o: any) => {
        if (
          o.orderStatus !== 'Cancelled' &&
          o.orderStatus !== 'Refunded' &&
          o.isDelivered !== true &&
          o.orderStatus !== 'Delivered'
        ) {
          lackingGaps.push({
            type: 'delivery',
            severity: 'high',
            title: `Delivery Tick Pending (Order #${o.id})`,
            description: `Flacon (${o.items?.[0]?.productName || 'Fragrance'}) has not been marked as delivered yet. Tick once delivered to client.`,
            orderId: o.id,
          });
        }

        // 2. Tracking Gap Check
        if (
          o.orderStatus !== 'Cancelled' &&
          o.orderStatus !== 'Refunded' &&
          !o.isDelivered &&
          !o.trackingNumber
        ) {
          lackingGaps.push({
            type: 'tracking',
            severity: 'medium',
            title: `Courier Tracking Missing (Order #${o.id})`,
            description: `Courier partner AWB tracking number has not been assigned for ${o.customer?.city || 'destination'}.`,
            orderId: o.id,
          });
        }

        // 3. Address Completeness Gap Check
        if (!o.customer?.landmark || o.customer.landmark.trim().length === 0) {
          lackingGaps.push({
            type: 'address',
            severity: 'info',
            title: `Nearby Landmark Missing in Delivery Address`,
            description: `Courier might face difficulty locating destination (${o.customer?.city || 'city'}). Consider asking client for nearby landmark.`,
            orderId: o.id,
          });
        }
      });

      // 4. Inquiries / Messages Gap Check
      customerInquiries.forEach((inq: any) => {
        if (inq.status === 'New' || inq.status === 'In Progress') {
          lackingGaps.push({
            type: 'inquiry',
            severity: inq.category?.includes('Cancellation') ? 'high' : 'medium',
            title: `Unresolved Client Inquiry: "${inq.subject || 'Website Message'}"`,
            description: `Client sent: "${(inq.message || '').slice(0, 80)}...". Needs response / tick resolution.`,
            inquiryId: inq.id,
          });
        }
      });

      // 5. Payment Gap Check
      if (pendingBalance > 0) {
        lackingGaps.push({
          type: 'payment',
          severity: 'medium',
          title: `Pending Balance Settlement: ₹${pendingBalance}`,
          description: `Outstanding balance awaiting collection upon bottle availability.`,
        });
      }

      const statusScore: 'Lacking Attention' | 'All Clear' =
        lackingGaps.length > 0 ? 'Lacking Attention' : 'All Clear';

      return {
        ...cust,
        ordersCount,
        totalSpent,
        pendingBalance,
        recentOrderId: customerOrders[0]?.id || null,
        orders: customerOrders,
        inquiries: customerInquiries,
        lackingGaps,
        lackingCount: lackingGaps.length,
        statusScore,
      };
    });

    // Sort: Clients with lacking action gaps first, then newest activity
    customers.sort((a, b) => {
      if (b.lackingCount !== a.lackingCount) {
        return b.lackingCount - a.lackingCount;
      }
      return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
    });

    return NextResponse.json({
      products: db.products,
      orders: allOrders,
      customers,
      requests: contactInquiries,
      subscribers,
      stats: {
        totalOrders,
        fullyPaidCount: fullyPaidOrders.length,
        deliveredCount: deliveredOrders.length,
        pendingDeliveryCount: pendingDeliveryOrders.length,
        partiallyPaidCount: partiallyPaidOrders.length,
        totalRevenueCollected,
        totalPendingBalances,
        totalBottlesReserved,
        openRequestsCount,
        totalRegisteredCustomers: customers.length,
      },
    });
  } catch (err: any) {
    console.error('Admin data fetch error:', err);
    return NextResponse.json({ error: 'Server error fetching admin data' }, { status: 500 });
  }
}
