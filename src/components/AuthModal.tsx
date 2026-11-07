'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Lock, Mail, User, Phone, ArrowRight, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
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
  const [socialProvider, setSocialProvider] = useState<'none' | 'google' | 'microsoft'>('none');

  // Standard fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Social fields
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      const cleanName = fullName.trim() || email.split('@')[0];
      await loginWithEmail(email, cleanName, phone);
      setSuccessMsg(mode === 'signup' ? 'Welcome to VALCURA! Account created.' : 'Signed in successfully.');
      setTimeout(() => {
        closeAuthModal();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!socialEmail || !socialEmail.includes('@')) {
      setErrorMsg(`Please enter a valid ${socialProvider === 'google' ? 'Google' : 'Microsoft'} email address.`);
      return;
    }

    setLoading(true);
    try {
      if (socialProvider === 'google') {
        await loginWithGoogle(socialEmail, socialName || socialEmail.split('@')[0]);
      } else {
        await loginWithMicrosoft(socialEmail, socialName || socialEmail.split('@')[0]);
      }
      setSuccessMsg(`Authenticated via ${socialProvider === 'google' ? 'Google' : 'Microsoft'}.`);
      setTimeout(() => {
        closeAuthModal();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF7F2] border border-[#E8DFD3] p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prominent Circular Cross Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#D5CDC2] text-[#110D09] hover:bg-[#110D09] hover:text-[#FAF7F2] flex items-center justify-center transition-all duration-200 shadow-sm z-30 cursor-pointer group"
          title="Close and continue browsing"
          aria-label="Close login dialog"
        >
          <X className="w-5 h-5 stroke-[2] transition-transform group-hover:rotate-90 duration-300" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="relative w-8 h-8 mx-auto opacity-90">
            <Image
              src="/brand/valcura-emblem-dark.png"
              alt="VALCURA Emblem"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-semibold block">
            VALCURA Client Portal
          </span>
          <h2 className="text-2xl font-serif uppercase tracking-wide text-[#110D09]">
            {socialProvider === 'google'
              ? 'Sign In with Google'
              : socialProvider === 'microsoft'
              ? 'Sign In with Microsoft'
              : mode === 'signin'
              ? 'Sign In To Atelier'
              : 'Create Atelier Account'}
          </h2>
          <p className="text-xs text-[#110D09]/65 font-light">
            {socialProvider !== 'none'
              ? 'Enter your account details to access your running profile.'
              : 'Access your orders, reservation balances, and personalized fragrance allocations.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 text-center font-medium">
            {successMsg}
          </div>
        )}

        {/* VIEW 1: DEDICATED SOCIAL SIGN-IN PROMPT (GOOGLE OR MICROSOFT) */}
        {socialProvider !== 'none' ? (
          <form onSubmit={handleSocialSubmit} className="space-y-4">
            <div className="bg-white border border-[#D5CDC2] p-4 rounded-sm space-y-3">
              <div className="flex items-center space-x-2 text-xs font-serif font-bold text-[#110D09]">
                {socialProvider === 'google' ? (
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
                ) : (
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                )}
                <span>
                  {socialProvider === 'google'
                    ? 'Use your Google / Gmail Account'
                    : 'Use your Microsoft / Outlook Account'}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#110D09]/75 mb-1">
                  {socialProvider === 'google' ? 'Google Email Address *' : 'Microsoft Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder={socialProvider === 'google' ? 'yourname@gmail.com' : 'yourname@outlook.com'}
                  value={socialEmail}
                  onChange={(e) => setSocialEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3 py-2 text-xs text-[#110D09] focus:outline-none focus:border-[#110D09]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#110D09]/75 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5CDC2] px-3 py-2 text-xs text-[#110D09] focus:outline-none focus:border-[#110D09]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-luxury-primary py-3 text-xs font-serif font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : `Sign In With ${socialProvider === 'google' ? 'Google' : 'Microsoft'}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setSocialProvider('none');
                setErrorMsg('');
              }}
              className="w-full text-center text-[11px] font-mono text-[#8C6D42] hover:text-[#110D09] py-1 flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to standard options</span>
            </button>
          </form>
        ) : (
          /* VIEW 2: STANDARD SIGN IN & REGISTRATION */
          <>
            {/* Mode Switch Tabs */}
            <div className="flex border-b border-[#E8DFD3] mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                }}
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
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                }}
                className={`flex-1 pb-3 text-xs font-serif font-bold uppercase tracking-[0.18em] transition-colors border-b-2 ${
                  mode === 'signup'
                    ? 'border-[#110D09] text-[#110D09]'
                    : 'border-transparent text-[#110D09]/40 hover:text-[#110D09]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Social Authentication Buttons */}
            <div className="space-y-2.5 mb-5">
              <button
                type="button"
                onClick={() => {
                  setSocialProvider('google');
                  setErrorMsg('');
                }}
                className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 bg-white border border-[#D5CDC2] hover:border-[#110D09] hover:shadow-sm text-[#110D09] text-xs font-serif font-semibold tracking-wider transition-all duration-200"
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

              <button
                type="button"
                onClick={() => {
                  setSocialProvider('microsoft');
                  setErrorMsg('');
                }}
                className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 bg-white border border-[#D5CDC2] hover:border-[#110D09] hover:shadow-sm text-[#110D09] text-xs font-serif font-semibold tracking-wider transition-all duration-200"
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
            <div className="relative flex items-center justify-center mb-5">
              <div className="w-full border-t border-[#E8DFD3]" />
              <span className="absolute px-3 bg-[#FAF7F2] text-[10px] font-mono uppercase text-[#8C6D42] tracking-widest">
                Or With Email
              </span>
            </div>

            {/* Standard Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#110D09]/75 mb-1">
                      Full Name *
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

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#110D09]/75 mb-1">
                      Mobile Number (For Delivery Updates)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-[#D5CDC2] px-3 py-2.5 text-xs text-[#110D09] placeholder:text-[#110D09]/30 focus:outline-none focus:border-[#110D09]"
                      />
                      <Phone className="w-3.5 h-3.5 text-[#8C6D42] absolute right-3 top-3" />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#110D09]/75 mb-1">
                  Email Address *
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#110D09]/75">
                    Password *
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('Please contact our client concierge at care@valcurafragrance.com to reset your credentials.')}
                      className="text-[10px] text-[#8C6D42] hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#D5CDC2] px-3 py-2.5 text-xs text-[#110D09] placeholder:text-[#110D09]/30 focus:outline-none focus:border-[#110D09]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#8C6D42] hover:text-[#110D09]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#110D09] rounded-none"
                  />
                  <span className="text-[11px] text-[#110D09]/70">Save session on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-luxury-primary py-3 text-xs font-serif font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
              >
                <span>
                  {loading
                    ? 'Authenticating...'
                    : mode === 'signin'
                    ? 'Sign In To Account'
                    : 'Create Atelier Account'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        )}

        {/* Dismiss Link */}
        <div className="mt-4 pt-2 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-[10px] font-mono uppercase tracking-widest text-[#110D09]/50 hover:text-[#110D09] transition-colors underline"
          >
            ✕ Dismiss & Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
