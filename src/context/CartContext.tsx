'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartPaymentPlan =
  | 'preorder_full'
  | 'preorder_deposit'
  | 'standard_full'
  | 'full'
  | 'deposit';

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  volume: string;
  quantity: number;
  paymentPlan: CartPaymentPlan;
  standardUnitPrice: number;
  fullUnitPrice: number;
  depositUnitPrice: number;
  balanceUnitPrice: number;
  reserveTotalUnitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    item: Omit<
      CartItem,
      | 'standardUnitPrice'
      | 'fullUnitPrice'
      | 'depositUnitPrice'
      | 'balanceUnitPrice'
      | 'reserveTotalUnitPrice'
    >,
    paymentPlan?: CartPaymentPlan
  ) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updatePaymentPlan: (productId: string, plan: CartPaymentPlan) => void;
  updateAllPaymentPlans: (plan: CartPaymentPlan) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  // Computed values
  totalQuantity: number;
  subtotalPayableToday: number;
  totalRemainingBalance: number;
  totalOrderPlanValue: number;
  totalStandardValue: number;
  totalSavings: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STANDARD_PRICE = 599;
const FULL_PRICE = 399;
const PREORDER_FULL_PRICE = 399;
const RESERVE_TOTAL = 449;
const DEPOSIT_TODAY = 314;
const BALANCE_REMAINING = 135;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem('valcura_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('valcura_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to storage', e);
      }
    }
  }, [items, isMounted]);

  const addToCart = (
    item: Omit<
      CartItem,
      | 'standardUnitPrice'
      | 'fullUnitPrice'
      | 'depositUnitPrice'
      | 'balanceUnitPrice'
      | 'reserveTotalUnitPrice'
    >,
    paymentPlan: CartPaymentPlan = 'preorder_full'
  ) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                paymentPlan: 'preorder_full',
              }
            : i
        );
      }
      return [
        ...prev,
        {
          ...item,
          paymentPlan: 'preorder_full',
          standardUnitPrice: STANDARD_PRICE,
          fullUnitPrice: PREORDER_FULL_PRICE,
          depositUnitPrice: PREORDER_FULL_PRICE,
          balanceUnitPrice: 0,
          reserveTotalUnitPrice: PREORDER_FULL_PRICE,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const updatePaymentPlan = (productId: string, plan: CartPaymentPlan) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, paymentPlan: plan } : i))
    );
  };

  const updateAllPaymentPlans = (plan: CartPaymentPlan) => {
    setItems((prev) =>
      prev.map((i) => ({ ...i, paymentPlan: plan }))
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations - Flat ₹399 Pre-Order Rate
  const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);

  const subtotalPayableToday = totalQuantity * PREORDER_FULL_PRICE; // ₹399 per flacon
  const totalRemainingBalance = 0; // Flat ₹399, no remaining balance
  const totalOrderPlanValue = totalQuantity * PREORDER_FULL_PRICE;
  const totalStandardValue = totalQuantity * STANDARD_PRICE;
  const totalSavings = Math.max(0, totalStandardValue - totalOrderPlanValue);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        updatePaymentPlan,
        updateAllPaymentPlans,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalQuantity,
        subtotalPayableToday,
        totalRemainingBalance,
        totalOrderPlanValue,
        totalStandardValue,
        totalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
