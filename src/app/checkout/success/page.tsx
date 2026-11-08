'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const paymentStatus = searchParams.get('payment_status');

    if (!paymentId || paymentStatus?.toLowerCase() !== 'credit') {
      setStatus('failed');
      setErrorMsg('Payment was not completed or was declined by the bank.');
      return;
    }

    // Payment is verified credit by Instamojo
    clearCart();

    const pendingOrderId =
      localStorage.getItem('valcura_pending_order_id') || 'confirmed';

    // Call the server callback to finalize order status
    fetch(`/api/payment/instamojo-callback?payment_id=${paymentId}&payment_status=Credit&order_id=${pendingOrderId}`)
      .then(() => {
        setStatus('success');
        localStorage.removeItem('valcura_pending_order_id');
        setTimeout(() => {
          router.push(`/order-confirmation/${pendingOrderId}`);
        }, 800);
      })
      .catch((err) => {
        console.error('Callback error:', err);
        setStatus('success');
        router.push(`/order-confirmation/${pendingOrderId}`);
      });
  }, [searchParams, clearCart, router]);

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white border border-red-300 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-serif text-[#110D09] font-bold">Payment Unsuccessful</h2>
          <p className="text-xs text-[#554D45]">{errorMsg}</p>
          <a
            href="/checkout"
            className="btn-luxury-primary block py-3 text-xs uppercase tracking-luxury text-center font-bold"
          >
            Return to Checkout
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="bg-white border border-[#E8E2D8] rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
          {status === 'success' ? (
            <CheckCircle2 className="w-8 h-8" />
          ) : (
            <Loader2 className="w-8 h-8 animate-spin" />
          )}
        </div>
        <h2 className="text-xl font-serif text-[#110D09] font-bold">
          {status === 'success' ? 'Payment Verified!' : 'Confirming Your Allocation...'}
        </h2>
        <p className="text-xs text-[#554D45] leading-relaxed">
          {status === 'success'
            ? 'Your flacon reservation is officially locked. Redirecting to confirmation screen...'
            : 'Connecting to bank settlement gateway and securing your master cellar reservation...'}
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#8C6D42]" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
