'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Loader2,
  MessageCircle,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  QrCode,
  Truck,
  HeartHandshake,
  CreditCard,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalQuantity,
  } = useCart();
  const { user, saveOrderToAccount } = useAuth();

  // Official Merchant Payment Profile (Raghav Sindhwani)
  const MERCHANT_NAME = 'Raghav Sindhwani';
  const MERCHANT_UPI_ID = 'raghavsindhwanial@okicici';
  const CONCIERGE_WHATSAPP_NUMBER = '916378582047';

  // Flat ₹399 pre-order rate per flacon
  const flaconCount = totalQuantity > 0 ? totalQuantity : 1;
  const totalPayableAmount = flaconCount * 399;
  const standardTotalValue = flaconCount * 599;
  const totalSavings = flaconCount * 200;

  // Active Checkout Tab: 'whatsapp' (default 1-click) | 'direct_upi' | 'card_gateway'
  const [checkoutMode, setCheckoutMode] = useState<'whatsapp' | 'direct_upi' | 'card_gateway'>('whatsapp');

  // Minimal Frictionless Contact Info (All 100% Optional)
  const [clientName, setClientName] = useState(user?.fullName || '');
  const [clientPhone, setClientPhone] = useState(user?.phone || '');
  const [clientCity, setClientCity] = useState(user?.city || '');

  // UI state
  const [loading, setLoading] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Sync logged in user if available
  useEffect(() => {
    if (user) {
      if (!clientName && user.fullName) setClientName(user.fullName);
      if (!clientPhone && user.phone) setClientPhone(user.phone);
      if (!clientCity && user.city) setClientCity(user.city);
    }
  }, [user, clientName, clientPhone, clientCity]);

  // Copy UPI ID to clipboard
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(MERCHANT_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  // Copy Phone Number to clipboard
  const handleCopyPhone = () => {
    navigator.clipboard.writeText('6378582047');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  // If bag was completely empty, allow 1-click auto-add Cacao Citrine
  const handleQuickAddCacaoCitrine = () => {
    addToCart({
      productId: 'cacao-citrine',
      name: 'Cacao Citrine',
      slug: 'cacao-citrine',
      image: '/images/perfume-front.webp',
      category: 'Extrait de Parfum',
      volume: '50 ML / 1.7 FL. OZ.',
      quantity: 1,
      paymentPlan: 'preorder_full',
    });
  };

  // Initialize or retrieve server order ID
  const initializeServerOrder = async (): Promise<string> => {
    if (activeOrderId) return activeOrderId;

    const currentItems =
      items.length > 0
        ? items
        : [
            {
              productId: 'cacao-citrine',
              name: 'Cacao Citrine',
              quantity: 1,
              paymentPlan: 'preorder_full',
            },
          ];

    const customerData = {
      fullName: clientName.trim() || 'WhatsApp Client',
      email: user?.email || 'concierge@valcura.in',
      phone: clientPhone.trim() || 'Direct WhatsApp Dispatch',
      address: clientCity.trim()
        ? `City/Note: ${clientCity.trim()} (Direct WhatsApp Dispatch)`
        : 'Address provided directly in WhatsApp chat',
      city: clientCity.trim() || 'India',
      state: 'Atelier Priority',
      pincode: 'Direct WhatsApp',
    };

    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: customerData,
        items: currentItems.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity || 1,
          paymentPlan: 'preorder_full',
        })),
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to initialize order on server.');
    }

    setActiveOrderId(data.orderId);
    return data.orderId;
  };

  // 1-Click WhatsApp Concierge Order Action
  const handleWhatsAppOrder = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Create order in database & Supabase
      const orderId = await initializeServerOrder();

      // 2. Prepare items list
      const orderList =
        items.length > 0
          ? items.map((i) => `• *${i.name}* (50 ML Extrait) × ${i.quantity} = ₹${399 * i.quantity}`).join('\n')
          : `• *Cacao Citrine* (50 ML Extrait) × 1 = ₹399`;

      const clientInfo = [
        clientName.trim() ? `• *Client:* ${clientName.trim()}` : null,
        clientPhone.trim() ? `• *Mobile:* +91 ${clientPhone.trim()}` : null,
        clientCity.trim() ? `• *Location/City:* ${clientCity.trim()}` : '• *Address:* Sending directly in this chat',
      ]
        .filter(Boolean)
        .join('\n');

      const whatsappMessage = `🏛️ *MAISON VALCURA — 1-CLICK ATELIER ORDER*
---------------------------------------
*Order ID:* ${orderId}
*Total Payable:* ₹${totalPayableAmount} (Flat Pre-Order Privilege Rate)

*Reserved Flacon(s):*
${orderList}

*Client Details:*
${clientInfo}
---------------------------------------
_Hello Raghav / VALCURA Concierge! I have locked my flacon allocation on the website. Please share the official ICICI UPI QR code so I can complete payment of ₹${totalPayableAmount} and confirm my delivery address!_`;

      const whatsappUrl = `https://wa.me/${CONCIERGE_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

      // 3. Clear cart
      clearCart();

      // 4. Open WhatsApp directly
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }

      // 5. Navigate to Order Confirmation Invoice page
      router.push(`/order-confirmation/${orderId}`);
    } catch (err: any) {
      console.error('WhatsApp order error:', err);
      setErrorMsg(err.message || 'Could not complete order. Please try again.');
      setLoading(false);
    }
  };

  // Direct UPI Payment Confirmation
  const handleDirectUpiConfirmation = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const orderId = await initializeServerOrder();

      const whatsappMessage = `🏛️ *MAISON VALCURA — UPI PAYMENT CONFIRMATION*
