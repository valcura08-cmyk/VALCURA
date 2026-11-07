'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Check, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    loginWithGoogle,
    loginWithMicrosoft,
    loginWithEmail,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(authModalMode || 'signin');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [customSocialEmail, setCustomSocialEmail] = useState('');
  const [showCustomEmailInput, setShowCustomEmailInput] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<'google' | 'microsoft' | null>(null);

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await loginWithEmail(email, fullName || email.split('@')[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialClick = async (provider: 'google' | 'microsoft') => {
    setLoading(true);
    try {
      if (provider === 'google') {
        await loginWithGoogle(customSocialEmail || undefined);
      } else {
        await loginWithMicrosoft(customSocialEmail || undefined);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoName: string) => {
    setLoading(true);
    try {
      await loginWithGoogle(demoEmail, demoName);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF7F2] border border-[#E8DFD3] p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prominent Cross Button on Top Upper Side */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-[#110D09] text-[#110D09] hover:bg-[#110D09] hover:text-[#FAF7F2] flex items-center justify-center transition-all duration-200 shadow-md z-30 cursor-pointer group"
          title="Close and continue browsing"
          aria-label="Close login dialog"
        >
          <X className="w-5 h-5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-300" />
        </button>

        {/* Brand Logo & Heading */}
        <div className="text-center space-y-2 mb-6">
          <div className="relative w-8 h-8 mx-auto opacity-90">
            <Image
              src="/brand/valcura-emblem-dark.png"
              alt="VALCURA Emblem"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold block">
            VALCURA Client Portal
          </span>
          <h2 className="text-2xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
            {mode === 'signin' ? 'Access Your Account' : 'Create Atelier Account'}
          </h2>
          <p className="text-xs text-[#110D09]/65 font-light">
            Sign in to access your running account, order history, and fragrance allocations.
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-[#E8DFD3] mb-6">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 pb-3 text-xs font-serif font-bold uppercase tracking-[0.18em] transition-colors border-b-2 ${
              mode === 'signin'
                ? 'border-[#110D09] text-[#110D09]'
                : 'border-transparent text-[#110D09]/40 hover:text-[#110D09]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 pb-3 text-xs font-serif font-bold uppercase tracking-[0.18em] transition-colors border-b-2 ${
              mode === 'signup'
                ? 'border-[#110D09] text-[#110D09]'
                : 'border-transparent text-[#110D09]/40 hover:text-[#110D09]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1. SOCIAL LOGIN BUTTONS (GOOGLE & MICROSOFT) */}
        <div className="space-y-3 mb-6">
          {/* Google Button */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialClick('google')}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white border border-[#D5CDC2] hover:border-[#110D09] hover:shadow-sm text-[#110D09] text-xs font-serif font-bold tracking-wider transition-all duration-200"
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

          {/* Microsoft Button */}
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialClick('microsoft')}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white border border-[#D5CDC2] hover:border-[#110D09] hover:shadow-sm text-[#110D09] text-xs font-serif font-bold tracking-wider transition-all duration-200"
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
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-full border-t border-[#E8DFD3]" />
          <span className="absolute px-3 bg-[#FAF7F2] text-[10px] font-mono uppercase text-[#8C6D42] tracking-widest">
            Or With Email
          </span>
        </div>

        {/* 2. EMAIL FORM */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#110D09]/75 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-[#D5CDC2] px-3 py-2.5 text-xs text-[#110D09] placeholder:text-[#110D09]/30 focus:outline-none focus:border-[#110D09]"
                />
                <User className="w-3.5 h-3.5 text-[#8C6D42] absolute right-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#110D09]/75 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#D5CDC2] px-3 py-2.5 text-xs text-[#110D09] placeholder:text-[#110D09]/30 focus:outline-none focus:border-[#110D09]"
              />
              <Mail className="w-3.5 h-3.5 text-[#8C6D42] absolute right-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#110D09]/75 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#D5CDC2] px-3 py-2.5 text-xs text-[#110D09] placeholder:text-[#110D09]/30 focus:outline-none focus:border-[#110D09]"
              />
              <Lock className="w-3.5 h-3.5 text-[#8C6D42] absolute right-3 top-3" />
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#110D09] rounded-none"
              />
              <span className="text-[11px] text-[#110D09]/70">Save login on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-luxury-primary py-3 text-xs font-serif font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In To Account' : 'Create My Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 3. ONE-CLICK DEMO TEST ACCOUNTS */}
        <div className="mt-6 pt-4 border-t border-[#E8DFD3]/80">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D42] font-semibold block text-center mb-2">
            ⚡ Quick Test Running Accounts with Orders
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemo('aarav.sharma@example.com', 'Aarav Sharma')}
              className="p-2 bg-white border border-[#E8DFD3] hover:border-[#110D09] text-left transition-colors"
            >
              <span className="font-bold block text-[#110D09]">Aarav Sharma</span>
              <span className="text-[9px] text-[#8C6D42] font-mono">2 Orders Saved</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('priya.sen@example.com', 'Priya Sen')}
              className="p-2 bg-white border border-[#E8DFD3] hover:border-[#110D09] text-left transition-colors"
            >
              <span className="font-bold block text-[#110D09]">Priya Sen</span>
              <span className="text-[9px] text-[#8C6D42] font-mono">1 Order Saved</span>
            </button>
          </div>
        </div>

        {/* 4. DISMISS & CONTINUE BROWSING AS GUEST */}
        <div className="mt-4 pt-2 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-[11px] font-mono uppercase tracking-widest text-[#110D09]/60 hover:text-[#110D09] transition-colors underline"
          >
            ✕ Dismiss & Continue Browsing As Guest
          </button>
        </div>
      </div>
    </div>
  );
}
