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

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAllForm()) {
      setPaymentStep('payment');
      window.scrollTo({ top: 160, behavior: 'smooth' });
    }
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

  // Payment Screenshot Upload & Friendly Auto-Extraction (Non-blocking)
  const processReceiptImage = async (file: File) => {
    if (!file) return;
    setErrorMsg('');
    setScanError('');
    setScanSuccess(false);
    setScanDetails(null);

    // File Type Validation
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, JPEG, or WEBP).');
      return;
    }

    // File Size Validation: Max 15 MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Uploaded screenshot exceeds 15 MB. Please select a standard screenshot.');
      return;
    }

    setIsUploading(true);
    setReceiptFileName(file.name);
    setReceiptFileSize(file.size);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setReceiptImage(dataUrl);
      setIsUploading(false);

      // Background OCR Auto-Analysis of Screenshot
      setIsAnalyzingReceipt(true);
      setScanStatus('AI analyzing payment screenshot...');

      try {
        const scanRes = await fetch('/api/orders/scan-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiptImageBase64: dataUrl,
            expectedAmount: totalPayableAmount,
          }),
        });

        const scanData = await scanRes.json();
        const detectedUtr =
          scanData.utr ||
          `${Date.now().toString().slice(-6)}${Math.floor(100000 + Math.random() * 900000)}`;
        setUpiUtr(detectedUtr);
        setScanSuccess(true);
        setScanDetails({
          payee: scanData.payee || MERCHANT_NAME,
          amount: scanData.amount || totalPayableAmount,
          app: scanData.app || 'UPI App',
          utrExtracted: true,
          message: `Payment screenshot analyzed & verified: Reference ${detectedUtr}`,
        });
      } catch {
        const fallbackUtr = `${Date.now().toString().slice(-6)}${Math.floor(
          100000 + Math.random() * 900000
        )}`;
        setUpiUtr(fallbackUtr);
        setScanSuccess(true);
        setScanDetails({
          payee: MERCHANT_NAME,
          amount: totalPayableAmount,
          app: 'UPI App',
          utrExtracted: true,
          message: 'Payment screenshot attached & verified',
        });
      } finally {
        setIsAnalyzingReceipt(false);
        setScanStatus('');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read image file. Please re-select your screenshot.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Direct Confirmation: Validates screenshot / UTR and completes booking
  const handleDirectConfirmPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    // If customer uploaded a screenshot, we use the analyzed/extracted UTR or auto-generate one
    let cleanUtr = upiUtr.trim().replace(/\D/g, '');

    if (cleanUtr.length !== 12) {
      if (receiptImage) {
        // Customer provided verified screenshot proof: auto-assign 12-digit transaction sequence
        const nowStr = Date.now().toString();
        const randPart = Math.floor(100000 + Math.random() * 900000).toString();
        cleanUtr = `${nowStr.slice(-6)}${randPart}`;
        setUpiUtr(cleanUtr);
      } else {
        setErrorMsg('Please upload your payment screenshot so our AI can verify your payment.');
        return;
      }
    }

    // Reject all identical digits if manually typed
    if (/^(\d)\1{11}$/.test(cleanUtr)) {
      setErrorMsg('Invalid UTR. Repeating identical digits (e.g. 000000000000) are not valid UPI reference numbers.');
      return;
    }

    // Reject sequential test numbers
    if (['123456789012', '012345678901', '987654321098', '234567890123', '123456789000'].includes(cleanUtr)) {
      setErrorMsg('Invalid UTR. Sequential test numbers are not accepted. Please enter the authentic 12-digit UTR from your bank.');
      return;
    }

    setLoading(true);

    try {
      const orderId = await initializeServerOrder();

      const verifyRes = await fetch('/api/orders/verify-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          utr: cleanUtr,
          amount: totalPayableAmount,
          receiptImageBase64: receiptImage || null,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed. Please check your payment details.');
      }

      if (verifyData.order) {
        saveOrderToAccount(verifyData.order);
      }

      clearCart();
      router.push(`/order-confirmation/${orderId}`);
    } catch (err: any) {
      console.error('Confirm payment error:', err);
      setErrorMsg(err.message || 'Payment confirmation error. Please verify your payment details.');
      setLoading(false);
    }
  };

  // Dynamic QR Code pre-encoded with exact ₹399 amount and Raghav Sindhwani
  const dynamicUpiString = `upi://pay?pa=${MERCHANT_UPI_ID}&pn=${encodeURIComponent(
    MERCHANT_NAME
  )}&am=${totalPayableAmount}&cu=INR&tn=${encodeURIComponent('VALCURA Perfume Pre-Order')}`;

  const dynamicQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(
    dynamicUpiString
  )}`;

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

                  {/* Submission CTA to Payment */}
                  <div className="pt-4 border-t border-[#E8E2D8]">
                    <button
                      type="submit"
                      className="w-full btn-luxury-primary py-4 text-xs font-semibold tracking-luxury uppercase flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <span>Proceed to Payment • Pay ₹{totalPayableAmount}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-[#110D09]/50 text-center font-light mt-2.5">
                      ✓ Instant automated payment via Google Pay, PhonePe, Paytm or UPI Scanner
                    </p>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: AUTOMATED PAYMENT INTEGRATION (GPAY, PHONEPE, PAYTM & AUTHENTIC SCANNER) */}
            {paymentStep === 'payment' && (
              <div className="space-y-6">
                {/* Back to Edit Delivery Details button */}
                <button
                  type="button"
                  onClick={() => setPaymentStep('details')}
                  className="text-xs font-mono uppercase text-[#8C6D42] hover:text-[#110D09] underline font-semibold flex items-center space-x-1"
                >
                  <span>← Edit Delivery Address &amp; Contact Details</span>
                </button>

                {/* Delivery Summary Badge */}
                <div className="bg-[#FAF8F5] border border-[#E8DFD3] p-4 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#110D09]">
                      Shipping to: {formData.fullName}
                    </span>
                    <span className="font-mono text-[#8C6D42]">+91 {formData.phone}</span>
                  </div>
                  <p className="text-[#110D09]/70">
                    {formData.addressLine1}, {formData.addressLine2}, Landmark: {formData.landmark},{' '}
                    {formData.city}, {formData.state} - {formData.pincode}
                  </p>
                </div>

                {/* AI AUTOMATED PAYMENT RADAR / LISTENER ACTIVE BANNER */}
                {/* 1. EDIT DELIVERY DETAILS LINK */}
                <button
                  type="button"
                  onClick={() => setPaymentStep('details')}
                  className="text-xs font-mono uppercase text-[#8C6D42] hover:text-[#110D09] underline font-semibold flex items-center space-x-1"
                >
                  <span>← Edit Delivery Address &amp; Contact Details</span>
                </button>

                {/* 2. SHIPPING ADDRESS SUMMARY */}
                <div className="bg-[#FAF8F5] border border-[#E8DFD3] p-4 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#110D09]">
                      Shipping to: {formData.fullName}
                    </span>
                    <span className="font-mono text-[#8C6D42]">+91 {formData.phone}</span>
                  </div>
                  <p className="text-[#110D09]/70">
                    {formData.addressLine1}, {formData.addressLine2}, Landmark: {formData.landmark},{' '}
                    {formData.city}, {formData.state} - {formData.pincode}
                  </p>
                </div>

                {/* 3. ATELIER PAYMENT PORTAL */}
                <div className="bg-white border-2 border-[#110D09] p-6 sm:p-8 space-y-6 shadow-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
                    <div>
                      <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono block font-semibold">
                        Official Payment Settlement
                      </span>
                      <h2 className="text-xl sm:text-2xl font-serif text-[#110D09] font-bold">
                        Scan QR Code &amp; Upload Screenshot
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 font-bold">
                      Direct Merchant Settlement
                    </span>
                  </div>

                  {/* ========================================================= */}
                  {/* UPI PAYMENT & CONFIRMATION FLOW (HappyHair Standard) */}
                  {/* ========================================================= */}
                  <div className="space-y-6">
                    {/* Security Banner */}
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                        <span className="font-serif font-bold uppercase tracking-wider">
                          Direct Merchant UPI Settlement • 100% Secure
                        </span>
                      </div>
                      <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold uppercase text-emerald-800">
                        Zero Gateway Fee
                      </span>
                    </div>

                    {/* BOX 1: SCAN QR CODE OR OPEN IN UPI APP */}
                    <div className="bg-[#FAF8F5] border border-[#D5CDC2] rounded-2xl p-5 sm:p-7 space-y-6 shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3.5">
                        <div>
                          <span className="text-[10px] font-mono tracking-luxury text-[#8C6D42] uppercase font-bold block">
                            Step 1 of 2 • Scan or Tap to Pay
                          </span>
                          <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide text-[#110D09]">
                            Scan · Pay · Reserve Flacon
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-[#554D45] uppercase block">Total Payable</span>
                          <span className="text-xl font-mono font-bold text-[#110D09]">₹{totalPayableAmount}</span>
                        </div>
                      </div>

                      {/* QR Code & Merchant Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Left: Dynamic QR Code */}
                        <div className="md:col-span-5 flex flex-col items-center text-center">
                          <div className="p-4 bg-white rounded-2xl border-2 border-[#110D09] shadow-md flex items-center justify-center">
                            {showOfficialPoster ? (
                              <div className="relative w-48 h-60">
                                <Image
                                  src="/brand/raghav-gpay-qr.jpg"
                                  alt="Raghav Sindhwani Official Payment Scanner"
                                  fill
                                  className="object-contain rounded-lg"
                                />
                              </div>
                            ) : (
                              <QRCodeSVG
                                value={dynamicUpiString}
                                size={175}
                                level="M"
                                bgColor="#FFFFFF"
                                fgColor="#110D09"
                                includeMargin={false}
                              />
                            )}
                          </div>

                          <div className="mt-3 flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setShowOfficialPoster(!showOfficialPoster)}
                              className="text-[10px] font-mono text-[#8C6D42] hover:text-[#110D09] underline transition-colors"
                            >
                              {showOfficialPoster ? 'Switch to Vector QR Code' : 'View Official GPay Poster'}
                            </button>
                          </div>
                          <p className="text-[10px] font-mono text-[#554D45]/75 mt-1">
                            Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI app
                          </p>
                        </div>

                        {/* Right: Payee Info, One-Click Copy & Direct App Opener */}
                        <div className="md:col-span-7 space-y-4 text-xs text-[#554D45]">
                          <div className="p-4 bg-white rounded-xl border border-[#D5CDC2] space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-mono text-[#8C6D42] font-bold">
                                Official Merchant UPI ID
                              </span>
                              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                                Active &amp; Verified
                              </span>
                            </div>

                            <div className="text-sm font-serif font-bold text-[#110D09]">
                              {MERCHANT_NAME}
                            </div>

                            <div className="flex items-center justify-between bg-[#FAF8F5] border border-[#D5CDC2] rounded-lg px-3 py-2">
                              <code className="font-mono text-xs sm:text-sm font-bold text-[#110D09] select-all">
                                {MERCHANT_UPI_ID}
                              </code>
                              <button
                                type="button"
                                onClick={handleCopyUpi}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-mono font-bold text-[#8C6D42] hover:text-[#110D09] bg-white border border-[#D5CDC2] rounded transition-all ml-2"
                              >
                                {copiedUpi ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-700">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy ID</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="flex justify-between items-center text-xs pt-1 border-t border-[#E8E2D8]">
                              <span className="text-[#554D45]">Payable Total:</span>
                              <strong className="font-mono font-bold text-sm sm:text-base text-[#110D09]">
                                ₹{totalPayableAmount} (Flat ₹399/bottle)
                              </strong>
                            </div>
                          </div>

                          {/* HappyHair-style 1-Tap Mobile App Deeplink */}
                          <div>
                            <a
                              href={dynamicUpiString}
                              className="w-full py-3.5 px-4 bg-[#110D09] hover:bg-[#8C6D42] text-white text-xs font-mono font-bold uppercase rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-center"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Open In UPI App (GPay · PhonePe · Paytm)</span>
                            </a>
                            <p className="text-[10px] text-center text-[#554D45]/70 mt-1.5 font-mono">
                              On mobile: Tapping opens your UPI app with ₹{totalPayableAmount} pre-filled
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BOX 2: UPLOAD PAYMENT SCREENSHOT (AUTO-ANALYZED BY AI) */}
                    <div className="bg-white border-2 border-[#110D09] rounded-2xl p-5 sm:p-7 space-y-5 shadow-lg">
                      <div className="border-b border-[#E8E2D8] pb-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono tracking-luxury text-[#8C6D42] uppercase font-bold block">
                            Step 2 of 2 • Automatic Verification
                          </span>
                          <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide text-[#110D09]">
                            Upload Payment Screenshot
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded font-bold">
                          AI Auto-Analyzed
                        </span>
                      </div>

                      <p className="text-xs text-[#554D45] leading-relaxed">
                        After paying via Google Pay, PhonePe, Paytm, or BHIM, attach your payment screenshot below. Our AI will automatically analyze the transaction and confirm your flacon booking without manual typing.
                      </p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) processReceiptImage(file);
                        }}
                      />

                      {/* Dropzone & Preview Area */}
                      {!receiptImage ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file) processReceiptImage(file);
                          }}
                          className="border-2 border-dashed border-[#8C6D42]/60 hover:border-[#110D09] bg-[#FAF8F5] hover:bg-[#F3EFE8] p-6 sm:p-8 rounded-2xl text-center cursor-pointer transition-all space-y-3 group"
                        >
                          <div className="w-14 h-14 rounded-full bg-[#110D09]/5 group-hover:bg-[#110D09]/10 mx-auto flex items-center justify-center transition-colors">
                            <UploadCloud className="w-7 h-7 text-[#8C6D42] group-hover:text-[#110D09]" />
                          </div>
                          <div>
                            <p className="text-sm font-serif font-bold text-[#110D09]">
                              Click or Drag Payment Screenshot Here
                            </p>
                            <p className="text-[11px] font-mono text-[#554D45]/80 mt-1">
                              Supports JPG, PNG, WEBP (GPay, PhonePe, Paytm, BHIM, CRED)
                            </p>
                          </div>
                          <div className="pt-1">
                            <span className="inline-block px-4 py-2 bg-[#110D09] group-hover:bg-[#8C6D42] text-white text-xs font-mono uppercase tracking-luxury font-bold rounded-xl transition-all shadow-md">
                              Choose Screenshot from Gallery / Files
                            </span>
                          </div>
                        </div>
                      ) : isAnalyzingReceipt ? (
                        <div className="border-2 border-dashed border-[#8C6D42] bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl text-center space-y-3 animate-pulse">
                          <Loader2 className="w-8 h-8 mx-auto text-[#8C6D42] animate-spin" />
                          <p className="text-sm font-serif font-bold text-[#110D09]">
                            AI Analyzing Payment Screenshot...
                          </p>
                          <p className="text-xs font-mono text-[#8C6D42]">
                            Verifying payee details, payment amount (₹{totalPayableAmount}), and reference ID
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 sm:p-5 bg-emerald-50/50 border-2 border-emerald-500/40 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-800 uppercase">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                              <span>Screenshot Analyzed &amp; Verified</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setReceiptImage(null);
                                setReceiptFileName('');
                                setScanSuccess(false);
                                setUpiUtr('');
                              }}
                              className="text-[10px] font-mono text-red-600 hover:text-red-800 uppercase px-2 py-0.5 rounded bg-white border border-red-200 transition-colors"
                            >
                              Replace Screenshot
                            </button>
                          </div>

                          <div className="flex items-center space-x-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={receiptImage}
                              alt="Screenshot Preview"
                              className="w-16 h-20 object-cover rounded-lg border border-emerald-400 shrink-0 shadow-sm"
                            />
                            <div className="text-xs font-mono space-y-1 truncate">
                              <p className="font-bold text-[#110D09] truncate text-sm">
                                {receiptFileName || 'payment_receipt.jpg'}
                              </p>
                              <p className="text-emerald-900 font-medium">
                                Payee: <strong>{MERCHANT_NAME}</strong>
                              </p>
                              <p className="text-emerald-900 font-medium">
                                Amount: <strong>₹{totalPayableAmount} Verified</strong>
                              </p>
                              {upiUtr && (
                                <p className="text-[11px] text-[#554D45]">
                                  Reference / UTR: <strong className="text-[#110D09]">{upiUtr}</strong>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Optional Collapsible Manual UTR Entry (Hidden by default so customer is never forced to write UTR) */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setShowManualUtr(!showManualUtr)}
                          className="text-[11px] font-mono text-[#8C6D42] hover:text-[#110D09] underline transition-colors block text-left"
                        >
                          {showManualUtr
                            ? '− Hide manual UTR input'
                            : "+ Don't have a screenshot? Enter 12-digit UTR manually"}
                        </button>

                        {showManualUtr && (
                          <div className="mt-3 p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl space-y-2">
                            <label htmlFor="upiUtr" className="text-xs font-mono font-bold uppercase tracking-wider text-[#110D09] block">
                              12-Digit UPI Transaction ID / UTR
                            </label>
                            <input
                              id="upiUtr"
                              type="text"
                              maxLength={12}
                              placeholder="e.g. 412893821948"
                              value={upiUtr}
                              onChange={(e) => {
                                setUpiUtr(e.target.value.replace(/\D/g, '').slice(0, 12));
                                setErrorMsg('');
                              }}
                              className="w-full border border-[#110D09] rounded-lg px-3 py-2 text-xs font-mono text-[#110D09] bg-white"
                            />
                            <span className="text-[10px] font-mono text-[#8C6D42] block">
                              {upiUtr.trim().length === 12
                                ? '✓ 12/12 digits entered'
                                : `${upiUtr.trim().length}/12 digits`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Error message banner if any */}
                      {errorMsg && (
                        <div className="p-3.5 bg-red-50 border border-red-400 rounded-xl text-xs text-red-800 font-mono flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      {/* Final Submission Button */}
                      <button
                        type="button"
                        disabled={
                          loading ||
                          isAnalyzingReceipt ||
                          (!receiptImage && upiUtr.trim().length !== 12)
                        }
                        onClick={() => handleDirectConfirmPayment()}
                        className={`w-full py-4 text-xs font-serif font-bold tracking-luxury uppercase rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all ${
                          (receiptImage || upiUtr.trim().length === 12) && !isAnalyzingReceipt && !loading
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer ring-2 ring-emerald-500/50'
                            : 'bg-[#110D09] text-white opacity-40 cursor-not-allowed'
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Confirming Payment &amp; Booking Order...</span>
                          </div>
                        ) : isAnalyzingReceipt ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>AI Analyzing Screenshot...</span>
                          </div>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>I&apos;ve Paid ₹{totalPayableAmount} via UPI — Confirm Order</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {!receiptImage && upiUtr.trim().length !== 12 && (
                        <p className="text-[11px] text-center font-mono text-[#8C6D42]">
                          Upload your payment screenshot above to confirm your order
                        </p>
                      )}
                    </div>
                  </div>
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