---------------------------------------
*Order ID:* ${orderId}
*Amount Paid:* ₹${totalPayableAmount}
*UPI Beneficiary:* ${MERCHANT_NAME} (${MERCHANT_UPI_ID})

*Client Name:* ${clientName.trim() || 'Valued Client'}
*Address:* ${clientCity.trim() || 'Sharing in chat below'}
---------------------------------------
_Hello Raghav! I have completed payment of ₹${totalPayableAmount} to your ICICI UPI ID (${MERCHANT_UPI_ID}). Here is my payment screenshot and delivery address._`;

      const whatsappUrl = `https://wa.me/${CONCIERGE_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

      clearCart();
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }
      router.push(`/order-confirmation/${orderId}`);
    } catch (err: any) {
      console.error('UPI Order error:', err);
      setErrorMsg(err.message || 'Could not confirm UPI order.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-[#110D09] min-h-screen pb-24">
      {/* Top Header Bar */}
      <header className="border-b border-[#E8E2D8] bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/shop"
            className="text-xs tracking-luxury uppercase text-[#110D09] hover:text-[#8C6D42] font-semibold transition-colors flex items-center gap-1.5"
          >
            ← Back to Atelier Shop
          </Link>

          <div className="flex items-center gap-2 text-xs text-[#8C6D42] font-mono font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">100% Authentic • Direct Atelier Concierge</span>
            <span className="sm:hidden">Atelier Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold block">
            Maison Valcura • Official Reservation
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#110D09] font-bold tracking-tight">
            Reserve Your Flacon
          </h1>
          <p className="text-xs sm:text-sm text-[#110D09]/70 font-light max-w-md mx-auto">
            Zero tedious paperwork. Reserve your limited handcrafted flacon in 1 tap via WhatsApp or direct UPI.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Interactive Checkout Card (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Quick 3-Step Interactive Timeline */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold block mb-3">
                Effortless 3-Step Atelier Process
              </span>
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <div className="w-6 h-6 rounded-full bg-[#8C6D42] text-white text-[11px] font-bold flex items-center justify-center mx-auto mb-1.5 font-mono">
                    1
                  </div>
                  <p className="text-xs font-bold text-[#110D09]">1-Tap Order</p>
                  <p className="text-[10px] text-[#110D09]/60 leading-tight mt-0.5">Locks your allocation</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center mx-auto mb-1.5 font-mono">
                    2
                  </div>
                  <p className="text-xs font-bold text-[#110D09]">Drop Address</p>
                  <p className="text-[10px] text-[#110D09]/60 leading-tight mt-0.5">Send in WhatsApp chat</p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center mx-auto mb-1.5 font-mono">
                    3
                  </div>
                  <p className="text-xs font-bold text-[#110D09]">Scan &amp; Ship</p>
                  <p className="text-[10px] text-[#110D09]/60 leading-tight mt-0.5">Raghav sends ICICI QR</p>
                </div>
              </div>
            </div>

            {/* Interactive Mode Switcher */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-1.5 shadow-sm flex gap-1">
              <button
                type="button"
                onClick={() => setCheckoutMode('whatsapp')}
                className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  checkoutMode === 'whatsapp'
                    ? 'bg-[#110D09] text-white shadow-md'
                    : 'text-[#110D09]/70 hover:text-[#110D09] hover:bg-neutral-100'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>1-Click WhatsApp</span>
                <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider hidden sm:inline">
                  Fastest
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCheckoutMode('direct_upi')}
                className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  checkoutMode === 'direct_upi'
                    ? 'bg-[#110D09] text-white shadow-md'
                    : 'text-[#110D09]/70 hover:text-[#110D09] hover:bg-neutral-100'
                }`}
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Pay via UPI QR</span>
              </button>
            </div>

            {/* MODE 1: 1-CLICK WHATSAPP ORDER (Default & Most Frictionless) */}
            {checkoutMode === 'whatsapp' && (
              <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
                
                {/* Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-serif font-bold text-emerald-950">
                      Direct WhatsApp Priority Concierge
                    </h3>
                    <p className="text-xs text-emerald-800 leading-relaxed font-light">
                      No tedious 9-field forms! Tap below to open WhatsApp directly with founder Raghav Sindhwani (+91 6378582047). Your flacon reservation is pre-filled, and you can simply send your delivery address or live pin directly in chat.
                    </p>
                  </div>
                </div>

                {/* Optional Quick Details (Zero Validation Stress) */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#110D09]/70 font-semibold">
                      Your Details (100% Optional)
                    </label>
                    <span className="text-[10px] text-[#8C6D42] font-mono">
                      Skip if you prefer chatting directly
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Raghav)"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs sm:text-sm text-[#110D09] placeholder:text-[#110D09]/40 focus:outline-none focus:border-[#8C6D42] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="WhatsApp No. (e.g. 9876543210)"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs sm:text-sm text-[#110D09] placeholder:text-[#110D09]/40 focus:outline-none focus:border-[#8C6D42] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Your City or PIN code (Optional - or send directly on WhatsApp)"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] text-xs sm:text-sm text-[#110D09] placeholder:text-[#110D09]/40 focus:outline-none focus:border-[#8C6D42] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Big Glowing WhatsApp Order Button */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    disabled={loading}
                    className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-serif font-bold text-base sm:text-lg tracking-wide shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Reserving Flacon with Atelier...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-6 h-6 shrink-0 text-white" />
                        <span>Order via WhatsApp • ₹{totalPayableAmount}</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-center text-[11px] text-[#110D09]/60 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C6D42]" />
                    <span>Instant 1-Click Allocation • Raghav will send official ICICI QR</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorMsg}
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: DIRECT UPI PAYMENT */}
            {checkoutMode === 'direct_upi' && (
              <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
                <div className="flex items-start gap-3 bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
                  <div className="w-9 h-9 rounded-full bg-[#8C6D42] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#110D09]">
                      Direct ICICI Bank UPI Transfer
                    </h3>
                    <p className="text-xs text-[#110D09]/70 leading-relaxed font-light">
                      Transfer directly using your UPI app to official merchant Raghav Sindhwani or reach out on WhatsApp.
                    </p>
                  </div>
                </div>

                {/* Official UPI & Contact Details Box */}
                <div className="bg-[#FAF8F5] border border-[#E8DFD3] rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D8]">
                    <div>
                      <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block">
                        Verified Beneficiary
                      </span>
                      <p className="font-serif font-bold text-base text-[#110D09]">{MERCHANT_NAME}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block">
                        Amount Payable
                      </span>
                      <p className="font-mono font-bold text-lg text-emerald-800">₹{totalPayableAmount}</p>
                    </div>
                  </div>

                  {/* UPI ID & Copy Button */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#110D09]/70 font-semibold">
                      Official Merchant UPI ID:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white border border-[#E8E2D8] rounded-xl px-4 py-2.5 font-mono text-xs sm:text-sm font-bold text-[#110D09] select-all">
                        {MERCHANT_UPI_ID}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-4 py-2.5 rounded-xl bg-[#110D09] hover:bg-[#8C6D42] text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy UPI</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Merchant Mobile / WhatsApp Number & Copy Button */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#110D09]/70 font-semibold">
                      Official Contact / WhatsApp Number:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white border border-[#E8E2D8] rounded-xl px-4 py-2.5 font-mono text-xs sm:text-sm font-bold text-[#110D09] select-all">
                        +91 6378582047
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        className="px-4 py-2.5 rounded-xl bg-[#110D09] hover:bg-[#8C6D42] text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        {copiedPhone ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Number</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Paid via WhatsApp */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleDirectUpiConfirmation}
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-2xl bg-[#110D09] hover:bg-[#8C6D42] text-white font-serif font-bold text-base tracking-wide transition-all flex items-center justify-center gap-3 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Generating Confirmation...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>I Have Paid • Send Screenshot on WhatsApp</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-[#110D09]/60 font-mono text-center">
                    Sends your payment reference directly to Raghav (+91 6378582047) for instant verification.
                  </p>
                </div>
              </div>
            )}

            {/* Atelier Assurance Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-white border border-[#E8E2D8] rounded-xl text-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#8C6D42] mx-auto" />
                <p className="text-[10px] font-bold text-[#110D09]">100% Authentic</p>
                <p className="text-[9px] text-[#110D09]/50 font-mono">Batch 01 Reserve</p>
              </div>

              <div className="p-3 bg-white border border-[#E8E2D8] rounded-xl text-center space-y-1">
                <Truck className="w-4 h-4 text-[#8C6D42] mx-auto" />
                <p className="text-[10px] font-bold text-[#110D09]">Complimentary Courier</p>
                <p className="text-[9px] text-[#110D09]/50 font-mono">Pan-India Priority</p>
              </div>

              <div className="p-3 bg-white border border-[#E8E2D8] rounded-xl text-center space-y-1">
                <HeartHandshake className="w-4 h-4 text-[#8C6D42] mx-auto" />
                <p className="text-[10px] font-bold text-[#110D09]">Founder Concierge</p>
                <p className="text-[9px] text-[#110D09]/50 font-mono">Raghav Sindhwani</p>
              </div>

              <div className="p-3 bg-white border border-[#E8E2D8] rounded-xl text-center space-y-1">
                <Sparkles className="w-4 h-4 text-[#8C6D42] mx-auto" />
                <p className="text-[10px] font-bold text-[#110D09]">Atelier Packaging</p>
                <p className="text-[9px] text-[#110D09]/50 font-mono">Handcrafted Cap</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Cart & Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-7 shadow-sm sticky top-24 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#8C6D42]" />
                  <h2 className="text-base font-serif font-bold text-[#110D09]">Your Atelier Flacon</h2>
                </div>
                <span className="text-xs font-mono font-bold text-[#8C6D42]">
                  {flaconCount} Flacon{flaconCount > 1 ? 's' : ''}
                </span>
              </div>

              {/* Items List or Default Cacao Citrine Card */}
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD3] flex items-center gap-4"
                    >
                      <div className="relative w-16 h-16 rounded-lg bg-neutral-900 border border-[#8C6D42]/30 shrink-0 overflow-hidden">
                        <Image
                          src={item.image || '/images/perfume-front.webp'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-sm text-[#110D09] truncate">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-[#8C6D42] font-mono">
                          50 ML Extrait de Parfum
                        </p>
                        
                        {/* Interactive Quantity Stepper */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.productId, item.quantity - 1);
                              } else {
                                removeFromCart(item.productId);
                              }
                            }}
                            className="w-6 h-6 rounded-full bg-white border border-[#E8E2D8] flex items-center justify-center text-xs font-bold text-[#110D09] hover:bg-neutral-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold px-1">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-white border border-[#E8E2D8] flex items-center justify-center text-xs font-bold text-[#110D09] hover:bg-neutral-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-mono font-bold text-sm text-[#110D09]">
                          ₹{399 * item.quantity}
                        </p>
                        <p className="text-[10px] text-[#110D09]/40 line-through font-mono">
                          ₹{599 * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Instant Default Bottle Showcase if cart was empty */
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFD3] space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg bg-neutral-900 border border-[#8C6D42]/30 shrink-0 overflow-hidden">
                      <Image
                        src="/images/perfume-front.webp"
                        alt="Cacao Citrine"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-sm text-[#110D09]">
                        Cacao Citrine
                      </h3>
                      <p className="text-[11px] text-[#8C6D42] font-mono">
                        50 ML Extrait de Parfum
                      </p>
                      <span className="inline-block px-2 py-0.5 mt-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                        Pre-Order Rate: ₹399
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm text-[#110D09]">₹399</p>
                      <p className="text-[10px] text-[#110D09]/40 line-through font-mono">₹599</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickAddCacaoCitrine}
                    className="w-full py-2 px-3 rounded-lg bg-white border border-[#8C6D42] hover:bg-[#8C6D42] hover:text-white text-xs font-serif font-bold text-[#8C6D42] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Confirm 1 Flacon in Bag</span>
                  </button>
                </div>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-[#E8E2D8] text-xs font-mono">
                <div className="flex justify-between text-[#110D09]/60">
                  <span>Standard Atelier Value:</span>
                  <span className="line-through">₹{standardTotalValue}</span>
                </div>

                <div className="flex justify-between text-[#8C6D42] font-bold">
                  <span>Pre-Order Privilege Savings:</span>
                  <span>- ₹{totalSavings}</span>
                </div>

                <div className="flex justify-between text-[#110D09]/80">
                  <span>Pan-India Priority Courier:</span>
                  <span className="text-emerald-700 font-bold uppercase text-[10px]">
                    FREE (₹0)
                  </span>
                </div>

                <div className="flex justify-between text-[#110D09]/80">
                  <span>Tamper-Proof Wooden Cap Atelier Box:</span>
                  <span className="text-emerald-700 font-bold uppercase text-[10px]">
                    FREE (₹0)
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-[#E8E2D8] text-base font-serif font-bold text-[#110D09]">
                  <span>Total Payable Today:</span>
                  <span className="font-mono text-xl sm:text-2xl text-emerald-800">
                    ₹{totalPayableAmount}
                  </span>
                </div>
              </div>

              {/* Reassurance Notice */}
              <div className="p-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-1.5 text-[11px] text-[#110D09]/80 font-light">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 font-serif">
                  <Info className="w-3.5 h-3.5 text-[#8C6D42]" />
                  <span>Founder's Direct Commitment:</span>
                </div>
                <p className="leading-relaxed">
                  Your reservation goes directly to founder Raghav Sindhwani. Every single flacon is numbered and allocated strictly in order of pre-order confirmation.
                </p>
              </div>

              {/* Founder Contact Pill */}
              <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200 text-center font-mono text-[11px] text-[#110D09]/70">
                Direct WhatsApp Helpline: <strong className="text-[#110D09]">+91 6378582047</strong>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
