'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Package,
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  LogOut,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function AccountPage() {
  const {
    user,
    orders,
    isLoadingOrders,
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithEmail,
    logout,
    updateProfile,
    refreshOrders,
    openAuthModal,
  } = useAuth();

  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'lookup'>('orders');

  // Order lookup state
  const [lookupId, setLookupId] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupOrder, setLookupOrder] = useState<any>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
  });

  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Email login state for non-logged-in view
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;

    setLookupLoading(true);
    setLookupError(null);
    setLookupOrder(null);

    try {
      const cleanId = lookupId.trim().toUpperCase();
      const res = await fetch(`/api/orders/${cleanId}`);
      if (!res.ok) {
        throw new Error('Order not found. Please verify your VAL- order reference.');
      }
      const data = await res.json();
      setLookupOrder(data);
    } catch (err: any) {
      setLookupError(err.message || 'Unable to locate order.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsEditingProfile(false);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const handleInlineEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setLoginLoading(true);
    try {
      await loginWithEmail(emailInput, nameInput || emailInput.split('@')[0]);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleReorder = (productId: string) => {
    // Reorder Cacao Citrine
    addToCart({
      productId: 'cacao-citrine',
      name: 'Cacao Citrine',
      slug: 'cacao-citrine',
      image: '/products/cacao-citrine-1.jpg',
      category: 'Unisex',
      volume: '50 ML',
      paymentPlan: 'full',
      quantity: 1,
    });
  };

  // IF USER IS NOT LOGGED IN — Show Elegant Login Portal
  if (!user) {
    return (
      <div className="bg-[#FAF7F2] text-[#110D09] min-h-screen pb-24">
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F5EFE6] border-b border-[#E8DFD3] text-center">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold block">
              Atelier Client Portal
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-wide uppercase text-[#110D09]">
              Account & Order History
            </h1>
            <p className="text-xs sm:text-sm text-[#110D09]/75 font-light max-w-lg mx-auto leading-relaxed">
              Sign in with your Google, Microsoft, or Email account to access your running profile, track past orders, and manage shipping addresses.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Sign In / Create Account Box */}
            <div className="md:col-span-7 bg-white border border-[#E8DFD3] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8C6D42] tracking-wider font-semibold block">
                  Quick Authentication
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase text-[#110D09]">
                  Sign In with One Click
                </h2>
                <p className="text-xs text-[#110D09]/65 font-light">
                  Your running account and previous order history will be immediately loaded.
                </p>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  className="w-full flex items-center justify-center space-x-3 py-3.5 px-4 bg-[#FAF7F2] border border-[#D5CDC2] hover:border-[#110D09] hover:bg-white text-[#110D09] text-xs font-serif font-bold tracking-wider transition-all duration-200"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => loginWithMicrosoft()}
                  className="w-full flex items-center justify-center space-x-3 py-3.5 px-4 bg-[#FAF7F2] border border-[#D5CDC2] hover:border-[#110D09] hover:bg-white text-[#110D09] text-xs font-serif font-bold tracking-wider transition-all duration-200"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span>Continue with Microsoft</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center pt-2">
                <div className="w-full border-t border-[#E8DFD3]" />
                <span className="absolute px-3 bg-white text-[10px] font-mono uppercase text-[#8C6D42] tracking-widest">
                  Or Email Sign In
                </span>
              </div>

              {/* Email Form */}
              <form onSubmit={handleInlineEmailLogin} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#110D09]/75 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3.5 py-2.5 text-xs text-[#110D09] focus:outline-none focus:border-[#110D09]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#110D09]/75 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3.5 py-2.5 text-xs text-[#110D09] focus:outline-none focus:border-[#110D09]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full btn-luxury-primary py-3 text-xs font-serif font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-sm"
                >
                  <span>{loginLoading ? 'Opening Account...' : 'Open Running Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Test Accounts Shortcut */}
              <div className="pt-4 border-t border-[#E8DFD3] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D42] font-semibold block text-center">
                  ⚡ Test Running Accounts With Previous Orders
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => loginWithGoogle('aarav.sharma@example.com', 'Aarav Sharma')}
                    className="p-3 bg-[#FAF8F5] border border-[#E8DFD3] hover:border-[#110D09] text-left transition-colors"
                  >
                    <span className="font-bold block text-[#110D09]">Aarav Sharma</span>
                    <span className="text-[10px] text-[#8C6D42] font-mono">2 Orders Saved</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => loginWithMicrosoft('priya.sen@example.com', 'Priya Sen')}
                    className="p-3 bg-[#FAF8F5] border border-[#E8DFD3] hover:border-[#110D09] text-left transition-colors"
                  >
                    <span className="font-bold block text-[#110D09]">Priya Sen</span>
                    <span className="text-[10px] text-[#8C6D42] font-mono">1 Order Saved</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Guest Order Lookup */}
            <div className="md:col-span-5 bg-[#FAF6EE] border border-[#E8DFD3] p-6 sm:p-7 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold block">
                  Quick Tracking
                </span>
                <h3 className="text-lg font-serif font-bold uppercase text-[#110D09]">
                  Lookup Guest Order
                </h3>
                <p className="text-xs text-[#110D09]/70 font-light">
                  If you ordered without an account, enter your reference (e.g., VAL-DEMO-1001) to view status.
                </p>
              </div>

              <form onSubmit={handleLookup} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="VAL-XXXXXX"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  className="w-full bg-white border border-[#D5CDC2] p-3 text-xs uppercase font-mono tracking-wider text-[#110D09] focus:outline-none focus:border-[#110D09]"
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full py-2.5 bg-[#110D09] text-white text-xs font-serif font-bold uppercase tracking-[0.18em] hover:bg-[#2A1F16] transition-colors"
                >
                  {lookupLoading ? 'Searching...' : 'Track Order'}
                </button>
              </form>

              {lookupError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
                  {lookupError}
                </div>
              )}

              {lookupOrder && (
                <div className="p-4 bg-white border border-[#110D09] space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono font-bold">
                    <span>{lookupOrder.id}</span>
                    <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      {lookupOrder.orderStatus}
                    </span>
                  </div>
                  <p className="text-[#110D09]/70">
                    Ordered by: <span className="font-semibold text-[#110D09]">{lookupOrder.customer.fullName}</span>
                  </p>
                  <p className="text-[#110D09]/70">
                    Total: <span className="font-semibold text-[#110D09]">₹{lookupOrder.totalOrderValue}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // IF USER IS LOGGED IN — Rich Running Account Portal
  return (
    <div className="bg-[#FAF7F2] text-[#110D09] min-h-screen pb-24">
      {/* Account Header Banner */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#F5EFE6] border-b border-[#E8DFD3]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#110D09] text-[#FAF7F2] font-serif font-bold text-xl flex items-center justify-center border-2 border-[#8C6D42]">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'V'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C6D42] font-bold">
                  Running Account • {user.provider.toUpperCase()} Verified
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
                {user.fullName}
              </h1>
              <p className="text-xs text-[#110D09]/70 font-mono">
                {user.email} · Member Since {user.memberSince}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={refreshOrders}
              className="px-3.5 py-2 bg-white border border-[#D5CDC2] hover:border-[#110D09] text-xs font-mono text-[#110D09] flex items-center space-x-1.5 transition-colors"
              title="Refresh order history"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
              <span>Sync Orders</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="px-3.5 py-2 bg-[#110D09] text-white hover:bg-[#2A1F16] text-xs font-serif font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Account Navigation Tabs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="border-b border-[#E8DFD3] flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-4 text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.2em] transition-colors relative ${
              activeTab === 'orders'
                ? 'text-[#110D09]'
                : 'text-[#110D09]/40 hover:text-[#110D09]'
            }`}
          >
            <span>My Orders ({orders.length})</span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#110D09]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-4 text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.2em] transition-colors relative ${
              activeTab === 'profile'
                ? 'text-[#110D09]'
                : 'text-[#110D09]/40 hover:text-[#110D09]'
            }`}
          >
            <span>Saved Details & Address</span>
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#110D09]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lookup')}
            className={`pb-4 text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.2em] transition-colors relative ${
              activeTab === 'lookup'
                ? 'text-[#110D09]'
                : 'text-[#110D09]/40 hover:text-[#110D09]'
            }`}
          >
            <span>Track Guest Order</span>
            {activeTab === 'lookup' && (
              <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#110D09]" />
            )}
          </button>
        </div>

        {/* TAB 1: OLD PRODUCT ORDERS & ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="py-8 space-y-6 animate-fade-in">
            {orders.length === 0 ? (
              <div className="bg-white border border-[#E8DFD3] p-12 text-center space-y-4 max-w-xl mx-auto">
                <Package className="w-10 h-10 text-[#8C6D42] mx-auto opacity-70" />
                <h3 className="text-xl font-serif font-bold uppercase text-[#110D09]">
                  No Orders on File Yet
                </h3>
                <p className="text-xs text-[#110D09]/70 leading-relaxed font-light">
                  Your running account is active and will automatically record every fragrance allocation and purchase you make.
                </p>
                <div className="pt-2">
                  <Link
                    href="/product/cacao-citrine"
                    className="btn-luxury-primary text-xs py-3 px-6 font-serif font-bold uppercase tracking-[0.2em] inline-block"
                  >
                    Explore Cacao Citrine →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-mono text-[#110D09]/65 pb-2">
                  <span>Displaying {orders.length} Previous Order{orders.length > 1 ? 's' : ''}</span>
                  <span className="text-[#8C6D42] font-semibold">Atelier Verified Purchases</span>
                </div>

                {orders.map((order) => {
                  const isDeposit = order.plan === 'deposit';
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-[#E8DFD3] shadow-sm hover:border-[#110D09] transition-all overflow-hidden"
                    >
                      {/* Order Card Header */}
                      <div className="bg-[#FAF6EE] p-4 sm:p-5 border-b border-[#E8DFD3] flex flex-wrap items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono uppercase text-[#8C6D42] font-bold">
                              Reference ID:
                            </span>
                            <span className="font-mono font-bold text-xs sm:text-sm text-[#110D09]">
                              {order.id}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#110D09]/60 font-mono block">
                            Placed on {orderDate}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 border ${
                              order.paymentStatus === 'Fully Paid'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-900 border-amber-200'
                            }`}
                          >
                            {order.orderStatus || order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items in this order */}
                      <div className="p-5 sm:p-6 divide-y divide-[#E8DFD3]/70">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#F4ECE1] border border-[#E8DFD3] flex-shrink-0 overflow-hidden">
                                <Image
                                  src={
                                    item.productId === 'cacao-citrine'
                                      ? '/products/cacao-citrine-1.jpg'
                                      : item.productId === 'silken-sambac'
                                      ? '/products/silken-sambac-1.jpg'
                                      : '/products/roasted-zest-1.jpg'
                                  }
                                  alt={item.productName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-[#8C6D42] uppercase tracking-wider block font-semibold">
                                  {item.category || 'Eau de Parfum • 50 ML'}
                                </span>
                                <h4 className="text-base sm:text-lg font-serif font-bold uppercase text-[#110D09]">
                                  {item.productName}
                                </h4>
                                <span className="text-xs text-[#110D09]/70 font-mono block">
                                  Qty: {item.quantity} · Plan: {item.paymentPlan === 'deposit' ? 'Reservation Deposit' : 'Full Payment'}
                                </span>
                              </div>
                            </div>

                            <div className="text-left sm:text-right space-y-2">
                              <div className="text-sm font-serif font-bold text-[#110D09]">
                                Total: ₹{item.totalItemValue || (item.quantity * 450)}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleReorder(item.productId)}
                                className="inline-flex items-center space-x-1.5 text-[11px] font-mono uppercase tracking-wider text-[#8C6D42] hover:text-[#110D09] font-bold border-b border-[#8C6D42] pb-0.5 transition-colors"
                              >
                                <ShoppingBag className="w-3 h-3" />
                                <span>Reorder Fragrance</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer & Shipping Summary */}
                      <div className="bg-[#FAF8F5] p-4 sm:p-5 border-t border-[#E8DFD3] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-[#110D09]/75">
                        <div>
                          <span className="text-[10px] text-[#8C6D42] uppercase font-bold block mb-0.5">
                            Delivered To:
                          </span>
                          <p className="font-semibold text-[#110D09]">{order.customer.fullName}</p>
                          <p className="text-[11px] text-[#110D09]/70">{order.customer.address}, {order.customer.city}</p>
                          <p className="text-[11px] text-[#110D09]/70">{order.customer.state} - {order.customer.pincode}</p>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#8C6D42] uppercase font-bold block mb-0.5">
                            Payment Method:
                          </span>
                          <p className="font-semibold text-[#110D09]">{order.paymentMethod || 'Razorpay Verified'}</p>
                          <p className="text-[11px] text-[#110D09]/70">Amount Paid: ₹{order.amountPaidToday}</p>
                          {order.remainingBalance > 0 && (
                            <p className="text-[11px] text-amber-800 font-bold">Balance Due: ₹{order.remainingBalance}</p>
                          )}
                        </div>

                        <div className="flex sm:justify-end items-center">
                          <Link
                            href={`/product/cacao-citrine`}
                            className="btn-luxury-outline py-2 px-4 text-[11px] uppercase tracking-wider font-bold"
                          >
                            View Product Page →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESS & PROFILE */}
        {activeTab === 'profile' && (
          <div className="py-8 max-w-2xl mx-auto animate-fade-in space-y-6">
            <div className="bg-white border border-[#E8DFD3] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8C6D42] font-bold block">
                    Account Details
                  </span>
                  <h3 className="text-xl font-serif font-bold uppercase text-[#110D09]">
                    Personal Info & Saved Shipping
                  </h3>
                </div>
                {!isEditingProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileForm({
                        fullName: user.fullName || '',
                        phone: user.phone || '',
                        address: user.address || '',
                        city: user.city || '',
                        state: user.state || '',
                        pincode: user.pincode || '',
                      });
                      setIsEditingProfile(true);
                    }}
                    className="text-xs font-mono uppercase text-[#8C6D42] hover:text-[#110D09] font-bold border-b border-[#8C6D42] pb-0.5"
                  >
                    Edit Details
                  </button>
                )}
              </div>

              {profileSavedMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile and shipping details successfully saved!</span>
                </div>
              )}

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#110D09]/75 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2.5 text-xs text-[#110D09]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#110D09]/75 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2.5 text-xs text-[#110D09]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#110D09]/75 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2.5 text-xs text-[#110D09]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#110D09]/75 mb-1">City</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2.5 text-xs text-[#110D09]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#110D09]/75 mb-1">State</label>
                      <input
                        type="text"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2.5 text-xs text-[#110D09]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-[#110D09]/75 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={profileForm.pincode}
                        onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-2.5 text-xs text-[#110D09]"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="btn-luxury-primary py-2.5 px-5 text-xs font-serif font-bold uppercase tracking-wider"
                    >
                      Save Details
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2.5 border border-[#D5CDC2] text-xs font-mono uppercase"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#E8DFD3]">
                    <div>
                      <span className="text-[10px] text-[#8C6D42] uppercase block">Account Holder</span>
                      <span className="font-bold text-[#110D09] text-sm">{user.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8C6D42] uppercase block">Email</span>
                      <span className="font-bold text-[#110D09]">{user.email}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C6D42] uppercase block">Saved Shipping Address</span>
                    <p className="font-bold text-[#110D09] text-sm mt-0.5">
                      {user.address || 'No address saved yet. Edit to save your default address.'}
                    </p>
                    {user.city && (
                      <p className="text-[#110D09]/70 mt-0.5">
                        {user.city}, {user.state} - {user.pincode}
                      </p>
                    )}
                    {user.phone && (
                      <p className="text-[#110D09]/70 mt-0.5">Phone: {user.phone}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TRACK GUEST ORDER */}
        {activeTab === 'lookup' && (
          <div className="py-8 max-w-xl mx-auto animate-fade-in">
            <div className="bg-white border border-[#E8DFD3] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8C6D42] font-bold block">
                  Reference Search
                </span>
                <h3 className="text-xl font-serif font-bold uppercase text-[#110D09]">
                  Lookup Order by Reference ID
                </h3>
                <p className="text-xs text-[#110D09]/70 font-light">
                  Enter any VALCURA order reference (e.g. VAL-DEMO-1001 or VAL-ORD-XXXXXX).
                </p>
              </div>

              <form onSubmit={handleLookup} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="VAL-XXXXXX"
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-3 text-xs uppercase font-mono tracking-wider text-[#110D09] focus:outline-none focus:border-[#110D09]"
                />
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full btn-luxury-primary py-3 text-xs font-serif font-bold uppercase tracking-[0.2em]"
                >
                  {lookupLoading ? 'Searching...' : 'Find Order Details'}
                </button>
              </form>

              {lookupError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
                  {lookupError}
                </div>
              )}

              {lookupOrder && (
                <div className="p-5 bg-[#FAF6EE] border border-[#110D09] space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#110D09]">{lookupOrder.id}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800">
                      {lookupOrder.orderStatus}
                    </span>
                  </div>
                  <div className="space-y-1 border-t border-[#E8DFD3] pt-2">
                    <p>Recipient: <span className="font-bold text-[#110D09]">{lookupOrder.customer.fullName}</span></p>
                    <p>Total Value: <span className="font-bold text-[#110D09]">₹{lookupOrder.totalOrderValue}</span></p>
                    <p>Date: {new Date(lookupOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
