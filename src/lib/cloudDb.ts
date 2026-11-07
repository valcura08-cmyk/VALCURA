import { Order } from './db';

/**
 * Cloud Database Connector for VALCURA
 *
 * Supports Supabase / PostgreSQL REST API with zero external dependencies.
 * If SUPABASE_URL and SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are set,
 * all customer profiles, orders, preorders, newsletters, and contact inquiries
 * will automatically persist permanently in the cloud.
 */

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return {
    url: url.replace(/\/$/, ''),
    key,
  };
}

/**
 * Persist an order to Supabase
 */
export async function syncOrderToCloud(order: Order): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config) return false;

  try {
    const res = await fetch(`${config.url}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: order.id,
        created_at: order.createdAt,
        customer_name: order.customer.fullName,
        customer_email: order.customer.email.toLowerCase(),
        customer_phone: order.customer.phone,
        customer_address: `${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`,
        plan: order.plan,
        items: order.items,
        total_quantity: order.totalQuantity,
        amount_paid_today: order.amountPaidToday,
        remaining_balance: order.remainingBalance,
        total_order_value: order.totalOrderValue,
        payment_status: order.paymentStatus,
        order_status: order.orderStatus,
        payment_method: order.paymentMethod,
        payment_transaction_id: order.paymentTransactionId,
        history: order.history,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Supabase syncOrder error:', res.status, errText);
      return false;
    }

    // Also upsert customer profile
    await upsertCustomerProfile({
      fullName: order.customer.fullName,
      email: order.customer.email,
      phone: order.customer.phone,
      address: order.customer.address,
      city: order.customer.city,
      state: order.customer.state,
      pincode: order.customer.pincode,
    });

    return true;
  } catch (err) {
    console.error('Failed to sync order to cloud database:', err);
    return false;
  }
}

/**
 * Update an existing order in Supabase
 */
export async function updateOrderInCloud(
  orderId: string,
  updates: Record<string, any>
): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config) return false;

  try {
    const res = await fetch(`${config.url}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      console.error('Supabase updateOrder error:', res.status, await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to update order in cloud database:', err);
    return false;
  }
}

/**
 * Upsert customer record
 */
export async function upsertCustomerProfile(customer: {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config) return false;

  try {
    const res = await fetch(`${config.url}/rest/v1/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        email: customer.email.toLowerCase().trim(),
        full_name: customer.fullName.trim(),
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        pincode: customer.pincode || '',
        last_active_at: new Date().toISOString(),
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to upsert customer:', err);
    return false;
  }
}

/**
 * Record a newsletter subscriber
 */
export async function recordNewsletterLead(email: string, source: string = 'footer'): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config) return false;

  try {
    const res = await fetch(`${config.url}/rest/v1/newsletter_subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        source,
        created_at: new Date().toISOString(),
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to record newsletter lead in cloud:', err);
    return false;
  }
}

/**
 * Record a customer contact inquiry
 */
export async function recordContactInquiry(inquiry: {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config) return false;

  try {
    const res = await fetch(`${config.url}/rest/v1/contact_inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
      body: JSON.stringify({
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email.toLowerCase(),
        subject: inquiry.subject,
        message: inquiry.message,
        created_at: inquiry.createdAt,
        status: 'New',
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('Failed to record contact inquiry in cloud:', err);
    return false;
  }
}

/**
 * Fetch all registered customers from Supabase
 */
export async function getCustomersFromCloud(): Promise<any[]> {
  const config = getSupabaseConfig();
  if (!config) return [];

  try {
    const res = await fetch(`${config.url}/rest/v1/customers?select=*&order=last_active_at.desc`, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    });

    if (res.ok) {
      return await res.json();
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch customers from cloud:', err);
    return [];
  }
}

/**
 * Helper to convert Supabase row to Order
 */
function mapCloudRowToOrder(r: any): Order {
  return {
    id: r.id,
    createdAt: r.created_at,
    customer: {
      fullName: r.customer_name || '',
      email: r.customer_email || '',
      phone: r.customer_phone || '',
      address: r.customer_address || '',
      city: '',
      state: '',
      pincode: '',
    },
    plan: r.plan,
    items: Array.isArray(r.items) ? r.items : [],
    totalQuantity: r.total_quantity || 0,
    amountPaidToday: r.amount_paid_today || 0,
    remainingBalance: r.remaining_balance || 0,
    totalOrderValue: r.total_order_value || 0,
    paymentStatus: r.payment_status || '',
    orderStatus: r.order_status || '',
    paymentMethod: r.payment_method || '',
    paymentTransactionId: r.payment_transaction_id || '',
    availabilityNotified: false,
    history: Array.isArray(r.history) ? r.history : [],
  };
}

/**
 * Fetch all orders from Supabase (for Admin Dashboard)
 */
export async function getOrdersFromCloud(): Promise<Order[]> {
  const config = getSupabaseConfig();
  if (!config) return [];

  try {
    const res = await fetch(`${config.url}/rest/v1/orders?select=*&order=created_at.desc`, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        return rows.map(mapCloudRowToOrder);
      }
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch orders from cloud:', err);
    return [];
  }
}

/**
 * Fetch a single order by ID from Supabase
 */
export async function getOrderFromCloud(orderId: string): Promise<Order | null> {
  const config = getSupabaseConfig();
  if (!config) return null;

  try {
    const res = await fetch(
      `${config.url}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}&select=*`,
      {
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
        },
      }
    );

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        return mapCloudRowToOrder(rows[0]);
      }
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch order by ID from cloud:', err);
    return null;
  }
}

/**
 * Fetch all orders for a specific user email from Supabase
 */
export async function getUserOrdersFromCloud(email: string): Promise<Order[]> {
  const config = getSupabaseConfig();
  if (!config) return [];

  try {
    const cleanEmail = email.toLowerCase().trim();
    const res = await fetch(
      `${config.url}/rest/v1/orders?customer_email=eq.${encodeURIComponent(cleanEmail)}&select=*&order=created_at.desc`,
      {
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
        },
      }
    );

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        return rows.map(mapCloudRowToOrder);
      }
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch user orders from cloud:', err);
    return [];
  }
}
