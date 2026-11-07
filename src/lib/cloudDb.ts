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
