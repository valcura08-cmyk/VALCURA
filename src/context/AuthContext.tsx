'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '@/lib/db';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  provider: 'google' | 'microsoft' | 'email';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  memberSince: string;
}

interface AuthContextType {
  user: UserProfile | null;
  orders: Order[];
  isLoadingOrders: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  loginWithGoogle: (email?: string, name?: string) => Promise<UserProfile>;
  loginWithMicrosoft: (email?: string, name?: string) => Promise<UserProfile>;
  loginWithEmail: (email: string, fullName: string, phone?: string) => Promise<UserProfile>;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  refreshOrders: () => Promise<void>;
  saveOrderToAccount: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'valcura_user_auth_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Load saved login on initial mount & automatically show login popup on website open
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          setUser(parsed);
          fetchOrdersForEmail(parsed.email);
          return; // Already logged in, no need to show login popup
        }
      }
    } catch (e) {
      console.error('Failed to parse saved auth session', e);
    }

    // If user is not logged in and hasn't dismissed in this session, show login popup on website open
    try {
      const dismissed = sessionStorage.getItem('valcura_login_popup_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsAuthModalOpen(true);
          setAuthModalMode('signin');
        }, 700);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Fallback
      const timer = setTimeout(() => {
        setIsAuthModalOpen(true);
        setAuthModalMode('signin');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch orders from API + local client orders
  const fetchOrdersForEmail = async (email: string) => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders/user?email=${encodeURIComponent(email)}`);
      let serverOrders: Order[] = [];
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          serverOrders = data.orders;
        }
      }

      // Also read local client orders saved in browser for this email
      let localOrders: Order[] = [];
      try {
        const localKey = `valcura_orders_${email.toLowerCase().trim()}`;
        const localSaved = localStorage.getItem(localKey);
        if (localSaved) {
          localOrders = JSON.parse(localSaved);
        }
      } catch (e) {
        console.error('Failed to read local orders', e);
      }

      // Merge and deduplicate by order ID
      const orderMap = new Map<string, Order>();
      [...serverOrders, ...localOrders].forEach((ord) => {
        if (ord && ord.id) {
          orderMap.set(ord.id, ord);
        }
      });

      const merged = Array.from(orderMap.values());
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(merged);
    } catch (err) {
      console.error('Failed to fetch user orders', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const saveSession = (profile: UserProfile) => {
    setUser(profile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save auth session', e);
    }
    fetchOrdersForEmail(profile.email);
  };

  const loginWithGoogle = async (googleEmail: string, googleName?: string): Promise<UserProfile> => {
    if (!googleEmail || !googleEmail.includes('@')) {
      throw new Error('Please enter a valid Google Account email.');
    }
    const cleanEmail = googleEmail.trim().toLowerCase();
    const cleanName = googleName?.trim() || cleanEmail.split('@')[0];

    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: cleanEmail,
          fullName: cleanName,
          provider: 'google',
        }),
      });
    } catch (e) {
      console.error('Failed to register Google login to server', e);
    }

    // Remember in device Google accounts list
    try {
      const saved = JSON.parse(localStorage.getItem('valcura_saved_google_accounts') || '[]');
      const filtered = saved.filter((a: any) => a.email?.toLowerCase() !== cleanEmail);
      filtered.unshift({
        email: cleanEmail,
        name: cleanName,
        lastUsed: new Date().toISOString(),
      });
      localStorage.setItem('valcura_saved_google_accounts', JSON.stringify(filtered.slice(0, 5)));
    } catch (e) {
      // Ignore localStorage error
    }

    const profile: UserProfile = {
      id: `usr_g_${Math.floor(100000 + Math.random() * 900000)}`,
      email: cleanEmail,
      fullName: cleanName,
      provider: 'google',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    saveSession(profile);
    setIsAuthModalOpen(false);
    return profile;
  };

  const loginWithMicrosoft = async (msEmail: string, msName?: string): Promise<UserProfile> => {
    if (!msEmail || !msEmail.includes('@')) {
      throw new Error('Please enter a valid Microsoft Account email.');
    }
    const cleanEmail = msEmail.trim().toLowerCase();
    const cleanName = msName?.trim() || cleanEmail.split('@')[0];

    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: cleanEmail,
          fullName: cleanName,
          provider: 'microsoft',
        }),
      });
    } catch (e) {
      console.error('Failed to register Microsoft login to server', e);
    }

    // Remember in device Microsoft accounts list
    try {
      const saved = JSON.parse(localStorage.getItem('valcura_saved_microsoft_accounts') || '[]');
      const filtered = saved.filter((a: any) => a.email?.toLowerCase() !== cleanEmail);
      filtered.unshift({
        email: cleanEmail,
        name: cleanName,
        lastUsed: new Date().toISOString(),
      });
      localStorage.setItem('valcura_saved_microsoft_accounts', JSON.stringify(filtered.slice(0, 5)));
    } catch (e) {
      // Ignore localStorage error
    }

    const profile: UserProfile = {
      id: `usr_ms_${Math.floor(100000 + Math.random() * 900000)}`,
      email: cleanEmail,
      fullName: cleanName,
      provider: 'microsoft',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    saveSession(profile);
    setIsAuthModalOpen(false);
    return profile;
  };

  const loginWithEmail = async (email: string, fullName: string, phone?: string): Promise<UserProfile> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];

    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: cleanEmail,
          fullName: cleanName,
          phone: phone || '',
          provider: 'email',
        }),
      });
    } catch (e) {
      console.error('Failed to register email login to server', e);
    }

    const profile: UserProfile = {
      id: `usr_em_${Math.floor(100000 + Math.random() * 900000)}`,
      email: cleanEmail,
      fullName: cleanName,
      provider: 'email',
      phone: phone || '',
      memberSince: 'November 2026',
    };

    saveSession(profile);
    setIsAuthModalOpen(false);
    return profile;
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth session', e);
    }
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update auth session', e);
    }
  };

  const refreshOrders = async () => {
    if (user?.email) {
      await fetchOrdersForEmail(user.email);
    }
  };

  const saveOrderToAccount = (newOrder: Order) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev.filter((o) => o.id !== newOrder.id)];
      // Also persist to localStorage
      if (user?.email) {
        try {
          const localKey = `valcura_orders_${user.email.toLowerCase().trim()}`;
          localStorage.setItem(localKey, JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save order locally', e);
        }
      }
      return updated;
    });
  };

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    try {
      sessionStorage.setItem('valcura_login_popup_dismissed', 'true');
    } catch (e) {
      console.error('Failed to save popup dismissal', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        isLoadingOrders,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithMicrosoft,
        loginWithEmail,
        logout,
        updateProfile,
        refreshOrders,
        saveOrderToAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
