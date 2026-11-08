'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Search,
  ChevronDown,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Loader2,
  ExternalLink,
  UploadCloud,
  FileCheck,
  RefreshCw,
  ScanLine,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ALL_INDIAN_STATES, getCitiesForState } from '@/data/indiaLocations';
import { QRCodeSVG } from 'qrcode.react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, totalQuantity } = useCart();
  const { user, openAuthModal, saveOrderToAccount } = useAuth();

  // Official Merchant Payment Profile (Raghav Sindhwani)
  const MERCHANT_NAME = 'Raghav Sindhwani';
  const MERCHANT_UPI_ID = 'raghavsindhwanial@okicici';

  // Flat ₹399 pre-order rate per flacon
  const totalPayableAmount = Math.max(399, (totalQuantity || 1) * 399);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    state: user?.state || '',
    city: user?.city || '',
    pincode: user?.pincode || '',
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // State & City Custom Dropdown UI States
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [isCustomCityMode, setIsCustomCityMode] = useState(false);

  // Refs for click outside
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Payment UI state
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiUtr, setUpiUtr] = useState('');
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment'>('details');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [showOfficialPoster, setShowOfficialPoster] = useState(false);

  // Screenshot Upload & AI Extraction State
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [receiptFileSize, setReceiptFileSize] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAnalyzingReceipt, setIsAnalyzingReceipt] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [scanError, setScanError] = useState<string>('');
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [scanDetails, setScanDetails] = useState<{
    payee?: string;
    amount?: number;
    app?: string;
    confidence?: number;
    message?: string;
    utrExtracted?: boolean;
    timestamp?: string;
  } | null>(null);
  const [showManualUtr, setShowManualUtr] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStateOpen(false);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCityOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        state: prev.state || user.state || '',
        city: prev.city || user.city || '',
        pincode: prev.pincode || user.pincode || '',
      }));
    }
  }, [user]);


  // Validation function strictly enforcing minimum 5 characters requirement
  const validateField = (name: string, value: string): string => {
    const trimmed = value.trim();

    switch (name) {
      case 'fullName':
        if (!trimmed) return 'Full Name is mandatory.';
        if (trimmed.length < 5)
          return 'Minimum 5 characters required (single letters like "a" are invalid).';
        if (!/^[a-zA-Z\s.]+$/.test(trimmed))
          return 'Name can only contain alphabetic characters and spaces.';
        return '';

      case 'phone':
        if (!trimmed) return 'Mobile Number is mandatory.';
        if (!/^[6-9]\d{9}$/.test(trimmed))
          return 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
        return '';

      case 'email':
        if (!trimmed) return 'Email Address is mandatory.';
        if (trimmed.length < 5)
          return 'Minimum 5 characters required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
          return 'Please enter a valid email address (e.g. name@domain.com).';
        return '';

      case 'state':
        if (!trimmed) return 'State selection is mandatory.';
        return '';

      case 'city':
        if (!trimmed) return 'City selection is mandatory.';
        if (trimmed.length < 3)
          return 'City name must be at least 3 characters.';
        return '';

      case 'pincode':
        if (!trimmed) return 'PIN Code is mandatory.';
        if (!/^\d{6}$/.test(trimmed))
          return 'PIN code must be exactly 6 numeric digits (e.g. 110001).';
        return '';

      case 'addressLine1':
        if (!trimmed) return 'Address Line 1 is mandatory.';
        if (trimmed.length < 5)
          return 'Minimum 5 characters required (e.g. Flat/House No, Building). Single letters like "a" are invalid.';
        return '';

      case 'addressLine2':
        if (!trimmed) return 'Address Line 2 is mandatory.';
        if (trimmed.length < 5)
          return 'Minimum 5 characters required (e.g. Street, Area, Colony). Single letters like "a" are invalid.';
        return '';

      case 'landmark':
        if (!trimmed) return 'Nearby Landmark is mandatory.';
        if (trimmed.length < 5)
          return 'Minimum 5 characters required (e.g. Near Metro Station / Behind Mall). Single letters like "a" are invalid.';
        return '';

      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // State selection handler
  const handleSelectState = (st: string) => {
    setFormData((prev) => ({ ...prev, state: st, city: '' }));
    setIsCustomCityMode(false);
    setIsStateOpen(false);
    setStateSearch('');
    setErrors((prev) => ({ ...prev, state: '', city: 'Please select a city for ' + st }));
  };

  // City selection handler
  const handleSelectCity = (ct: string) => {
    setFormData((prev) => ({ ...prev, city: ct }));
    setIsCityOpen(false);
    setCitySearch('');
    setErrors((prev) => ({ ...prev, city: '' }));
  };

  // Filtered lists
  const filteredStates = ALL_INDIAN_STATES.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const availableCities = formData.state ? getCitiesForState(formData.state) : [];
  const filteredCities = availableCities.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  // Validate entire form before moving to payment
  const validateAllForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const allFields = [
      'fullName',
      'email',
      'phone',
      'state',
      'city',
      'pincode',
      'addressLine1',
      'addressLine2',
      'landmark',
    ];

    allFields.forEach((f) => {
      const err = validateField(f, formData[f as keyof typeof formData]);
      if (err) newErrors[f] = err;
    });

    setErrors(newErrors);

    const touchedAll: Record<string, boolean> = {};
    allFields.forEach((f) => (touchedAll[f] = true));
    setTouched(touchedAll);

    if (Object.keys(newErrors).length > 0) {
      setErrorMsg('Please complete all mandatory fields with at least 5 letters or numbers.');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const CONCIERGE_WHATSAPP_NUMBER = '916378582047';

  // Direct VIP WhatsApp Concierge Reservation Handler
  const handleSendOrderToWhatsApp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!validateAllForm()) {
      return;
    }

    setLoading(true);

    try {
      // 1. Initialize and save order to Supabase and DB
      const orderId = await initializeServerOrder();

      // 2. Prepare structured luxury WhatsApp message
      const itemsList = items
        .map((i) => `• *${i.name}* (Qty: ${i.quantity}) — ₹${399 * i.quantity}`)
        .join('\n');

      const fullAddress = [
        formData.addressLine1.trim(),
        formData.addressLine2 ? formData.addressLine2.trim() : '',
        formData.landmark ? `Landmark: ${formData.landmark.trim()}` : '',
        `${formData.city.trim()}, ${formData.state.trim()} — ${formData.pincode.trim()}`,
      ]
        .filter(Boolean)
        .join('\n');

      const message = `🏛️ *MAISON VALCURA — ATELIER PRE-ORDER ALLOCATION*
---------------------------------------
*Order Reference:* ${orderId}
*Total Payable:* ₹${totalPayableAmount} (Flat Pre-Order Privilege Rate)

*Reserved Flacon(s):*
${itemsList}

*Client Information:*
• *Name:* ${formData.fullName.trim()}
• *Phone:* +91 ${formData.phone.trim()}
• *Email:* ${formData.email.trim()}

*Priority Delivery Address:*
${fullAddress}
---------------------------------------
_Hello Maison VALCURA Concierge, I have reserved my limited flacon allocation on the official website. Please share your payment QR code so I can complete my payment of ₹${totalPayableAmount}._`;

      const whatsappUrl = `https://wa.me/${CONCIERGE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      // 3. Clear cart
      clearCart();

      // 4. Open WhatsApp directly in a new window/app
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }

      // 5. Navigate customer to confirmation screen
      router.push(`/order-confirmation/${orderId}`);
    } catch (err: any) {
      console.error('WhatsApp order reservation error:', err);
      setErrorMsg(err.message || 'Could not reserve order. Please try again.');
      setLoading(false);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendOrderToWhatsApp(e);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(MERCHANT_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Pre-generate / create server order when customer enters payment or taps GPay
  const initializeServerOrder = async (): Promise<string> => {
    if (activeOrderId) return activeOrderId;

    const fullAddressString = `${formData.addressLine1}, ${formData.addressLine2}, Landmark: ${formData.landmark}`;
    const createRes = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: fullAddressString,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          landmark: formData.landmark,
          state: formData.state,
          city: formData.city,
          pincode: formData.pincode,
        },
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          paymentPlan: 'preorder_full',
        })),
      }),
    });

    const createData = await createRes.json();
    if (!createRes.ok || !createData.success) {
      throw new Error(createData.error || 'Failed to initialize order on server.');
    }

    setActiveOrderId(createData.orderId);
    return createData.orderId;
  };

  // Dynamically load Razorpay standard checkout script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Dynamically load Instamojo in-page modal checkout script
  const loadInstamojoScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Instamojo) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://js.instamojo.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Official Bank Gateway Trigger (Instamojo Official Payment API & Smart Link)
  const handlePayWithOfficialGateway = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Initialize server order in pending state (saved to Supabase & local DB)
      const orderId = await initializeServerOrder();

      // 2. Persist order reference in localStorage & cookie for post-payment confirmation
      if (typeof window !== 'undefined') {
        localStorage.setItem('valcura_pending_order_id', orderId);
        document.cookie = `valcura_pending_order_id=${orderId}; path=/; max-age=86400; SameSite=Lax`;
      }

      // 3. Try official Instamojo in-page checkout modal first
      const isSdkLoaded = await loadInstamojoScript();
      if (isSdkLoaded && (window as any).Instamojo) {
        (window as any).Instamojo.configure({
          handlers: {
            onSuccess: async function (response: any) {
              try {
                setLoading(true);
                const paymentId = response.paymentId || response.payment_id || 'VERIFIED';
                await fetch(
                  `/api/payment/instamojo-callback?payment_id=${paymentId}&payment_status=Credit&order_id=${orderId}`
                );
                clearCart();
                router.push(`/order-confirmation/${orderId}`);
              } catch (e) {
                clearCart();
                router.push(`/order-confirmation/${orderId}`);
              }
            },
            onClose: function () {
              setLoading(false);
              setErrorMsg('Payment was closed. Your order was NOT booked.');
            },
            onFailure: function () {
              setLoading(false);
              setErrorMsg('Payment failed or declined by bank.');
            },
          },
        });

        (window as any).Instamojo.open(
          'https://www.instamojo.com/@raghavsindhwani08/lb3855b83dac64b81aa79f27b632465f6/'
        );
        return;
      }

      // 4. Fallback to direct redirect link
      const instamojoBase = 'https://imjo.in/FgJ98W';
      const paymentUrl = new URL(instamojoBase);
      paymentUrl.searchParams.set('data_name', formData.fullName.trim());
      paymentUrl.searchParams.set('data_email', formData.email.trim());
      paymentUrl.searchParams.set('data_phone', formData.phone.trim());
      paymentUrl.searchParams.set('data_amount', totalPayableAmount.toString());

      window.location.href = paymentUrl.toString();
    } catch (err: any) {
      console.error('Official payment gateway error:', err);
      setErrorMsg(
        err.message || 'Could not initiate payment. Please verify your details.'
      );
      setLoading(false);
    }
  };

  // Official Razorpay Gateway Trigger (UPI, Cards, NetBanking, Wallets)
  const handlePayWithRazorpay = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error(
          'Payment gateway SDK failed to load. Please check your internet connection.'
        );
      }

      // 1. Initialize server order in pending state
      const orderId = await initializeServerOrder();

      // 2. Request official gateway order creation
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPayableAmount,
          orderId,
          customer: formData,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            'Could not initialize official payment gateway. Please verify your connection or merchant credentials.'
        );
      }

      // 3. Open official Razorpay Checkout modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'VALCURA Haute Parfumerie',
        description: `Flacon Allocation Reservation (${totalQuantity || 1} Flacon)`,
        order_id: data.rzpOrderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone.startsWith('+91')
            ? formData.phone
            : `+91${formData.phone}`,
        },
        theme: {
          color: '#110D09',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setErrorMsg(
              'Payment was cancelled or closed. Your order was NOT booked.'
            );
          },
        },
        handler: async function (response: any) {
          try {
            setLoading(true);
            const verifyRes = await fetch('/api/payment/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                valcuraOrderId: orderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.error ||
                  'Payment verification signature failed. Transaction cannot be validated.'
              );
            }

            if (verifyData.order) {
              saveOrderToAccount(verifyData.order);
            }

            clearCart();
            router.push(`/order-confirmation/${orderId}`);
          } catch (err: any) {
            console.error('Verify payment error:', err);
            setErrorMsg(
              err.message || 'Payment confirmation error. Please contact concierge.'
            );
            setLoading(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setLoading(false);
        setErrorMsg(
          `Payment failed: ${response.error?.description || 'Transaction declined by bank.'}`
        );
      });
      rzp.open();
    } catch (err: any) {
      console.error('Official payment checkout error:', err);
      setErrorMsg(
        err.message || 'Could not initiate payment. Please verify your details.'
      );
      setLoading(false);
    }
  };

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="bg-white text-[#110D09] min-h-[70vh] flex items-center justify-center py-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#F5EFE6] mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#8C6D42]" />
          </div>
          <h1 className="text-2xl font-serif uppercase tracking-wide">Your Bag Is Empty</h1>
          <p className="text-xs text-[#110D09]/60 leading-relaxed font-light">
            You currently have no fragrance flacons selected. Explore our creations to reserve your
            limited pre-order flacon.
          </p>
          <Link href="/collections/cacaoveil" className="btn-luxury-primary text-xs inline-block">
            Explore Cacaoveil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-[#E8E2D8]">
        <div className="flex items-center justify-between">
          <Link
            href="/cart"
            className="text-xs tracking-luxury uppercase text-[#110D09] hover:text-[#8C6D42] font-semibold transition-colors"
          >
            ← Return to Bag
          </Link>
          <div className="flex items-center space-x-2 text-xs text-[#110D09]/70 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#8C6D42]" />
            <span>Official VALCURA Atelier Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: CUSTOMER DETAILS OR AUTOMATED PAYMENT GATEWAY */}
          <div className="lg:col-span-7 space-y-8">
            {errorMsg && (
              <div className="bg-red-50 border border-red-300 p-4 text-xs text-red-700 flex items-start space-x-2.5 rounded-sm">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Account Banner */}
            {user ? (
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-900 block">
                      Logged in as {user.fullName} ({user.email})
                    </span>
                    <span className="text-[11px] text-emerald-800/80">
                      Your pre-order will be linked to your running account profile.
                    </span>
                  </div>
                </div>
                <Link
                  href="/account"
                  className="text-[10px] font-mono uppercase text-emerald-900 font-bold underline"
                >
                  View Profile
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
                      Sign in to auto-fill your delivery details and order history.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="px-3 py-1.5 bg-[#110D09] text-white text-[10px] font-serif font-bold uppercase tracking-wider hover:bg-[#8C6D42] transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* STEP 1: PERSONAL INFORMATION & DELIVERY ADDRESS */}
            {paymentStep === 'details' && (
              <form onSubmit={handleProceedToPayment} className="space-y-8">
                {/* SECTION 1: PERSONAL INFORMATION */}
                <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
                    <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono font-semibold">
                      01. Personal Information &amp; Contact
                    </span>
                    <span className="text-[10px] text-red-600 font-mono font-medium">
                      * All fields mandatory (min 5 chars)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[#110D09] font-medium">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <span
                          className={`text-[10px] font-mono ${
                            formData.fullName.trim().length >= 5
                              ? 'text-emerald-700 font-medium'
                              : 'text-amber-700'
                          }`}
                        >
                          {formData.fullName.trim().length >= 5
                            ? '✓ Valid'
                            : `${formData.fullName.trim().length}/5 min letters`}
                        </span>
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        required
                        placeholder="e.g. Vikramaditya Sharma"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('fullName')}
                        className={`w-full bg-[#FAF8F5] border px-3.5 py-3 text-[#110D09] focus:outline-none transition-colors ${
                          touched.fullName && errors.fullName
                            ? 'border-red-500 bg-red-50/20 focus:border-red-600'
                            : 'border-[#D5CDC2] focus:border-[#110D09] focus:bg-white'
                        }`}
                      />
                      {touched.fullName && errors.fullName && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[#110D09] font-medium">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <span
                          className={`text-[10px] font-mono ${
                            formData.phone.trim().length === 10
                              ? 'text-emerald-700 font-medium'
                              : 'text-amber-700'
                          }`}
                        >
                          {formData.phone.trim().length === 10
                            ? '✓ Valid'
                            : `${formData.phone.trim().length}/10 digits`}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="bg-[#EFEAE2] border border-r-0 border-[#D5CDC2] px-3.5 py-3 text-xs text-[#110D09] font-mono font-medium flex items-center">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          required
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('phone')}
                          className={`w-full bg-[#FAF8F5] border px-3.5 py-3 text-[#110D09] focus:outline-none transition-colors ${
                            touched.phone && errors.phone
                              ? 'border-red-500 bg-red-50/20 focus:border-red-600'
                              : 'border-[#D5CDC2] focus:border-[#110D09] focus:bg-white'
                          }`}
                        />
                      </div>
                      {touched.phone && errors.phone && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Email ID */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[#110D09] font-medium">
                          Email ID <span className="text-red-500">*</span>
                        </label>
                        <span
                          className={`text-[10px] font-mono ${
                            formData.email.trim().length >= 5 &&
                            formData.email.includes('@')
                              ? 'text-emerald-700 font-medium'
                              : 'text-amber-700'
                          }`}
                        >
                          {formData.email.trim().length >= 5 && formData.email.includes('@')
                            ? '✓ Valid'
                            : `${formData.email.trim().length}/5 min chars`}
                        </span>
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="yourname@domain.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('email')}
                        className={`w-full bg-[#FAF8F5] border px-3.5 py-3 text-[#110D09] focus:outline-none transition-colors ${
                          touched.email && errors.email
                            ? 'border-red-500 bg-red-50/20 focus:border-red-600'
                            : 'border-[#D5CDC2] focus:border-[#110D09] focus:bg-white'
                        }`}
                      />
                      {touched.email && errors.email && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 2: SHIPPING ADDRESS WITH STATE & CITY SEARCHABLE SCROLLBARS */}
                <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
                    <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono font-semibold">
                      02. Shipping Address (All India Delivery)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      ✓ Free Express Courier
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                    {/* STATE SELECTOR WITH SCROLLBAR & SEARCH */}
                    <div className="relative" ref={stateDropdownRef}>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[#110D09] font-medium">
                          State of India <span className="text-red-500">*</span>
                        </label>
                        {formData.state && (
                          <span className="text-[10px] text-emerald-700 font-mono font-medium">
                            ✓ {formData.state}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsStateOpen(!isStateOpen);
                          setIsCityOpen(false);
                        }}
                        className={`w-full bg-[#FAF8F5] border px-3.5 py-3 text-left flex items-center justify-between transition-colors ${
                          touched.state && errors.state
                            ? 'border-red-500 bg-red-50/20'
                            : 'border-[#D5CDC2] hover:border-[#110D09]'
                        }`}
                      >
                        <span
                          className={formData.state ? 'text-[#110D09] font-medium' : 'text-[#110D09]/45'}
                        >
                          {formData.state || 'Choose your state from list...'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-[#8C6D42]" />
                      </button>

                      {/* State Dropdown with Search & Scrollbar */}
                      {isStateOpen && (
                        <div className="absolute z-40 top-full left-0 right-0 mt-1 bg-white border border-[#110D09] shadow-2xl">
                          <div className="p-2.5 border-b border-[#E8E2D8] bg-[#FAF8F5] flex items-center space-x-2">
                            <Search className="w-3.5 h-3.5 text-[#8C6D42]" />
                            <input
                              type="text"
                              autoFocus
                              placeholder="Type to filter states (e.g. Delhi, Maharashtra)..."
                              value={stateSearch}
                              onChange={(e) => setStateSearch(e.target.value)}
                              className="w-full bg-transparent text-xs text-[#110D09] placeholder-[#110D09]/50 focus:outline-none"
                            />
                          </div>

                          <div className="max-h-56 overflow-y-auto divide-y divide-[#F0EDE8]">
                            {filteredStates.map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleSelectState(st)}
                                className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors flex items-center justify-between ${
                                  formData.state === st
                                    ? 'bg-[#110D09] text-white font-medium'
                                    : 'hover:bg-[#FAF8F5] text-[#110D09]'
                                }`}
                              >
                                <span>{st}</span>
                                {st.includes('Delhi') && (
                                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-[#8C6D42] text-white rounded-xs">
                                    Capital Hub
                                  </span>
                                )}
                              </button>
                            ))}
                            {filteredStates.length === 0 && (
                              <div className="p-3 text-center text-xs text-[#110D09]/50">
                                No state found matching &ldquo;{stateSearch}&rdquo;
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {touched.state && errors.state && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.state}</p>
                      )}
                    </div>

                    {/* CITY SELECTOR WITH SCROLLBAR & SEARCH (FILTERED BY STATE) */}
                    <div className="relative" ref={cityDropdownRef}>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[#110D09] font-medium">
                          City / District <span className="text-red-500">*</span>
                        </label>
                        {formData.city && (
                          <span className="text-[10px] text-emerald-700 font-mono font-medium">
                            ✓ {formData.city}
                          </span>
                        )}
                      </div>

                      {isCustomCityMode ? (
                        <div className="space-y-1">
                          <div className="flex">
                            <input
                              type="text"
                              name="city"
                              placeholder="Enter your city name"
                              value={formData.city}
                              onChange={handleInputChange}
                              onBlur={() => handleBlur('city')}
                              className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3.5 py-3 text-[#110D09] focus:outline-none focus:border-[#110D09]"
                            />
                            <button
                              type="button"
                              onClick={() => setIsCustomCityMode(false)}
                              className="bg-[#EFEAE2] border border-l-0 border-[#D5CDC2] px-3 text-[10px] uppercase font-mono text-[#8C6D42] hover:bg-[#FAF8F5]"
                            >
                              List
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={!formData.state}
                          onClick={() => {
                            if (formData.state) {
                              setIsCityOpen(!isCityOpen);
                              setIsStateOpen(false);
                            }
                          }}
                          className={`w-full bg-[#FAF8F5] border px-3.5 py-3 text-left flex items-center justify-between transition-colors ${
                            !formData.state
                              ? 'opacity-60 cursor-not-allowed border-[#D5CDC2]'
                              : touched.city && errors.city
                              ? 'border-red-500 bg-red-50/20'
                              : 'border-[#D5CDC2] hover:border-[#110D09]'
                          }`}
                        >
                          <span
                            className={formData.city ? 'text-[#110D09] font-medium' : 'text-[#110D09]/45'}
                          >
                            {!formData.state
                              ? 'Select state first...'
                              : formData.city || `Select city in ${formData.state}...`}
                          </span>
                          <ChevronDown className="w-4 h-4 text-[#8C6D42]" />
                        </button>
                      )}

                      {/* City Dropdown with Search & Scrollbar */}
                      {isCityOpen && (
                        <div className="absolute z-40 top-full left-0 right-0 mt-1 bg-white border border-[#110D09] shadow-2xl">
                          <div className="p-2.5 border-b border-[#E8E2D8] bg-[#FAF8F5] flex items-center space-x-2">
                            <Search className="w-3.5 h-3.5 text-[#8C6D42]" />
                            <input
                              type="text"
                              autoFocus
                              placeholder={`Search city in ${formData.state}...`}
                              value={citySearch}
                              onChange={(e) => setCitySearch(e.target.value)}
                              className="w-full bg-transparent text-xs text-[#110D09] placeholder-[#110D09]/50 focus:outline-none"
                            />
                          </div>

                          <div className="max-h-56 overflow-y-auto divide-y divide-[#F0EDE8]">
                            {filteredCities.map((ct) => (
                              <button
                                key={ct}
                                type="button"
                                onClick={() => handleSelectCity(ct)}
                                className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors ${
                                  formData.city === ct
                                    ? 'bg-[#110D09] text-white font-medium'
                                    : 'hover:bg-[#FAF8F5] text-[#110D09]'
                                }`}
                              >
                                {ct}
                              </button>
                            ))}
                            {filteredCities.length === 0 && (
                              <div className="p-3 text-center text-xs text-[#110D09]/60">
                                No city found in {formData.state} matching &ldquo;{citySearch}&rdquo;
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomCityMode(true);
                                setIsCityOpen(false);
                              }}
                              className="w-full text-left px-3.5 py-2.5 text-xs text-[#8C6D42] font-semibold bg-[#FAF6EE] hover:bg-[#F4ECE1] border-t border-[#E8DFD3]"
                            >
                              + Enter Other Town / Custom City Manually
                            </button>
                          </div>
                        </div>
                      )}

                      {touched.city && errors.city && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.city}</p>
                      )}
                    </div>

                    {/* PIN CODE */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[#110D09] font-medium">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <span
                          className={`text-[10px] font-mono ${
                            formData.pincode.trim().length === 6
                              ? 'text-emerald-700 font-medium'
                              : 'text-amber-700'
                          }`}
                        >
                          {formData.pincode.trim().length === 6
                            ? '✓ Valid'
                            : `${formData.pincode.trim().length}/6 digits`}
                        </span>
                      </div>
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        placeholder="e.g. 110001 or 400001"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('pincode')}
                        className={`w-full bg-[#FAF8F5] border px-3.5 py-3 text-[#110D09] focus:outline-none transition-colors ${
                          touched.pincode && errors.pincode
                            ? 'border-red-500 bg-red-50/20 focus:border-red-600'
                            : 'border-[#D5CDC2] focus:border-[#110D09] focus:bg-white'
                        }`}
                      />
                      {touched.pincode && errors.pincode && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">
                          {errors.pincode}
                        </p>
                      )}
                    </div>

                    {/* ADDRESS LINE 1 */}
                    <div className="sm:col-span-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[#110D09] font-medium">
                          Address Line 1 (Flat, House No., Building, Apartment){' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <span
                          className={`text-[10px] font-mono ${
                            formData.addressLine1.trim().length >= 5
                              ? 'text-emerald-700 font-medium'
                              : 'text-amber-700'
                          }`}
                        >
                          {formData.addressLine1.trim().length >= 5
                            ? '✓ Valid'
                            : `${formData.addressLine1.trim().length}/5 min chars`}
                        </span>
                      </div>
                      <input
                        type="text"
                        name="addressLine1"
                        required
                        placeholder="e.g. Flat 402, Royale Crest Apartment, Tower B"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('addressLine1')}
                        className={`w-full bg-[#FAF8F5] border px-3.5 py-3 text-[#110D09] focus:outline-none transition-colors ${
                          touched.addressLine1 && errors.addressLine1
                            ? 'border-red-500 bg-red-50/20 focus:border-red-600'
                            : 'border-[#D5CDC2] focus:border-[#110D09] focus:bg-white'
                        }`}
                      />
                      {touched.addressLine1 && errors.addressLine1 && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">
                          {errors.addressLine1}
                        </p>
                      )}
                    </div>

                    {/* ADDRESS LINE 2 */}
                    <div className="sm:col-span-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[#110D09] font-medium">
                          Address Line 2 (Street Name, Area, Sector, Colony){' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <span
                          className={`text-[10px] font-mono ${
                            formData.addressLine2.trim().length >= 5
                              ? 'text-emerald-700 font-medium'
                              : 'text-amber-700'
                          }`}
                        >
                          {formData.addressLine2.trim().length >= 5
                            ? '✓ Valid'
                            : `${formData.addressLine2.trim().length}/5 min chars`}
                        </span>
                      </div>
                      <input
                        type="text"
                        name="addressLine2"
                        required
                        placeholder="e.g. 14th Main Road, Sector 5, HSR Layout"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('addressLine2')}
                        className={`w-full bg-[#FAF8F5] border px-3.5 py-3 text-[#110D09] focus:outline-none transition-colors ${
                          touched.addressLine2 && errors.addressLine2
                            ? 'border-red-500 bg-red-50/20 focus:border-red-600'
                            : 'border-[#D5CDC2] focus:border-[#110D09] focus:bg-white'
                        }`}
                      />
                      {touched.addressLine2 && errors.addressLine2 && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">
                          {errors.addressLine2}
                        </p>
                      )}
                    </div>

                    {/* NEARBY LANDMARK */}
                    <div className="sm:col-span-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[#110D09] font-medium">
                          Nearby Landmark (Prominent Reference Point){' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <span
                          className={`text-[10px] font-mono ${
                            formData.landmark.trim().length >= 5
                              ? 'text-emerald-700 font-medium'
                              : 'text-amber-700'
                          }`}
                        >
                          {formData.landmark.trim().length >= 5
                            ? '✓ Valid'
                            : `${formData.landmark.trim().length}/5 min chars`}
                        </span>
                      </div>
                      <input
                        type="text"
                        name="landmark"
                        required
                        placeholder="e.g. Near Metro Station Gate No. 2 or Opposite City Park"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('landmark')}
                        className={`w-full bg-[#FAF8F5] border px-3.5 py-3 text-[#110D09] focus:outline-none transition-colors ${
                          touched.landmark && errors.landmark
                            ? 'border-red-500 bg-red-50/20 focus:border-red-600'
                            : 'border-[#D5CDC2] focus:border-[#110D09] focus:bg-white'
                        }`}
                      />
                      {touched.landmark && errors.landmark && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">
                          {errors.landmark}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submission CTA to WhatsApp Concierge */}
                  <div className="pt-4 border-t border-[#E8E2D8] space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#110D09] hover:bg-[#8C6D42] text-white py-4 px-6 rounded-xl text-xs font-serif font-bold tracking-luxury uppercase flex items-center justify-center space-x-2.5 shadow-xl transition-all cursor-pointer"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#8C6D42]" />
                          <span>Securing Allocation & Opening WhatsApp...</span>
                        </div>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 text-emerald-400" />
                          <span>Confirm Order &amp; Send to WhatsApp (+91 6378582047) • ₹{totalPayableAmount}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                      <p className="text-[11px] text-emerald-950 font-mono font-medium">
                        ✓ All your delivery details will be sent directly to our Atelier Concierge on WhatsApp at <strong>+91 6378582047</strong>.
                      </p>
                      <p className="text-[10px] text-emerald-800 font-mono">
                        Our Concierge will immediately reply on WhatsApp with the official payment QR code.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: AUTOMATED PAYMENT INTEGRATION (GPAY, PHONEPE, PAYTM & AUTHENTIC SCANNER) */}
            {paymentStep === 'payment' && (
              <div className="space-y-6">
                {/* 1. SHIPPING ADDRESS SUMMARY & EDIT BUTTON */}
                <div className="bg-[#FAF8F5] border border-[#E8DFD3] p-4 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#110D09]">
                      Shipping to: {formData.fullName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPaymentStep('details')}
                      className="text-[11px] font-mono uppercase text-[#8C6D42] hover:text-[#110D09] underline font-semibold"
                    >
                      Edit Address
                    </button>
                  </div>
                  <p className="text-[#110D09]/70">
                    {formData.addressLine1}, {formData.addressLine2 ? `${formData.addressLine2}, ` : ''}
                    {formData.landmark ? `Landmark: ${formData.landmark}, ` : ''}
                    {formData.city}, {formData.state} - {formData.pincode} • Phone: +91 {formData.phone}
                  </p>
                </div>

                {/* 2. ATELIER OFFICIAL PAYMENT PORTAL */}
                <div className="bg-white border-2 border-[#110D09] p-6 sm:p-8 space-y-6 shadow-xl rounded-2xl">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
                    <div>
                      <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-semibold">
                        Step 2 of 2 • Official Payment Gateway
                      </span>
                      <h2 className="text-xl sm:text-2xl font-serif text-[#110D09] font-bold">
                        Official Payment Portal
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-[#554D45] uppercase block">Total Payable</span>
                      <span className="text-xl font-mono font-bold text-[#110D09]">₹{totalPayableAmount}</span>
                    </div>
                  </div>

                  {/* Trust Banner */}
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span className="font-serif font-bold uppercase tracking-wider text-[11px]">
                        Bank-Grade 256-Bit Encrypted Gateway • 100% Zero Risk
                      </span>
                    </div>
                    <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold uppercase text-emerald-800">
                      Official Settlement
                    </span>
                  </div>

                  {/* Payment Mediums Showcase */}
                  <div className="bg-[#FAF8F5] border border-[#D5CDC2] rounded-2xl p-5 sm:p-6 space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-luxury text-[#8C6D42] font-bold block">
                      Choose Any Payment Medium at Checkout:
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white border border-[#D5CDC2] rounded-xl p-3.5 text-center space-y-1">
                        <Smartphone className="w-5 h-5 mx-auto text-[#8C6D42]" />
                        <span className="font-bold text-[#110D09] block text-xs">UPI</span>
                        <span className="text-[10px] text-[#554D45] block">GPay, PhonePe, Paytm, CRED</span>
                      </div>

                      <div className="bg-white border border-[#D5CDC2] rounded-xl p-3.5 text-center space-y-1">
                        <Lock className="w-5 h-5 mx-auto text-[#8C6D42]" />
                        <span className="font-bold text-[#110D09] block text-xs">Cards</span>
                        <span className="text-[10px] text-[#554D45] block">Visa, Mastercard, RuPay</span>
                      </div>

                      <div className="bg-white border border-[#D5CDC2] rounded-xl p-3.5 text-center space-y-1">
                        <Sparkles className="w-5 h-5 mx-auto text-[#8C6D42]" />
                        <span className="font-bold text-[#110D09] block text-xs">Net Banking</span>
                        <span className="text-[10px] text-[#554D45] block">50+ Indian Banks</span>
                      </div>

                      <div className="bg-white border border-[#D5CDC2] rounded-xl p-3.5 text-center space-y-1">
                        <CheckCircle2 className="w-5 h-5 mx-auto text-[#8C6D42]" />
                        <span className="font-bold text-[#110D09] block text-xs">Wallets</span>
                        <span className="text-[10px] text-[#554D45] block">Paytm, Mobikwik &amp; more</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#554D45] leading-relaxed">
                      Click below to open the official gateway modal. You can choose any payment medium you prefer. Funds are transferred securely, and your reservation is verified and confirmed automatically.
                    </p>
                  </div>

                  {/* Error message banner if any */}
                  {errorMsg && (
                    <div className="p-3.5 bg-red-50 border border-red-400 rounded-xl text-xs text-red-800 font-mono flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Official Direct WhatsApp Concierge Button */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSendOrderToWhatsApp()}
                    className="w-full py-4 text-xs sm:text-sm font-serif font-bold tracking-luxury uppercase rounded-xl flex items-center justify-center space-x-2.5 shadow-xl transition-all bg-[#110D09] hover:bg-[#8C6D42] text-white cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#8C6D42]" />
                        <span>Securing Allocation & Opening WhatsApp...</span>
                      </div>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>Confirm Order &amp; Send to WhatsApp (+91 6378582047) • ₹{totalPayableAmount}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Secondary Instamojo gateway button */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handlePayWithOfficialGateway()}
                    className="w-full py-3 text-xs font-mono uppercase tracking-luxury rounded-xl border border-[#D5CDC2] hover:bg-[#FAF8F5] text-[#110D09] transition-all flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D42]" />
                    <span>Pay via Instamojo Gateway</span>
                  </button>

                  <p className="text-[11px] text-center font-mono text-[#554D45]">
                    🔒 All details are saved in the Atelier master cellar database. Verified payments are dispatched with priority.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY & PRICING BREAKDOWN */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-6 sticky top-28 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
                <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono font-semibold">
                  Pre-Order Bag Summary
                </span>
                <span className="text-[10px] uppercase font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  Flat ₹399 Special Rate
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1 divide-y divide-[#E8E2D8]">
                {items.map((i) => (
                  <div key={i.productId} className="pt-3 first:pt-0 flex items-center space-x-3.5">
                    <div className="relative w-14 h-16 bg-[#F8F5F0] border border-[#E8E2D8] flex-shrink-0">
                      <Image src={i.image} alt={i.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-xs">
                      <h4 className="font-serif text-[#110D09] font-bold text-sm">{i.name}</h4>
                      <p className="text-[10px] text-[#8C6D42] font-mono">
                        Qty: {i.quantity} • 50 ML Eau de Parfum
                      </p>
                      <p className="text-[10px] text-emerald-800 font-mono mt-0.5">
                        Pre-Order Privilege Rate: ₹399 / flacon
                      </p>
                    </div>
                    <div className="text-right text-xs font-mono">
                      <p className="text-[#110D09] font-bold text-sm">
                        ₹{399 * i.quantity}
                      </p>
                      <p className="text-[10px] text-[#110D09]/40 line-through">
                        ₹{599 * i.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-[#E8E2D8] pt-4 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-[#110D09]/60">
                  <span>Standard Atelier Price:</span>
                  <span className="line-through">₹{totalQuantity * 599}</span>
                </div>

                <div className="flex justify-between text-[#8C6D42] font-semibold">
                  <span>Pre-Order Privilege Savings:</span>
                  <span>- ₹{totalQuantity * 200}</span>
                </div>

                <div className="flex justify-between text-[#110D09]/80">
                  <span>Courier &amp; Handling:</span>
                  <span className="text-emerald-700 font-semibold uppercase text-[10px] tracking-wider font-sans">
                    Complimentary (Free)
                  </span>
                </div>

                <div className="flex justify-between text-[#110D09]/70">
                  <span>Remaining Balance on Dispatch:</span>
                  <span className="text-emerald-800 font-bold">₹0 (Zero)</span>
                </div>

                <div className="flex justify-between text-base font-serif text-[#110D09] pt-3 border-t border-[#E8E2D8] font-bold">
                  <span>Total Amount Payable Today:</span>
                  <span className="text-[#110D09] font-mono text-xl font-bold">
                    ₹{totalPayableAmount}
                  </span>
                </div>
              </div>

              {/* Reassurance Features */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E8DFD3] space-y-2 text-[11px] font-light text-[#110D09]/75">
                <div className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span>Flat ₹399 pre-order locks your flacon allocation from Batch 01.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span>All payments deposited directly to {MERCHANT_NAME} ({MERCHANT_UPI_ID}).</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span>Free cancellation within 24 hours &amp; 100% money back for transit damage.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span>Instant digital receipt &amp; automated order tracking generated.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
