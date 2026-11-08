'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterStatus, setNewsletterStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = React.useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterStatus('loading');
    setNewsletterMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail, source: 'footer' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewsletterStatus('success');
        setNewsletterMessage('Thank you for subscribing to the VALCURA private journal.');
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.error || 'Subscription failed. Please try again.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMessage('Network error. Please try again.');
    }
  };

  return (
    <footer className="bg-white text-[#111111] border-t border-black/10 pt-12 sm:pt-16 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. TOP HEADER: STAY CONNECTED */}
        <div className="border-b border-black/15 pb-4 sm:pb-5 mb-8 sm:mb-12">
          <div className="flex items-baseline justify-between">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-condensed tracking-tight text-[#111111] uppercase leading-none font-bold">
              STAY CONNECTED
            </h2>
            <a
              href="https://www.instagram.com/valcura__?cplk=MWdscXZoN3BqY3Q3NQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-sans font-bold tracking-wider text-[#111111] uppercase hover:text-[#8C6D42] transition-colors"
            >
              @valcura__
            </a>
          </div>
        </div>

        {/* 2. MIDDLE NAVIGATION & SOCIAL COLUMNS */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 lg:gap-16">
          {/* Social Box: Square Instagram Button */}
          <div>
            <a
              href="https://www.instagram.com/valcura__?cplk=MWdscXZoN3BqY3Q3NQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 bg-[#111111] text-white flex items-center justify-center hover:bg-[#8C6D42] transition-colors"
              aria-label="VALCURA Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* 3 Nav Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-24 flex-1 max-w-2xl">
            {/* Column 1: Fragrances & Collections */}
            <ul className="space-y-2.5 sm:space-y-3 text-[13px] sm:text-sm text-[#111111]">
              <li>
                <Link href="/product/cacao-citrine" className="hover:text-[#8C6D42] transition-colors">
                  Cacao Citrine
                </Link>
              </li>
              <li>
                <Link href="/product/silken-sambac" className="hover:text-[#8C6D42] transition-colors">
                  Silken Sambac
                </Link>
              </li>
              <li>
                <Link href="/product/roasted-zest" className="hover:text-[#8C6D42] transition-colors">
                  Roasted Zest
                </Link>
              </li>
              <li>
                <Link href="/collections/cacao" className="hover:text-[#8C6D42] transition-colors">
                  The Cacao Collection
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#8C6D42] transition-colors">
                  Discovery Set
                </Link>
              </li>
            </ul>

            {/* Column 2: House & Support */}
            <ul className="space-y-2.5 sm:space-y-3 text-[13px] sm:text-sm text-[#111111]">
              <li>
                <Link href="/faq" className="hover:text-[#8C6D42] transition-colors">
                  FAQ’s
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#8C6D42] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="hover:text-[#8C6D42] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/fragrance-finder" className="hover:text-[#8C6D42] transition-colors">
                  Fragrance Finder
                </Link>
              </li>
            </ul>

            {/* Column 3: Legal & Policies */}
            <ul className="space-y-2.5 sm:space-y-3 text-[13px] sm:text-sm text-[#111111]">
              <li>
                <Link href="/terms" className="hover:text-[#8C6D42] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#8C6D42] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#8C6D42] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#8C6D42] transition-colors">
                  Refunds &amp; Exchange
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. BOTTOM ROW: BRAND EDITORIAL CARD (LEFT) + NEWSLETTER SIGNUP (RIGHT) */}
        <div className="mt-14 sm:mt-20 pt-10 sm:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Atmospheric Brand Card */}
          <div className="lg:col-span-6 w-full">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#111111] flex flex-col justify-between p-6 sm:p-8 select-none group">
              <Image
                src="/brand/home-banner-valcura-roses.jpg"
                alt="VALCURA Fragrance"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

              {/* Script Overlay */}
              <p className="relative z-10 font-handwriting text-white/95 text-3xl sm:text-4xl lg:text-[42px] leading-tight drop-shadow-sm">
                for every mood
              </p>

              {/* Bold Brand Wordmark */}
              <h3 className="relative z-10 font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-[0.25em] uppercase drop-shadow-md">
                VALCURA
              </h3>
            </div>
          </div>

          {/* Right: Newsletter Block */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full pt-1 lg:pt-2">
            <div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-condensed tracking-tight text-[#111111] font-bold uppercase leading-tight mb-3">
                Sign up for our Newsletter
              </h3>
              <p className="text-xs sm:text-sm text-[#111111]/70 font-light leading-relaxed mb-6 max-w-lg">
                Be the first one to know about private reserve drops, upcoming fragrance debuts, and olfactory journals. Unsubscribe whenever you like.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full max-w-md">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email"
                  className="bg-[#F0EDE8] border border-transparent focus:border-black px-4 py-3 sm:py-3.5 text-sm text-[#111111] placeholder:text-[#111111]/45 focus:outline-none flex-1 transition-colors"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="bg-[#111111] hover:bg-[#8C6D42] text-white px-7 py-3 sm:py-3.5 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 shrink-0"
                >
                  {newsletterStatus === 'loading' ? 'Joining...' : 'Join us'}
                </button>
              </form>
              {newsletterMessage && (
                <p className={`text-xs mt-3 font-light ${newsletterStatus === 'success' ? 'text-emerald-800 font-medium' : 'text-red-700'}`}>
                  {newsletterMessage}
                </p>
              )}
            </div>

            {/* Copyright Sign-off */}
            <div className="border-t border-black/15 pt-6 mt-10 sm:mt-14">
              <p className="text-xs sm:text-[13px] text-[#111111] font-light">
                © VALCURA 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
