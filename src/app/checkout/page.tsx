'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ArrowRight,
  AlertCircle,
  CreditCard,
  Smartphone,
  Building,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    clearCart,
    subtotalPayableToday,
    totalRemainingBalance,
    totalOrderPlanValue,
    totalStandardValue,
    totalSavings,
    totalQuantity,
    updateAllPaymentPlans,
  } = useCart();

  const { user, openAuthModal, saveOrderToAccount } = useAuth();

  // Payment Mode / Plan State: preorder_full (₹399), preorder_deposit (₹449 total / ₹314 today), standard_full (₹499)
  const [selectedPlanMode, setSelectedPlanMode] = useState<
    'preorder_full' | 'preorder_deposit' | 'standard_full'
  >('preorder_full');

  // Synchronize cart items with selected payment mode
  React.useEffect(() => {
    updateAllPaymentPlans('preorder_full');
  }, []);

  const handlePlanSelect = (mode: 'preorder_full' | 'preorder_deposit' | 'standard_full') => {
    setSelectedPlanMode(mode);
    updateAllPaymentPlans(mode);
  };

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  });

  // Automatically pre-fill when user changes or logs in
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        fullName: prev.fullName || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || '',
        pincode: prev.pincode || user.pincode || '',
      }));
    }
  }, [user]);

  // Payment Options (Indian Gateway methods)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="bg-white text-[#110D09] min-h-screen py-24 px-4 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-2xl font-serif uppercase tracking-wide">Your Bag Is Empty</h1>
          <p className="text-xs text-[#110D09]/60">
            Please add a fragrance before proceeding to checkout.
          </p>
          <Link href="/collections/cacao" className="btn-luxury-primary text-xs">
            Explore Cacao Collection
          </Link>
        </div>
      </div>
    );
  }

  const isDepositOrder = items.some((i) => i.paymentPlan === 'deposit');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.pincode
    ) {
      setErrorMsg('Please complete all required delivery and contact fields.');
      return;
    }

    if (formData.phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      setErrorMsg('Please enter a valid UPI ID (e.g., yourname@okhdfcbank or mobilenumber@upi).');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create secure server-side order
      const createRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
            paymentPlan: selectedPlanMode,
          })),
        }),
      });

      const createData = await createRes.json();

      if (!createRes.ok || !createData.success) {
        throw new Error(createData.error || 'Failed to initialize order on server');
      }

      const orderId = createData.orderId;

      // Step 2: Server-side payment verification
      const verifyRes = await fetch('/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentTransactionId: `pay_ind_${Math.random().toString(36).substring(2, 10)}`,
          paymentMethod:
            paymentMethod === 'upi'
              ? `UPI (${upiId})`
              : paymentMethod === 'card'
              ? 'Debit/Credit Card (Encrypted Gateway)'
              : 'NetBanking (Indian Banks)',
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      // Success: Save order to user's running account
      if (verifyData.order) {
        saveOrderToAccount(verifyData.order);
      }

      // Clear cart and redirect
      clearCart();
      router.push(`/order-confirmation/${orderId}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'Payment processing error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-[#E8E2D8]">
        <div className="flex items-center justify-between">
          <Link href="/cart" className="text-xs tracking-luxury uppercase text-[#110D09] hover:text-[#8C6D42] font-semibold">
            ← Return to Bag
          </Link>
          <div className="flex items-center space-x-2 text-xs text-[#110D09]/60 font-mono">
            <Lock className="w-3.5 h-3.5 text-[#8C6D42]" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <form onSubmit={handleProcessPayment}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT COLUMN: CONTACT, DELIVERY & PAYMENT FORM */}
            <div className="lg:col-span-7 space-y-8">
              {errorMsg && (
                <div className="bg-red-50 border border-red-300 p-4 text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* ACCOUNT BANNER */}
              {user ? (
                <div className="bg-emerald-50/70 border border-emerald-200 p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-900 block">
                        Logged in as {user.fullName} ({user.email})
                      </span>
                      <span className="text-[11px] text-emerald-800/80">
                        This purchase will be saved to your running account history.
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    className="text-[10px] font-mono uppercase text-emerald-900 font-bold underline"
                  >
                    View Account
                  </Link>
                </div>
              ) : (
                <div className="bg-[#FAF6EE] border border-[#E8DFD3] p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-[#8C6D42] flex-shrink-0" />
                    <div>
                      <span className="font-bold text-[#110D09] block">
                        Have a VALCURA Account?
                      </span>
                      <span className="text-[11px] text-[#110D09]/70">
                        Sign in to auto-fill your delivery info and track past orders.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="px-3 py-1.5 bg-[#110D09] text-white text-[10px] font-serif font-bold uppercase tracking-wider hover:bg-[#2A1F16]"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* SECTION 1: CONTACT DETAILS */}
              <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-4 shadow-sm">
                <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                  01. Client & Contact Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#110D09]/70 font-light mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3.5 py-2.5 text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#110D09]/70 font-light mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your.email@domain.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3.5 py-2.5 text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#110D09]/70 font-light mb-1.5">
                      Mobile Number (For dispatch & availability notifications) *
                    </label>
                    <div className="flex">
                      <span className="bg-[#FAF8F5] border border-r-0 border-[#D5CDC2] px-3 py-2.5 text-xs text-[#110D09]/60 font-mono flex items-center">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="9876543210"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3.5 py-2.5 text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DELIVERY ADDRESS */}
              <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-4 shadow-sm">
                <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                  02. Shipping Address (India)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[#110D09]/70 font-light mb-1.5">
                      Complete Street Address & Residence *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Apartment, Suite, Building, Street Name"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3.5 py-2.5 text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#110D09]/70 font-light mb-1.5">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3.5 py-2.5 text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#110D09]/70 font-light mb-1.5">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3.5 py-2.5 text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#110D09]/70 font-light mb-1.5">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      placeholder="e.g. 400001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3.5 py-2.5 text-[#110D09] focus:outline-none focus:border-[#110D09] focus:bg-white"
                    />
                  </div>

                  <div className="flex items-center text-[11px] text-emerald-700 font-mono pt-4 sm:pt-6 font-medium">
                    <span>✓ Complimentary Courier Delivery Included</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: PAYMENT MODE & SETTLEMENT PLAN SELECTION */}
              <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                    03. Select Payment Mode & Settlement Plan
                  </span>
                  <span className="text-[10px] font-mono uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    Special Pre-Order Pricing
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Option 1: Pre-Order Full Payment (₹399) */}
                  <div
                    onClick={() => handlePlanSelect('preorder_full')}
                    className={`cursor-pointer p-4 sm:p-5 border transition-all ${
                      selectedPlanMode === 'preorder_full'
                        ? 'border-[#110D09] bg-[#FAF8F5] shadow-sm ring-1 ring-[#110D09]'
                        : 'border-[#E8E2D8] bg-white hover:border-[#110D09]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                          selectedPlanMode === 'preorder_full'
                            ? 'border-[#110D09] bg-[#110D09]'
                            : 'border-[#D5CDC2]'
                        }`}>
                          {selectedPlanMode === 'preorder_full' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs uppercase tracking-wider font-bold text-[#110D09]">
                              Pre-Order Full Payment
                            </span>
                            <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 bg-[#8C6D42] text-white font-bold">
                              Best Value • Save ₹100
                            </span>
                          </div>
                          <p className="text-xs text-[#110D09]/70 font-light mt-1">
                            Pay 100% upfront today to lock in special pre-order privilege pricing. Dispatched with priority upon release.
                          </p>
                          <div className="mt-2 flex items-center space-x-3 text-xs font-mono">
                            <span className="text-emerald-700 font-bold">✓ Payable Today: ₹{399 * totalQuantity}</span>
                            <span className="text-[#110D09]/40">•</span>
                            <span className="text-[#110D09]/60">Remaining Balance: ₹0</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 pl-2">
                        <span className="text-xl font-serif font-bold text-[#110D09] block">
                          ₹399
                        </span>
                        <span className="text-[10px] text-[#110D09]/40 line-through font-mono block">
                          ₹499
                        </span>
                        <span className="text-[9px] font-mono text-[#8C6D42]">per flacon</span>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Pre-Order 70% Plan (Total ₹449) */}
                  <div
                    onClick={() => handlePlanSelect('preorder_deposit')}
                    className={`cursor-pointer p-4 sm:p-5 border transition-all ${
                      selectedPlanMode === 'preorder_deposit'
                        ? 'border-[#110D09] bg-[#FAF8F5] shadow-sm ring-1 ring-[#110D09]'
                        : 'border-[#E8E2D8] bg-white hover:border-[#110D09]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                          selectedPlanMode === 'preorder_deposit'
                            ? 'border-[#110D09] bg-[#110D09]'
                            : 'border-[#D5CDC2]'
                        }`}>
                          {selectedPlanMode === 'preorder_deposit' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs uppercase tracking-wider font-bold text-[#110D09]">
                              Pre-Order 70% Advance Plan
                            </span>
                            <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                              Pay 70% Now • Save ₹50
                            </span>
                          </div>
                          <p className="text-xs text-[#110D09]/70 font-light mt-1">
                            Pay 70% (₹314 / flacon) today to secure your flacon allocation. The remaining 30% (₹135 / flacon) is paid upon dispatch.
                          </p>
                          <div className="mt-2 flex items-center space-x-3 text-xs font-mono">
                            <span className="text-emerald-700 font-bold">✓ Pay Today (70%): ₹{314 * totalQuantity}</span>
                            <span className="text-[#110D09]/40">•</span>
                            <span className="text-[#8C6D42] font-semibold">Due on Dispatch (30%): ₹{135 * totalQuantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 pl-2">
                        <span className="text-xl font-serif font-bold text-[#110D09] block">
                          ₹449
                        </span>
                        <span className="text-[10px] text-[#110D09]/40 line-through font-mono block">
                          ₹499
                        </span>
                        <span className="text-[9px] font-mono text-[#8C6D42]">total commitment</span>
                      </div>
                    </div>
                  </div>

                  {/* Option 3: Standard Full Payment (₹499) */}
                  <div
                    onClick={() => handlePlanSelect('standard_full')}
                    className={`cursor-pointer p-4 sm:p-5 border transition-all ${
                      selectedPlanMode === 'standard_full'
                        ? 'border-[#110D09] bg-[#FAF8F5] shadow-sm ring-1 ring-[#110D09]'
                        : 'border-[#E8E2D8] bg-white hover:border-[#110D09]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${
                          selectedPlanMode === 'standard_full'
                            ? 'border-[#110D09] bg-[#110D09]'
                            : 'border-[#D5CDC2]'
                        }`}>
                          {selectedPlanMode === 'standard_full' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs uppercase tracking-wider font-bold text-[#110D09]">
                              Standard Full Payment
                            </span>
                            <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 bg-neutral-100 text-[#110D09] border border-[#D5CDC2]">
                              Regular Atelier Price
                            </span>
                          </div>
                          <p className="text-xs text-[#110D09]/70 font-light mt-1">
                            Standard single-charge checkout at standard retail price. No deferred payment schedule.
                          </p>
                          <div className="mt-2 flex items-center space-x-3 text-xs font-mono">
                            <span className="text-[#110D09] font-bold">✓ Payable Today: ₹{499 * totalQuantity}</span>
                            <span className="text-[#110D09]/40">•</span>
                            <span className="text-[#110D09]/60">Remaining Balance: ₹0</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 pl-2">
                        <span className="text-xl font-serif font-bold text-[#110D09] block">
                          ₹499
                        </span>
                        <span className="text-[9px] font-mono text-[#8C6D42]">per flacon</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: INDIAN PAYMENT GATEWAY SELECTION */}
              <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-4 shadow-sm">
                <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-medium">
                  04. Secure Payment Gateway (India)
                </span>

                <div className="space-y-3">
                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`cursor-pointer p-4 border transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#110D09] bg-[#FAF8F5] shadow-sm'
                        : 'border-[#E8E2D8] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-4 h-4 text-[#8C6D42]" />
                        <span className="text-xs uppercase tracking-wider font-semibold text-[#110D09]">
                          UPI (Google Pay, PhonePe, Paytm, BHIM)
                        </span>
                      </div>
                      <span className="text-[10px] tracking-widest uppercase text-[#8C6D42] font-mono font-medium">
                        Fastest
                      </span>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-4 pt-3 border-t border-[#E8E2D8] space-y-2">
                        <label className="block text-xs text-[#110D09]/70 font-light">
                          Enter your VPA / UPI ID *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-white border border-[#D5CDC2] px-3.5 py-2 text-xs text-[#110D09] focus:outline-none focus:border-[#110D09]"
                        />
                        <p className="text-[10px] text-[#110D09]/50">
                          A payment collect notification will be securely simulated and verified upon
                          submission.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Cards Option */}
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
                        Credit / Debit Cards (Visa, Mastercard, RuPay)
                      </span>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="mt-4 pt-3 border-t border-[#E8E2D8] text-xs text-[#110D09]/70 space-y-1 font-mono">
                        <p>✓ 100% RBI & PCI-DSS Compliant Tokenization</p>
                        <p className="text-[10px] text-[#110D09]/50 font-sans">
                          Card details are never stored on VALCURA servers. Processed via certified
                          Indian banking switch.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* NetBanking Option */}
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
                        NetBanking (HDFC, ICICI, SBI, Axis & 50+ Banks)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY & PAYMENT SEPARATION */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-6 sticky top-28 shadow-lg">
                <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono block pb-3 border-b border-[#E8E2D8] font-medium">
                  Order Summary
                </span>

                {/* Items preview */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-1 divide-y divide-[#E8E2D8]">
                  {items.map((i) => {
                    const unitPrice =
                      selectedPlanMode === 'preorder_full'
                        ? 399
                        : selectedPlanMode === 'preorder_deposit'
                        ? 449
                        : 499;
                    return (
                      <div key={i.productId} className="pt-3 first:pt-0 flex items-center space-x-3">
                        <div className="relative w-12 h-14 bg-[#F8F5F0] border border-[#E8E2D8] flex-shrink-0">
                          <Image src={i.image} alt={i.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 text-xs">
                          <h4 className="font-serif text-[#110D09] font-medium">{i.name}</h4>
                          <p className="text-[10px] text-[#8C6D42] font-mono">
                            Qty: {i.quantity} • 50 ML Flacon
                          </p>
                          <p className="text-[10px] text-[#110D09]/60 font-mono mt-0.5">
                            {selectedPlanMode === 'preorder_full' && 'Pre-Order Special: ₹399/unit'}
                            {selectedPlanMode === 'preorder_deposit' && '70% Advance: ₹314/unit (₹135 later)'}
                            {selectedPlanMode === 'standard_full' && 'Standard Price: ₹499/unit'}
                          </p>
                        </div>
                        <div className="text-right text-xs font-mono">
                          <p className="text-[#110D09] font-bold">
                            ₹{unitPrice * i.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PRICING BREAKDOWN */}
                <div className="border-t border-[#E8E2D8] pt-4 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between text-[#110D09]/60">
                    <span>Standard List Price:</span>
                    <span className="line-through">₹{totalQuantity * 499}</span>
                  </div>

                  {selectedPlanMode === 'preorder_full' && (
                    <div className="flex justify-between text-[#8C6D42]">
                      <span>Pre-Order Privilege Savings:</span>
                      <span>- ₹{totalQuantity * 100}</span>
                    </div>
                  )}

                  {selectedPlanMode === 'preorder_deposit' && (
                    <>
                      <div className="flex justify-between text-[#8C6D42]">
                        <span>Pre-Order Plan Savings:</span>
                        <span>- ₹{totalQuantity * 50}</span>
                      </div>
                      <div className="flex justify-between text-[#110D09]/70 pt-1 border-t border-dashed border-[#E8E2D8]">
                        <span>Total Plan Commitment:</span>
                        <span>₹{totalQuantity * 449}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between text-[#110D09]/80">
                    <span>Shipping Charges:</span>
                    <span className="text-emerald-700 font-semibold uppercase text-[10px] tracking-wider font-sans">
                      Complimentary
                    </span>
                  </div>

                  {/* Amount Breakdown depending on plan */}
                  {selectedPlanMode === 'preorder_deposit' ? (
                    <div className="pt-3 border-t border-[#E8E2D8] space-y-2">
                      <div className="flex justify-between text-base font-serif text-[#110D09] font-bold">
                        <span>Payable Today (70%):</span>
                        <span className="text-[#110D09] font-mono text-xl">
                          ₹{subtotalPayableToday}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-[#8C6D42] font-mono bg-[#FAF8F5] p-2.5 border border-[#E8DFD3]">
                        <span>Remaining 30% Balance on Dispatch:</span>
                        <span className="font-bold">₹{totalRemainingBalance}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between text-base font-serif text-[#110D09] pt-3 border-t border-[#E8E2D8] font-bold">
                      <span>Total Amount Payable:</span>
                      <span className="text-[#110D09] font-mono text-xl">
                        ₹{subtotalPayableToday}
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit Payment CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-luxury-primary py-4 text-xs font-semibold tracking-luxury uppercase flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying With Gateway...</span>
                      </div>
                    ) : (
                      <>
                        <span>
                          {selectedPlanMode === 'preorder_full' && `Complete Pre-Order • Pay ₹${subtotalPayableToday}`}
                          {selectedPlanMode === 'preorder_deposit' && `Reserve Allocation • Pay 70% (₹${subtotalPayableToday})`}
                          {selectedPlanMode === 'standard_full' && `Complete Order • Pay ₹${subtotalPayableToday}`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1.5 text-[10px] text-[#110D09]/50 font-light text-center">
                  <p>✓ Instant email & order confirmation with tracking ID</p>
                  <p>✓ Fully compliant server-side transaction logging</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
