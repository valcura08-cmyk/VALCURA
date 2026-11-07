'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    updatePaymentPlan,
    removeFromCart,
    subtotalPayableToday,
    totalRemainingBalance,
    totalOrderPlanValue,
    totalStandardValue,
    totalSavings,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#E8E2D8] text-[#110D09] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between">
            <div>
              <h2 className="text-sm tracking-luxury uppercase font-serif text-[#110D09] font-semibold">
                Shopping Bag
              </h2>
              <p className="text-xs text-[#110D09]/60 mt-0.5">
                {items.length === 0
                  ? 'Your bag is empty'
                  : `${items.reduce((acc, i) => acc + i.quantity, 0)} item(s) selected`}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-[#110D09]/60 hover:text-[#110D09] transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-[#E8E2D8]">
            {items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full border border-[#D5CDC2] flex items-center justify-center">
                  <span className="font-serif text-2xl text-[#110D09]">V</span>
                </div>
                <p className="text-sm text-[#110D09]/70 font-light max-w-xs">
                  Your luxury fragrance bag is currently empty.
                </p>
                <Link
                  href="/collections/cacao"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center space-x-2 text-xs tracking-luxury uppercase text-[#110D09] border border-[#110D09] px-5 py-2.5 hover:bg-[#110D09] hover:text-[#FAF7F2] transition-all"
                >
                  <span>Explore Cacao Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const isDeposit = item.paymentPlan === 'deposit';
                const payableForThisItem =
                  (isDeposit ? item.depositUnitPrice : item.fullUnitPrice) * item.quantity;
                const balanceForThisItem =
                  (isDeposit ? item.balanceUnitPrice : 0) * item.quantity;

                return (
                  <div key={item.productId} className="pt-6 first:pt-0 space-y-4">
                    <div className="flex space-x-4">
                      {/* Thumbnail */}
                      <div className="relative w-20 h-24 bg-[#F8F5F0] border border-[#E8E2D8] overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] tracking-widest uppercase text-[#8C6D42] font-mono font-medium">
                                {item.category} • {item.volume}
                              </span>
                              <h3 className="text-base font-serif tracking-wide text-[#110D09]">
                                {item.name}
                              </h3>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-[#110D09]/40 hover:text-red-600 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3 pt-2">
                          <div className="inline-flex items-center border border-[#D5CDC2] bg-[#FAF8F5]">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-7 h-7 text-xs text-[#110D09]/70 hover:text-[#110D09] transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-mono text-[#110D09]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-7 h-7 text-xs text-[#110D09]/70 hover:text-[#110D09] transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs text-[#110D09]/50">
                            Standard: ₹{item.standardUnitPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Clean Pricing Line */}
                    <div className="bg-[#FAF8F5] border border-[#E8E2D8] p-3 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-[#8C6D42] uppercase block font-medium">Price</span>
                        <span className="text-[#110D09] font-bold">₹{item.fullUnitPrice * item.quantity}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                        Saved ₹{(item.standardUnitPrice - item.fullUnitPrice) * item.quantity}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8E2D8] bg-[#FAF8F5] space-y-4">
              <div className="space-y-1.5 text-xs text-[#110D09]/80 font-mono">
                <div className="flex justify-between">
                  <span className="tracking-wide">Standard Price Total:</span>
                  <span className="line-through text-[#110D09]/40">
                    ₹{totalStandardValue}
                  </span>
                </div>
                <div className="flex justify-between text-[#8C6D42]">
                  <span className="tracking-wide">Privilege Savings:</span>
                  <span>- ₹{totalSavings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="tracking-wide">Shipping:</span>
                  <span className="text-emerald-700 text-[11px] tracking-wider uppercase font-semibold font-sans">
                    Complimentary
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-[#110D09] pt-2 border-t border-[#E8E2D8]">
                  <span className="tracking-wider">Total Amount Payable:</span>
                  <span className="text-[#110D09] font-bold text-lg font-mono">
                    ₹{subtotalPayableToday}
                  </span>
                </div>
                <div className="p-2 bg-white border border-[#E8DFD3] text-[10px] text-[#8C6D42] font-mono text-center">
                  ✨ Pre-Order Privilege: Flat ₹399 per flacon (Dispatched with priority).
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full btn-luxury-primary py-3.5 px-6 text-xs tracking-luxury uppercase font-medium flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center justify-center space-x-2 text-[10px] text-[#110D09]/50 mt-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D42]" />
                  <span>Secure 256-Bit SSL Encrypted Indian Gateway</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
