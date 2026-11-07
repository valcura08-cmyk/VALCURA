'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Smartphone,
  CreditCard,
  Building,
} from 'lucide-react';
import { Order } from '@/lib/db';

export default function PayBalancePortalPage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [params.orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.orderId}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      setOrder(data);
    } catch (e) {
      console.error(e);
      setErrorMsg('Could not locate the requested order.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayRemainingBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      setErrorMsg('Please enter a valid UPI ID (e.g. name@okhdfcbank).');
      return;
    }

    setProcessing(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders/pay-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          paymentMethod:
            paymentMethod === 'upi'
              ? `UPI (${upiId})`
              : paymentMethod === 'card'
              ? 'Card Payment'
              : 'NetBanking',
          balanceTransactionId: `bal_txn_${Math.random().toString(36).substring(2, 10)}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete balance payment');
      }

      setOrder(data.order);
      setPaymentSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Transaction failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white text-[#110D09] min-h-screen py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#110D09] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[#110D09]/60 mt-4 font-mono">Loading secure balance portal...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white text-[#110D09] min-h-screen py-24 px-4 text-center">
        <h1 className="text-2xl font-serif text-[#110D09]">Order Not Found</h1>
        <p className="text-xs text-[#110D09]/60 mt-2">
          Unable to locate order reference {params.orderId}.
        </p>
        <Link href="/" className="btn-luxury-primary mt-6 inline-block text-xs">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 text-xs tracking-luxury uppercase text-[#8C6D42] font-mono font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Balance Payment Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-wide text-[#110D09]">
            Finalize Your Fragrance Allocation
          </h1>
          <p className="text-xs sm:text-sm text-[#110D09]/60 font-mono">
            Atelier Order: <strong className="text-[#110D09]">{order.id}</strong>
          </p>
        </div>

        {paymentSuccess || order.remainingBalance === 0 ? (
          /* Success Screen */
          <div className="bg-white border border-emerald-400 p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-700" />
            </div>
            <span className="text-xs tracking-luxury uppercase text-emerald-700 font-mono font-semibold block">
              100% Fully Paid
            </span>
            <h2 className="text-3xl font-serif uppercase tracking-wide text-[#110D09]">
              Order Ready For Fulfilment
            </h2>
            <p className="text-sm text-[#110D09]/80 font-light max-w-lg mx-auto leading-relaxed">
              Your remaining balance has been received and verified. Your order status has been
              updated to <strong className="text-emerald-800">Ready for Fulfilment</strong>. Our atelier
              is preparing your flacon for dispatch.
            </p>

            <div className="bg-[#FAF8F5] border border-[#E8E2D8] p-4 max-w-md mx-auto text-xs font-mono text-left space-y-1">
              <div className="flex justify-between">
                <span>Total Order Value:</span>
                <span className="text-[#110D09] font-bold">₹{order.totalOrderValue}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-700 font-bold">₹{order.amountPaidToday}</span>
              </div>
              <div className="flex justify-between">
                <span>Outstanding Balance:</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between text-[#110D09]/50 pt-1">
                <span>Recipient:</span>
                <span>{order.customer.fullName}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link href={`/order-confirmation/${order.id}`} className="btn-luxury-outline text-xs">
                View Updated Confirmation Receipt
              </Link>
              <Link href="/" className="btn-luxury-primary text-xs">
                Return to Atelier Home
              </Link>
            </div>
          </div>
        ) : (
          /* Outstanding Balance Payment Form */
          <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10 shadow-lg space-y-8">
            {errorMsg && (
              <div className="bg-red-50 border border-red-300 p-4 text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Notification summary */}
            <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] space-y-2">
              <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                Availability Alert Received
              </span>
              <p className="text-xs text-[#110D09]/80 leading-relaxed font-light">
                Hello {order.customer.fullName}, your reserved flacon is bottled and ready for
                dispatch. Complete the remaining balance below to authorize immediate courier
                dispatch.
              </p>
            </div>

            {/* Breakdown */}
            <div className="bg-[#FAF8F5] border border-[#E8E2D8] p-5 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-[#110D09]/60">
                <span>Initial 70% Deposit Paid:</span>
                <span>₹{order.amountPaidToday}</span>
              </div>
              <div className="flex justify-between text-[#110D09]/60">
                <span>Total Reservation Plan Value:</span>
                <span>₹{order.totalOrderValue}</span>
              </div>
              <div className="flex justify-between text-base font-serif text-amber-800 pt-2 border-t border-[#E8E2D8] font-bold">
                <span>Outstanding Balance Payable Now:</span>
                <span>₹{order.remainingBalance}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <form onSubmit={handlePayRemainingBalance} className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                  Select Payment Method
                </span>

                {/* UPI */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`cursor-pointer p-4 border transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#110D09] bg-[#FAF8F5] shadow-sm'
                      : 'border-[#E8E2D8] bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-4 h-4 text-[#8C6D42]" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#110D09]">
                      Instant UPI (Google Pay / PhonePe / Paytm / BHIM)
                    </span>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-[#E8E2D8] space-y-2">
                      <input
                        type="text"
                        placeholder="Enter your UPI ID (e.g. yourname@okhdfcbank)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-white border border-[#D5CDC2] px-3 py-2 text-xs text-[#110D09] focus:outline-none focus:border-[#110D09]"
                      />
                    </div>
                  )}
                </div>

                {/* Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`cursor-pointer p-4 border transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#110D09] bg-[#FAF8F5] shadow-sm'
                      : 'border-[#E8E2D8] bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-4 h-4 text-[#8C6D42]" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#110D09]">
                      Credit / Debit Card
                    </span>
                  </div>
                </div>

                {/* NetBanking */}
                <div
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`cursor-pointer p-4 border transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#110D09] bg-[#FAF8F5] shadow-sm'
                      : 'border-[#E8E2D8] bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Building className="w-4 h-4 text-[#8C6D42]" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#110D09]">
                      NetBanking
                    </span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <div>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full btn-luxury-primary py-4 text-xs font-semibold tracking-luxury uppercase flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
                >
                  {processing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Final Balance Payment...</span>
                    </div>
                  ) : (
                    <>
                      <span>Pay Remaining Balance • ₹{order.remainingBalance}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-[#110D09]/50 font-light">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D42]" />
                <span>Certified Indian Banking Gateway Verification</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
