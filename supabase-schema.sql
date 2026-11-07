-- ====================================================================
-- VALCURA Haute Parfumerie — Production Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com)
-- ====================================================================

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(64) PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_address TEXT,
    plan TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_quantity INT NOT NULL DEFAULT 1,
    amount_paid_today NUMERIC(10, 2) NOT NULL DEFAULT 0,
    remaining_balance NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_order_value NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL DEFAULT 'Payment Pending',
    order_status TEXT NOT NULL DEFAULT 'Payment Pending',
    payment_method TEXT,
    payment_transaction_id TEXT,
    history JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    email TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    email TEXT PRIMARY KEY,
    source TEXT DEFAULT 'footer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id VARCHAR(64) PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.contact_inquiries(created_at DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) & ACCESS POLICIES
-- ====================================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Service Role policies
DROP POLICY IF EXISTS "Service Role full access on orders" ON public.orders;
CREATE POLICY "Service Role full access on orders" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role full access on customers" ON public.customers;
CREATE POLICY "Service Role full access on customers" ON public.customers FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role full access on newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Service Role full access on newsletter" ON public.newsletter_subscribers FOR ALL USING (true);

DROP POLICY IF EXISTS "Service Role full access on contact" ON public.contact_inquiries;
CREATE POLICY "Service Role full access on contact" ON public.contact_inquiries FOR ALL USING (true);

-- Anon public policies
DROP POLICY IF EXISTS "Anon insert orders" ON public.orders;
CREATE POLICY "Anon insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anon insert customers" ON public.customers;
CREATE POLICY "Anon insert customers" ON public.customers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anon insert newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anon insert newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anon insert contact" ON public.contact_inquiries;
CREATE POLICY "Anon insert contact" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
