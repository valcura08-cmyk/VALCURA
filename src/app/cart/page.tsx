'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Trash2, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    updatePaymentPlan,
    removeFromCart,
    subtotalPayableToday,
    totalRemainingBalance,
    totalOrderPlanValue,
    totalStandardValue,
    totalSavings,
  } = useCart();

  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-wide text-[#110D09] pb-6 border-b border-[#E8E2D8]">
          Your Shopping Bag
        </h1>

        {items.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full border border-[#D5CDC2] mx-auto flex items-center justify-center">
              <span className="font-serif text-2xl text-[#110D09]">V</span>
            </div>
            <h2 className="text-xl font-serif uppercase tracking-wide text-[#110D09]">
              Your bag is currently empty
            </h2>
            <p className="text-xs sm:text-sm text-[#110D09]/60 font-light">
              Explore our debut Cacaoveil Collection and reserve your flacon before launch allocation is
              fulfilled.
            </p>
            <div>
              <Link href="/collections/cacaoveil" className="btn-luxury-primary">
                Explore Cacaoveil
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
            {/* Items Column */}
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => {
                const isDeposit = item.paymentPlan === 'deposit';
                const itemPayable =
                  (isDeposit ? item.depositUnitPrice : item.fullUnitPrice) * item.quantity;
                const itemBalance =
                  (isDeposit ? item.balanceUnitPrice : 0) * item.quantity;

                return (
                  <div
                    key={item.productId}
                    className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="relative w-28 h-36 bg-[#F8F5F0] border border-[#E8E2D8] flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] tracking-widest uppercase text-[#8C6D42] font-mono font-medium">
                                {item.category} • {item.volume}
                              </span>
                              <h2 className="text-2xl font-serif tracking-wide text-[#110D09]">
                                {item.name}
                              </h2>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId)}
                              className="text-[#110D09]/40 hover:text-red-600 transition-colors p-1"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center space-x-4 pt-4">
                          <div className="inline-flex items-center border border-[#D5CDC2] bg-[#FAF8F5]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 text-xs hover:text-[#110D09]"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-mono text-[#110D09] font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 text-xs hover:text-[#110D09]"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs text-[#110D09]/50 font-mono">
                            Standard Retail: ₹{item.standardUnitPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#110D09]/70">Flacon Price: ₹{item.fullUnitPrice}</span>
                      <span className="text-[#110D09] font-bold text-sm">Total: ₹{item.fullUnitPrice * item.quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary & Checkout Box */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-6 sticky top-28 shadow-lg">
                <h3 className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono border-b border-[#E8E2D8] pb-3 font-medium">
                  Summary & Calculations
                </h3>

                <div className="space-y-3 text-xs text-[#110D09]/80 font-mono">
                  <div className="flex justify-between">
                    <span>Standard List Total:</span>
                    <span className="line-through text-[#110D09]/40">₹{totalStandardValue}</span>
                  </div>
                  <div className="flex justify-between text-[#8C6D42]">
                    <span>Privilege Savings:</span>
                    <span>- ₹{totalSavings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Charges:</span>
                    <span className="text-emerald-700 font-sans uppercase text-[10px] tracking-wider font-semibold">
                      Complimentary
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-serif text-[#110D09] pt-3 border-t border-[#E8E2D8] font-bold">
                    <span>Total Amount Payable:</span>
                    <span>₹{subtotalPayableToday}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] border border-[#E8DFD3] text-[10px] text-[#8C6D42] font-mono text-center">
                  ✨ Pre-order settlement options (₹399 Full / ₹449 70% Plan) selectable at checkout.
                </div>

                <div className="pt-1">
                  <Link
                    href="/checkout"
                    className="w-full btn-luxury-primary flex items-center justify-center space-x-2 py-4"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-[#110D09]/50 font-light justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#8C6D42]" />
                  <span>Secure Server-Side Payment Protocol</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
