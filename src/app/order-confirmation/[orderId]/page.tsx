import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Clock } from 'lucide-react';
import { getDb } from '@/lib/db';

interface Props {
  params: { orderId: string };
}

export default function OrderConfirmationPage({ params }: Props) {
  const db = getDb();
  const order = db.orders.find((o) => o.id === params.orderId);

  if (!order) {
    notFound();
  }

  const isDeposit = order.plan === 'deposit';

  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Top Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#E8E2D8] bg-[#FAF8F5] text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>
          <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
            Pre-Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif uppercase tracking-wide text-[#110D09]">
            Thank You, {order.customer.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-[#110D09]/70 font-mono">
            Atelier Order Reference: <strong className="text-[#110D09]">{order.id}</strong>
          </p>
        </div>
      </section>

      {/* Main Order Details Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10 shadow-lg space-y-8">
          {/* Status Badge & Notification Banner */}
          <div className="p-4 border bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[#E8E2D8]">
            <div>
              <span className="text-[10px] tracking-widest uppercase text-[#110D09]/50 font-mono block">
                Current Order Status
              </span>
              <p className="text-lg font-serif text-[#110D09] font-bold mt-0.5">
                {order.orderStatus}
              </p>
            </div>
            <div className="text-left sm:text-right text-xs font-mono">
              <span className="text-[#110D09]/50 block">Payment Method:</span>
              <span className="text-[#110D09] font-medium">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Conditional Guidance based on Plan (Full vs Deposit) */}
          {isDeposit ? (
            <div className="bg-[#FAF8F5] border border-[#E8E2D8] p-5 space-y-3">
              <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#8C6D42] font-semibold">
                <Clock className="w-4 h-4 text-[#8C6D42]" />
                <span>Reservation Recorded • Outstanding Balance Protocol</span>
              </div>
              <p className="text-xs text-[#110D09]/80 leading-relaxed font-light">
                Your initial 70% deposit of{' '}
                <strong className="text-[#110D09] font-mono">₹{order.amountPaidToday}</strong> has
                been securely verified and recorded in the VALCURA atelier log.
              </p>
              <div className="p-3 bg-white border border-[#E8E2D8] text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Deposit Received Today:</span>
                  <span className="text-[#110D09] font-bold">₹{order.amountPaidToday}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Outstanding Balance (due on availability):</span>
                  <span className="font-bold">₹{order.remainingBalance}</span>
                </div>
                <div className="flex justify-between text-[#110D09]/60 pt-1 border-t border-[#E8E2D8] text-[11px]">
                  <span>Total Reservation Plan Value:</span>
                  <span>₹{order.totalOrderValue}</span>
                </div>
              </div>
              <p className="text-[11px] text-[#110D09]/60 font-light">
                When the fragrance batch is bottled, you will automatically receive an availability
                notification with a secure link to complete the remaining balance of ₹
                {order.remainingBalance}. You will not be automatically charged.
              </p>
              <div className="pt-2">
                <Link
                  href={`/pay-balance/${order.id}`}
                  className="text-xs text-[#8C6D42] underline hover:text-[#110D09] font-mono font-medium"
                >
                  Direct Balance Payment Portal Link: /pay-balance/{order.id}
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50/60 border border-emerald-200 p-5 space-y-2">
              <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Full Pre-Order Payment Received</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed font-light">
                Your full payment of{' '}
                <strong className="text-emerald-900 font-mono">₹{order.amountPaidToday}</strong> is
                confirmed. Your reservation is locked with priority fulfillment status.
              </p>
              <p className="text-[11px] text-emerald-800/80 font-mono">
                No further payment required. You will receive an availability notification and
                courier tracking once dispatch begins.
              </p>
            </div>
          )}

          {/* Ordered Items Table */}
          <div className="space-y-4">
            <h3 className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono border-b border-[#E8E2D8] pb-2 font-medium">
              Reserved Flacons
            </h3>
            <div className="divide-y divide-[#E8E2D8]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-serif text-[#110D09]">{item.productName}</h4>
                    <p className="text-xs text-[#8C6D42] font-mono">
                      {item.category} • Qty: {item.quantity} •{' '}
                      {item.paymentPlan === 'deposit' ? '70% Reservation' : 'Paid in Full'}
                    </p>
                  </div>
                  <div className="text-right text-xs font-mono">
                    <p className="text-[#110D09] font-bold">₹{item.paidToday} paid</p>
                    {item.remainingBalance > 0 && (
                      <p className="text-[10px] text-amber-700">₹{item.remainingBalance} due later</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[#E8E2D8] text-xs">
            <div className="space-y-2">
              <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Delivery Address
              </span>
              <p className="text-[#110D09] font-semibold">{order.customer.fullName}</p>
              <p className="text-[#110D09]/75 font-light">{order.customer.address}</p>
              <p className="text-[#110D09]/75 font-light">
                {order.customer.city}, {order.customer.state} — {order.customer.pincode}
              </p>
              <p className="text-[#110D09]/75 font-mono">Mobile: +91 {order.customer.phone}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Notification Channel
              </span>
              <p className="text-[#110D09]/75 font-light">
                Confirmation sent to: <strong className="text-[#110D09]">{order.customer.email}</strong>
              </p>
              <p className="text-[11px] text-[#110D09]/50 font-light leading-relaxed">
                Dispatch notifications, courier tracking, and priority allocation updates will be dispatched to this email and
                mobile number.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-6 border-t border-[#E8E2D8] flex flex-col sm:flex-row gap-4">
            <Link href="/" className="btn-luxury-outline text-center flex-1 text-xs">
              Return to Homepage
            </Link>
            <Link
              href="/collections/cacao"
              className="btn-luxury-primary text-center flex-1 text-xs"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
