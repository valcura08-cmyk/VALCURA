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

      // 2. Customer details and message
      const customerDetails = [
        clientName.trim() ? `• Name: ${clientName.trim()}` : null,
        clientPhone.trim() ? `• Phone: ${clientPhone.trim()}` : null,
        clientCity.trim() ? `• City / Address: ${clientCity.trim()}` : null,
        `• Order ID: ${orderId}`,
        `• Total: ₹${totalPayableAmount}${flaconCount > 1 ? ` (${flaconCount} flacons)` : ''}`,
      ]
        .filter(Boolean)
        .join('\n');

      const whatsappMessage = `Hello Raghav Sindhwani, I want to reserve my Cacao Citrine. Please provide me the scanner to pay.

Customer Details:
${customerDetails}`;

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

      const customerDetails = [
        clientName.trim() ? `• Name: ${clientName.trim()}` : null,
        clientPhone.trim() ? `• Phone: ${clientPhone.trim()}` : null,
        clientCity.trim() ? `• City / Address: ${clientCity.trim()}` : null,
        `• Order ID: ${orderId}`,
        `• Amount Paid: ₹${totalPayableAmount}${flaconCount > 1 ? ` (${flaconCount} flacons)` : ''}`,
      ]
        .filter(Boolean)
        .join('\n');

      const whatsappMessage = `Hello Raghav Sindhwani, I have paid ₹${totalPayableAmount} for my Cacao Citrine reservation to your UPI ID (${MERCHANT_UPI_ID}). Please find my payment screenshot below.

Customer Details:
${customerDetails}`;

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
    <div className="bg-[#FAF8F5] text-[#110D09] min-h-screen pb-10 sm:pb-14">
      {/* Top Header Bar */}
      <header className="border-b border-[#E8E2D8] bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
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
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5">
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto mb-3 sm:mb-4 space-y-0.5">
          <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold block">
            Maison Valcura • Official Reservation
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#110D09] font-bold tracking-tight">
            Reserve Your Flacon
          </h1>
          <p className="text-xs text-[#110D09]/70 font-light max-w-md mx-auto">
            Zero paperwork. Reserve your handcrafted flacon in 1 tap via WhatsApp or direct UPI.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          
          {/* LEFT COLUMN: Interactive Checkout Card (7 Cols) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">

            {/* Quick Compact 3-Step Process Strip */}
            <div className="bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 shadow-2xs flex items-center justify-between gap-1 text-[10px] sm:text-xs font-mono">
              <div className="flex items-center gap-1.5 font-bold text-[#110D09]">
                <span className="w-4 h-4 rounded-full bg-[#8C6D42] text-white flex items-center justify-center text-[9px]">1</span>
                <span>1-Tap Order</span>
              </div>
              <span className="text-[#8C6D42]/60">→</span>
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">2</span>
                <span>Drop Address</span>
              </div>
              <span className="text-[#8C6D42]/60">→</span>
              <div className="flex items-center gap-1.5 font-bold text-blue-800">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">3</span>
                <span>Scan &amp; Ship</span>
              </div>
            </div>

            {/* Interactive Mode Switcher */}
            <div className="bg-white border border-[#E8E2D8] rounded-xl p-1 shadow-2xs flex gap-1">
              <button
                type="button"
                onClick={() => setCheckoutMode('whatsapp')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  checkoutMode === 'whatsapp'
                    ? 'bg-[#110D09] text-white shadow-xs'
                    : 'text-[#110D09]/70 hover:text-[#110D09] hover:bg-neutral-100'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>1-Click WhatsApp</span>
                <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-mono uppercase tracking-wider hidden sm:inline">
                  Fastest
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCheckoutMode('direct_upi')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  checkoutMode === 'direct_upi'
                    ? 'bg-[#110D09] text-white shadow-xs'
                    : 'text-[#110D09]/70 hover:text-[#110D09] hover:bg-neutral-100'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Pay via UPI</span>
              </button>
            </div>

            {/* MODE 1: 1-CLICK WHATSAPP ORDER (Default & Most Frictionless) */}
            {checkoutMode === 'whatsapp' && (
              <div className="bg-white border-2 border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-md space-y-3.5">
                
                {/* Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 sm:p-3 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-serif font-bold text-emerald-950">
                      Direct WhatsApp Priority Concierge
                    </h3>
                    <p className="text-[11px] text-emerald-800 leading-snug font-light">
                      No tedious forms! Tap below to open WhatsApp with founder Raghav Sindhwani (+91 6378582047). Send your address or live location pin directly in chat.
                    </p>
                  </div>
                </div>

                {/* Optional Quick Details */}
                <div className="space-y-2 pt-0.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-[#110D09]/70 font-semibold">
                      Your Details (Optional)
                    </label>
                    <span className="text-[10px] text-[#8C6D42] font-mono">
                      Skip if chatting directly
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Raghav)"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#110D09] placeholder:text-[#110D09]/40 focus:outline-none focus:border-[#8C6D42] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="WhatsApp No. (e.g. 9876543210)"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#110D09] placeholder:text-[#110D09]/40 focus:outline-none focus:border-[#8C6D42] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Your City or PIN code (Optional - or send on WhatsApp)"
                      value={clientCity}
                      onChange={(e) => setClientCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] text-xs text-[#110D09] placeholder:text-[#110D09]/40 focus:outline-none focus:border-[#8C6D42] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Big Glowing WhatsApp Order Button */}
                <div className="pt-1 space-y-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    disabled={loading}
                    className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-serif font-bold text-sm sm:text-base tracking-wide shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Reserving Flacon...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-white" />
                        <span>Order via WhatsApp • ₹{totalPayableAmount}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-center text-[10px] text-[#110D09]/60 font-mono">
                    <Sparkles className="w-3 h-3 text-[#8C6D42]" />
                    <span>Instant 1-Click Allocation • Raghav will send official ICICI QR</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    {errorMsg}
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: DIRECT UPI PAYMENT */}
            {checkoutMode === 'direct_upi' && (
              <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
                <div className="flex items-start gap-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 sm:p-3">
                  <div className="w-7 h-7 rounded-full bg-[#8C6D42] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-serif font-bold text-[#110D09]">
                      Direct ICICI Bank UPI Transfer
                    </h3>
                    <p className="text-[11px] text-[#110D09]/70 leading-snug font-light">
                      Transfer directly to official merchant Raghav Sindhwani or reach out on WhatsApp.
                    </p>
                  </div>
                </div>

                {/* Official UPI & Contact Details Box */}
                <div className="bg-[#FAF8F5] border border-[#E8DFD3] rounded-xl p-3 sm:p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8E2D8]">
                    <div>
                      <span className="text-[9px] tracking-luxury uppercase text-[#8C6D42] font-mono block">
                        Verified Beneficiary
                      </span>
                      <p className="font-serif font-bold text-xs sm:text-sm text-[#110D09]">{MERCHANT_NAME}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] tracking-luxury uppercase text-[#8C6D42] font-mono block">
                        Amount
                      </span>
                      <p className="font-mono font-bold text-sm sm:text-base text-emerald-800">₹{totalPayableAmount}</p>
                    </div>
                  </div>

                  {/* UPI ID & Copy Button */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-[#110D09]/70 font-semibold">
                      Merchant UPI ID:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 bg-white border border-[#E8E2D8] rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold text-[#110D09] select-all truncate">
                        {MERCHANT_UPI_ID}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-2.5 py-1.5 rounded-lg bg-[#110D09] hover:bg-[#8C6D42] text-white text-[11px] font-mono font-semibold transition-colors flex items-center gap-1 shrink-0"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Merchant Mobile / WhatsApp Number & Copy Button */}
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-[#110D09]/70 font-semibold">
                      Contact / WhatsApp Number:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 bg-white border border-[#E8E2D8] rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold text-[#110D09] select-all">
                        +91 6378582047
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        className="px-2.5 py-1.5 rounded-lg bg-[#110D09] hover:bg-[#8C6D42] text-white text-[11px] font-mono font-semibold transition-colors flex items-center gap-1 shrink-0"
                      >
                        {copiedPhone ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Paid via WhatsApp */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleDirectUpiConfirmation}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#110D09] hover:bg-[#8C6D42] text-white font-serif font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating Confirmation...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>I Have Paid • Send Screenshot on WhatsApp</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-[#110D09]/60 font-mono text-center">
                    Sends your payment reference directly to Raghav (+91 6378582047) for instant verification.
                  </p>
                </div>
              </div>
            )}

            {/* Atelier Assurance Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2 bg-white border border-[#E8E2D8] rounded-lg text-center space-y-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D42] mx-auto" />
                <p className="text-[9px] font-bold text-[#110D09]">100% Authentic</p>
                <p className="text-[8px] text-[#110D09]/50 font-mono">Batch 01</p>
              </div>

              <div className="p-2 bg-white border border-[#E8E2D8] rounded-lg text-center space-y-0.5">
                <Truck className="w-3.5 h-3.5 text-[#8C6D42] mx-auto" />
                <p className="text-[9px] font-bold text-[#110D09]">Free Courier</p>
                <p className="text-[8px] text-[#110D09]/50 font-mono">Pan-India</p>
              </div>

              <div className="p-2 bg-white border border-[#E8E2D8] rounded-lg text-center space-y-0.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#8C6D42] mx-auto" />
                <p className="text-[9px] font-bold text-[#110D09]">Founder Direct</p>
                <p className="text-[8px] text-[#110D09]/50 font-mono">Raghav S.</p>
              </div>

              <div className="p-2 bg-white border border-[#E8E2D8] rounded-lg text-center space-y-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8C6D42] mx-auto" />
                <p className="text-[9px] font-bold text-[#110D09]">Atelier Box</p>
                <p className="text-[8px] text-[#110D09]/50 font-mono">Wooden Cap</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Cart & Order Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 sm:p-5 shadow-2xs sticky top-16 space-y-3.5">
              
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E2D8]">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#8C6D42]" />
                  <h2 className="text-xs sm:text-sm font-serif font-bold text-[#110D09]">Your Atelier Flacon</h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#8C6D42]">
                  {flaconCount} Flacon{flaconCount > 1 ? 's' : ''}
                </span>
              </div>

              {/* Items List or Default Cacao Citrine Card */}
              {items.length > 0 ? (
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-2.5 sm:p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DFD3] flex items-center gap-2.5"
                    >
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-neutral-900 border border-[#8C6D42]/30 shrink-0 overflow-hidden">
                        <Image
                          src={item.image || '/images/perfume-front.webp'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-xs sm:text-sm text-[#110D09] truncate">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-[#8C6D42] font-mono">
                          50 ML Extrait de Parfum
                        </p>
                        
                        {/* Interactive Quantity Stepper */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.productId, item.quantity - 1);
                              } else {
                                removeFromCart(item.productId);
                              }
                            }}
                            className="w-5 h-5 rounded-full bg-white border border-[#E8E2D8] flex items-center justify-center text-[10px] font-bold text-[#110D09] hover:bg-neutral-100 transition-colors"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-mono font-bold px-1">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-5 h-5 rounded-full bg-white border border-[#E8E2D8] flex items-center justify-center text-[10px] font-bold text-[#110D09] hover:bg-neutral-100 transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-mono font-bold text-xs sm:text-sm text-[#110D09]">
                          ₹{399 * item.quantity}
                        </p>
                        <p className="text-[9px] text-[#110D09]/40 line-through font-mono">
                          ₹{599 * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Instant Default Bottle Showcase if cart was empty */
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#FAF8F5] border border-[#E8DFD3] space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-12 h-12 rounded-lg bg-neutral-900 border border-[#8C6D42]/30 shrink-0 overflow-hidden">
                      <Image
                        src="/images/perfume-front.webp"
                        alt="Cacao Citrine"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-xs text-[#110D09] truncate">
                        Cacao Citrine
                      </h3>
                      <p className="text-[10px] text-[#8C6D42] font-mono">
                        50 ML Extrait de Parfum
                      </p>
                      <span className="inline-block px-1.5 py-0.2 mt-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold">
                        Pre-Order: ₹399
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-xs sm:text-sm text-[#110D09]">₹399</p>
                      <p className="text-[9px] text-[#110D09]/40 line-through font-mono">₹599</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickAddCacaoCitrine}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-[#8C6D42] hover:bg-[#8C6D42] hover:text-white text-[11px] font-serif font-bold text-[#8C6D42] transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Confirm 1 Flacon in Bag</span>
                  </button>
                </div>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-[#E8E2D8] text-[11px] font-mono">
                <div className="flex justify-between text-[#110D09]/60">
                  <span>Standard Atelier Value:</span>
                  <span className="line-through">₹{standardTotalValue}</span>
                </div>

                <div className="flex justify-between text-[#8C6D42] font-bold">
                  <span>Pre-Order Savings:</span>
                  <span>- ₹{totalSavings}</span>
                </div>

                <div className="flex justify-between text-[#110D09]/80">
                  <span>Pan-India Priority Courier:</span>
                  <span className="text-emerald-700 font-bold uppercase text-[9px]">
                    FREE (₹0)
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-[#E8E2D8] text-sm sm:text-base font-serif font-bold text-[#110D09]">
                  <span>Total Payable Today:</span>
                  <span className="font-mono text-lg sm:text-xl text-emerald-800">
                    ₹{totalPayableAmount}
                  </span>
                </div>
              </div>

              {/* Reassurance Notice */}
              <div className="p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-1 text-[10px] text-[#110D09]/80 font-light">
                <div className="flex items-center gap-1 font-bold text-amber-900 font-serif">
                  <Info className="w-3 h-3 text-[#8C6D42]" />
                  <span>Founder's Direct Commitment:</span>
                </div>
                <p className="leading-snug">
                  Reservation goes directly to founder Raghav Sindhwani. Flacons allocated strictly by confirmation order.
                </p>
              </div>

              {/* Founder Contact Pill */}
              <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-center font-mono text-[10px] text-[#110D09]/70">
                Direct WhatsApp Helpline: <strong className="text-[#110D09]">+91 6378582047</strong>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
