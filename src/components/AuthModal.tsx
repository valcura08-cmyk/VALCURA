'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Mail, User, Phone, ArrowRight, Eye, EyeOff, AlertCircle, ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SavedSocialAccount {
  email: string;
  name: string;
  lastUsed?: string;
}

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
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);

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

  // Saved accounts
  const [savedGoogleAccounts, setSavedGoogleAccounts] = useState<SavedSocialAccount[]>([]);
  const [savedMicrosoftAccounts, setSavedMicrosoftAccounts] = useState<SavedSocialAccount[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Load saved accounts on mount or modal open
  useEffect(() => {
    if (isAuthModalOpen) {
      try {
        const gList = JSON.parse(localStorage.getItem('valcura_saved_google_accounts') || '[]');
        setSavedGoogleAccounts(Array.isArray(gList) ? gList : []);
      } catch (e) {
        setSavedGoogleAccounts([]);
      }
      try {
        const msList = JSON.parse(localStorage.getItem('valcura_saved_microsoft_accounts') || '[]');
        setSavedMicrosoftAccounts(Array.isArray(msList) ? msList : []);
      } catch (e) {
        setSavedMicrosoftAccounts([]);
      }
      setErrorMsg('');
      setSuccessMsg('');
      setSocialProvider('none');
      setShowAddAccountForm(false);
    }
  }, [isAuthModalOpen]);

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

  const handleSelectSavedAccount = async (acc: SavedSocialAccount, provider: 'google' | 'microsoft') => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      if (provider === 'google') {
        await loginWithGoogle(acc.email, acc.name);
      } else {
        await loginWithMicrosoft(acc.email, acc.name);
      }
      setSuccessMsg(`Signed in as ${acc.email}.`);
      setTimeout(() => {
        closeAuthModal();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
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
      const finalName = socialName.trim() || socialEmail.split('@')[0];
      if (socialProvider === 'google') {
        await loginWithGoogle(socialEmail, finalName);
      } else {
        await loginWithMicrosoft(socialEmail, finalName);
      }
      setSuccessMsg(`Authenticated via ${socialProvider === 'google' ? 'Google' : 'Microsoft'}.`);
      setTimeout(() => {
        closeAuthModal();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google Avatar Colors Generator
  const getGoogleColor = (str: string) => {
    const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#8C6D42'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF7F2] border border-[#E8DFD3] p-6 sm:p-8 shadow-2xl overflow-hidden rounded-xl"
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

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center space-x-2 rounded-md">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 text-center font-medium rounded-md">
            {successMsg}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 1: GOOGLE ACCOUNT CHOOSER (OFFICIAL GOOGLE OAUTH UI) */}
        {/* ======================================================== */}
        {socialProvider === 'google' && (
          <div className="space-y-5 animate-fade-in">
            {/* Google Brand Header */}
            <div className="text-center space-y-2 pb-2">
              <div className="flex justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
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
              </div>
              <h2 className="text-xl font-medium text-[#202124] tracking-tight">
                Choose an account
              </h2>
              <p className="text-xs text-[#5f6368]">
                to continue to <span className="font-semibold text-[#202124]">VALCURA Atelier</span>
              </p>
            </div>

            {/* Account List (Saved Accounts) */}
            {savedGoogleAccounts.length > 0 && !showAddAccountForm && (
              <div className="divide-y divide-[#E0E0E0] border border-[#DADCE0] bg-white rounded-lg overflow-hidden shadow-sm">
                {savedGoogleAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectSavedAccount(acc, 'google')}
                    disabled={loading}
                    className="w-full flex items-center space-x-3.5 p-3.5 hover:bg-[#F8F9FA] transition-colors text-left group"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: getGoogleColor(acc.email) }}
                    >
                      {acc.name ? acc.name.charAt(0).toUpperCase() : acc.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#202124] truncate group-hover:text-[#1a73e8]">
                        {acc.name || acc.email.split('@')[0]}
                      </div>
                      <div className="text-[11px] text-[#5f6368] truncate">
                        {acc.email}
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono font-medium">
                      Saved
                    </span>
                  </button>
                ))}

                {/* Add Another Account Button */}
                <button
                  type="button"
                  onClick={() => setShowAddAccountForm(true)}
                  className="w-full flex items-center space-x-3.5 p-3.5 hover:bg-[#F8F9FA] transition-colors text-left text-xs font-medium text-[#1a73e8]"
                >
                  <div className="w-9 h-9 rounded-full border border-dashed border-[#DADCE0] flex items-center justify-center text-[#1a73e8]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Use another Google account</span>
                </button>
              </div>
            )}

            {/* Add / Enter Google Account Form */}
            {(savedGoogleAccounts.length === 0 || showAddAccountForm) && (
              <form onSubmit={handleSocialSubmit} className="space-y-4">
                <div className="bg-white border border-[#DADCE0] p-5 rounded-lg space-y-3.5 shadow-sm">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#5f6368] block">
                    Enter Google Account Credentials
                  </span>

                  <div>
                    <label className="block text-[11px] text-[#5f6368] mb-1 font-medium">
                      Google Email or Phone *
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="yourname@gmail.com"
                      value={socialEmail}
                      onChange={(e) => setSocialEmail(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#DADCE0] px-3.5 py-2.5 text-xs text-[#202124] rounded focus:outline-none focus:border-[#1a73e8] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#5f6368] mb-1 font-medium">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={socialName}
                      onChange={(e) => setSocialName(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#DADCE0] px-3.5 py-2.5 text-xs text-[#202124] rounded focus:outline-none focus:border-[#1a73e8] focus:bg-white"
                    />
                  </div>

                  <p className="text-[10px] text-[#5f6368] leading-relaxed pt-1">
                    To continue, Google will share your name and email address with VALCURA Atelier to maintain your personal fragrance profile.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {savedGoogleAccounts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAddAccountForm(false)}
                      className="px-4 py-2.5 text-xs text-[#1a73e8] hover:bg-[#1a73e8]/10 rounded font-medium transition-colors"
                    >
                      Back to list
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white py-2.5 px-4 rounded text-xs font-medium tracking-wide shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In with Google'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Google Footer */}
            <div className="pt-2 border-t border-[#E8DFD3] flex items-center justify-between text-[10px] text-[#5f6368]">
              <button
                type="button"
                onClick={() => {
                  setSocialProvider('none');
                  setErrorMsg('');
                }}
                className="text-[#8C6D42] hover:text-[#110D09] font-mono flex items-center space-x-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to VALCURA options</span>
              </button>
              <div className="space-x-3">
                <span className="hover:underline cursor-pointer">Help</span>
                <span className="hover:underline cursor-pointer">Privacy</span>
                <span className="hover:underline cursor-pointer">Terms</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: MICROSOFT ACCOUNT CHOOSER (OFFICIAL MICROSOFT UI) */}
        {/* ======================================================== */}
        {socialProvider === 'microsoft' && (
          <div className="space-y-5 animate-fade-in">
            {/* Microsoft Brand Header */}
            <div className="text-center space-y-2 pb-2">
              <div className="flex justify-center">
                <svg className="w-8 h-8" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-[#1b1b1b] tracking-tight">
                Pick an account
              </h2>
              <p className="text-xs text-[#505050]">
                to continue to <span className="font-semibold text-[#1b1b1b]">VALCURA Atelier</span>
              </p>
            </div>

            {/* Account List (Saved Accounts) */}
            {savedMicrosoftAccounts.length > 0 && !showAddAccountForm && (
              <div className="divide-y divide-[#E0E0E0] border border-[#CCCCCC] bg-white rounded-md overflow-hidden shadow-sm">
                {savedMicrosoftAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectSavedAccount(acc, 'microsoft')}
                    disabled={loading}
                    className="w-full flex items-center space-x-3.5 p-3.5 hover:bg-[#F3F2F1] transition-colors text-left group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#0067b8] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-sm">
                      {acc.name ? acc.name.charAt(0).toUpperCase() : acc.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#1b1b1b] truncate group-hover:text-[#0067b8]">
                        {acc.name || acc.email.split('@')[0]}
                      </div>
                      <div className="text-[11px] text-[#505050] truncate">
                        {acc.email}
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-mono font-medium">
                      Saved
                    </span>
                  </button>
                ))}

                {/* Add Another Account Button */}
                <button
                  type="button"
                  onClick={() => setShowAddAccountForm(true)}
                  className="w-full flex items-center space-x-3.5 p-3.5 hover:bg-[#F3F2F1] transition-colors text-left text-xs font-medium text-[#0067b8]"
                >
                  <div className="w-9 h-9 rounded-full border border-dashed border-[#CCCCCC] flex items-center justify-center text-[#0067b8]">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Use another Microsoft account</span>
                </button>
              </div>
            )}

            {/* Add / Enter Microsoft Account Form */}
            {(savedMicrosoftAccounts.length === 0 || showAddAccountForm) && (
              <form onSubmit={handleSocialSubmit} className="space-y-4">
                <div className="bg-white border border-[#CCCCCC] p-5 rounded-md space-y-3.5 shadow-sm">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#505050] block">
                    Enter Microsoft Account
                  </span>

                  <div>
                    <label className="block text-[11px] text-[#505050] mb-1 font-medium">
                      Email, phone, or Skype *
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="yourname@outlook.com"
                      value={socialEmail}
                      onChange={(e) => setSocialEmail(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-[#1b1b1b] rounded-none focus:outline-none focus:border-[#0067b8] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#505050] mb-1 font-medium">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={socialName}
                      onChange={(e) => setSocialName(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-[#CCCCCC] px-3.5 py-2.5 text-xs text-[#1b1b1b] rounded-none focus:outline-none focus:border-[#0067b8] focus:bg-white"
                    />
                  </div>

                  <p className="text-[10px] text-[#505050] leading-relaxed pt-1">
                    Sign in with your Microsoft personal or work account to sync your fragrance orders.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {savedMicrosoftAccounts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAddAccountForm(false)}
                      className="px-4 py-2.5 text-xs text-[#0067b8] hover:bg-[#0067b8]/10 rounded font-medium transition-colors"
                    >
                      Back to list
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#0067b8] hover:bg-[#005da6] text-white py-2.5 px-4 text-xs font-medium tracking-wide shadow-sm disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In with Microsoft'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Microsoft Footer */}
            <div className="pt-2 border-t border-[#E8DFD3] flex items-center justify-between text-[10px] text-[#505050]">
              <button
                type="button"
                onClick={() => {
                  setSocialProvider('none');
                  setErrorMsg('');
                }}
                className="text-[#8C6D42] hover:text-[#110D09] font-mono flex items-center space-x-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to VALCURA options</span>
              </button>
              <div className="space-x-3">
                <span className="hover:underline cursor-pointer">Terms of use</span>
                <span className="hover:underline cursor-pointer">Privacy & cookies</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: STANDARD VALCURA ATELIER AUTHENTICATION MODAL     */}
        {/* ======================================================== */}
        {socialProvider === 'none' && (
          <>
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
                {mode === 'signin' ? 'Sign In To Atelier' : 'Create Atelier Account'}
              </h2>
              <p className="text-xs text-[#110D09]/65 font-light">
                Access your orders, reservation balances, and personalized fragrance allocations.
              </p>
            </div>

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
                  setShowAddAccountForm(false);
                }}
                className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 bg-white border border-[#D5CDC2] hover:border-[#110D09] hover:shadow-sm text-[#110D09] text-xs font-serif font-semibold tracking-wider transition-all duration-200 rounded-md"
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
                  setShowAddAccountForm(false);
                }}
                className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 bg-white border border-[#D5CDC2] hover:border-[#110D09] hover:shadow-sm text-[#110D09] text-xs font-serif font-semibold tracking-wider transition-all duration-200 rounded-md"
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
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-[#D5CDC2] px-3 py-2.5 text-xs text-[#110D09] placeholder:text-[#110D09]/30 focus:outline-none focus:border-[#110D09] rounded-sm"
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
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-[#D5CDC2] px-3 py-2.5 text-xs text-[#110D09] placeholder:text-[#110D09]/30 focus:outline-none focus:border-[#110D09] rounded-sm"
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
                    placeholder="your.email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#D5CDC2] px-3 py-2.5 text-xs text-[#110D09] placeholder:text-[#110D09]/30 focus:outline-none focus:border-[#110D09] rounded-sm"
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
                    className="w-full bg-white border border-[#D5CDC2] px-3 py-2.5 text-xs text-[#110D09] placeholder:text-[#110D09]/30 focus:outline-none focus:border-[#110D09] rounded-sm"
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
                className="w-full btn-luxury-primary py-3 text-xs font-serif font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 rounded-sm"
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
