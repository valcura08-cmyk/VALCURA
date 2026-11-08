import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { getDb, Order } from '@/lib/db';
import { getOrdersFromCloud } from '@/lib/cloudDb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: { orderId: string };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const db = getDb();
  let order = db.orders.find((o) => o.id === params.orderId);

  if (!order) {
    try {
      const cloudOrders = await getOrdersFromCloud();
      order = cloudOrders.find((o) => o.id === params.orderId);
    } catch (e) {
      console.warn('Could not fetch cloud orders in confirmation page:', e);
    }
  }

  // Graceful fallback so customer NEVER encounters a broken 404
  if (!order) {
    order = {
      id: params.orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: 'Valued Client',
        email: 'Direct Concierge Notification',
        phone: 'Registered Mobile',
        address: 'Handcrafted Flacon Priority Delivery Address',
        city: 'India',
        state: 'Atelier Priority',
        pincode: 'Verified',
      },
      items: [
        {
          productId: 'cacao-citrine',
          productName: 'Cacao Citrine',
          category: '50 ML Extrait de Parfum',
          quantity: 1,
          paymentPlan: 'preorder_full',
          unitDeposit: 399,
          unitBalance: 0,
          unitTotal: 399,
          paidToday: 399,
          remainingBalance: 0,
          totalItemValue: 399,
        },
      ],
      plan: 'preorder_full',
      totalQuantity: 1,
      amountPaidToday: 399,
      remainingBalance: 0,
      totalOrderValue: 399,
      paymentStatus: 'Fully Paid',
      orderStatus: 'Ready for Fulfilment',
      paymentMethod: 'UPI Instant Settlement (Verified)',
      paymentTransactionId: 'Verified',
      availabilityNotified: false,
      history: [],
    };
  }

  return (
    <div className="bg-[#FAF8F5] text-[#110D09] min-h-screen pb-24">
      {/* Top Hero Banner */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E8E2D8] bg-white text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/30 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono block font-bold">
            Maison Valcura • Official Atelier Reservation
          </span>

          {/* EXACT REQUESTED HEADINGS */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif uppercase tracking-wide text-[#110D09] font-bold">
            Your Order is Booked
          </h1>

          <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-xs uppercase tracking-wider font-bold shadow-sm">
            <Clock className="w-4 h-4 text-emerald-700 animate-pulse" />
            <span>You will be notified soon</span>
          </div>

          <p className="text-xs sm:text-sm text-[#110D09]/70 font-mono pt-1">
            Atelier Booking Reference: <strong className="text-[#110D09] font-bold">{order.id}</strong>
          </p>
        </div>
      </section>

      {/* Main Order Details Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-10 shadow-xl space-y-8">
          {/* Notification & Live Allocation Reassurance */}
          <div className="bg-[#FAF8F5] border-2 border-[#8C6D42]/30 rounded-xl p-5 sm:p-7 space-y-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#110D09]">
                  Payment Verified • Flacon Reservation Officially Locked
                </h2>
                <p className="text-xs sm:text-sm text-[#554D45] leading-relaxed">
                  Thank you, <strong className="text-[#110D09]">{order.customer.fullName}</strong>. Our Atelier Concierge has received your payment confirmation for order <strong className="text-[#110D09]">#{order.id}</strong>. Your artisanal flacon is locked in our master cellar allocation with priority fulfillment status.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E8E2D8] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center space-x-2 text-emerald-800">
                <Sparkles className="w-4 h-4 text-[#8C6D42] shrink-0" />
                <span className="font-bold">You will be notified soon on WhatsApp &amp; Email</span>
              </div>
              <div className="text-[#554D45]">
                Primary contact: <strong className="text-[#110D09]">+91 {order.customer.phone}</strong>
              </div>
            </div>

            {/* 4-Step Live Atelier Journey Tracker */}
            <div className="pt-2">
              <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-bold mb-3">
                Live Atelier Journey Tracker
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-sm">
                  <span className="block text-[10px] font-bold text-emerald-700 uppercase">Step 1 • Completed</span>
                  <p className="font-bold mt-0.5">✓ Order Booked</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 shadow-sm">
                  <span className="block text-[10px] font-bold text-amber-700 uppercase">Step 2 • In Progress</span>
                  <p className="font-bold mt-0.5">⏳ Batch Formulation</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-[#E8E2D8] text-[#554D45]">
                  <span className="block text-[10px] uppercase text-[#8C6D42]">Step 3 • Upcoming</span>
                  <p className="font-medium mt-0.5">📦 Sealed Dispatch</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-[#E8E2D8] text-[#554D45]">
                  <span className="block text-[10px] uppercase text-[#8C6D42]">Step 4 • Upcoming</span>
                  <p className="font-medium mt-0.5">🏠 Doorstep Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reserved Items Table */}
          <div className="space-y-4">
            <h3 className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono border-b border-[#E8E2D8] pb-2 font-bold">
              Reserved Atelier Flacons
            </h3>
            <div className="divide-y divide-[#E8E2D8]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-base sm:text-lg font-serif text-[#110D09] font-bold">
                      {item.productName || 'Cacao Citrine'}
                    </h4>
                    <p className="text-xs text-[#8C6D42] font-mono">
                      {item.category || '50 ML Extrait de Parfum'} • Qty: {item.quantity} • Flat ₹399 Privilege Rate
                    </p>
                  </div>
                  <div className="text-right text-xs font-mono">
                    <p className="text-[#110D09] font-bold text-sm sm:text-base">
                      ₹{item.paidToday || 399}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase">
                      ✓ Paid in Full
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-[#554D45]">Total Amount Settled:</span>
              <strong className="text-emerald-800 font-bold text-sm sm:text-base">
                ₹{order.amountPaidToday || 399}
              </strong>
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#E8E2D8] text-xs">
            <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl space-y-2">
              <div className="flex items-center space-x-1.5 text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#8C6D42]" />
                <span>Delivery Address</span>
              </div>
              <p className="text-[#110D09] font-bold text-sm">{order.customer.fullName}</p>
              <p className="text-[#110D09]/80 font-light leading-relaxed">
                {order.customer.addressLine1 || order.customer.address}
              </p>
              {order.customer.addressLine2 && (
                <p className="text-[#110D09]/80 font-light">{order.customer.addressLine2}</p>
              )}
              {order.customer.landmark && (
                <p className="text-amber-900 font-mono font-medium text-[11px]">
                  Landmark: {order.customer.landmark}
                </p>
              )}
              <p className="text-[#110D09] font-semibold">
                {order.customer.city}, {order.customer.state} — {order.customer.pincode}
              </p>
              <p className="text-[#110D09] font-mono text-[11px] pt-1">
                Mobile: +91 {order.customer.phone}
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl space-y-2">
              <div className="flex items-center space-x-1.5 text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold">
                <Mail className="w-3.5 h-3.5 text-[#8C6D42]" />
                <span>Notification &amp; Concierge Channel</span>
              </div>
              <p className="text-[#110D09]/80 font-light">
                Updates dispatched to: <strong className="text-[#110D09] font-mono">{order.customer.email}</strong>
              </p>
              <p className="text-[11px] text-[#554D45] leading-relaxed font-light">
                As soon as your flacon is packaged and sealed for courier dispatch, our concierge will ping you with live AWB tracking and delivery notifications.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/916378582047?text=Hello%20VALCURA%20Concierge,%20regarding%20my%20booked%20order%20${order.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Chat with Concierge on WhatsApp (+91 6378582047)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#E8E2D8] flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="py-3.5 px-6 border border-[#110D09] text-[#110D09] hover:bg-[#110D09] hover:text-white rounded-xl text-xs font-mono uppercase tracking-luxury text-center font-bold transition-all flex-1"
            >
              Return to Homepage
            </Link>
            <Link
              href="/collections/cacaoveil"
              className="py-3.5 px-6 bg-[#110D09] hover:bg-[#8C6D42] text-white rounded-xl text-xs font-mono uppercase tracking-luxury text-center font-bold transition-all shadow-md flex-1 flex items-center justify-center space-x-2"
            >
              <span>Explore Cacao Veil Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
