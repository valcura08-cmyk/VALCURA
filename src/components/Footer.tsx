'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Instagram, Mail, ShieldCheck } from 'lucide-react';

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
    } catch (err) {
      setNewsletterStatus('error');
      setNewsletterMessage('Network error. Please try again.');
    }
  };

  return (
    <footer className="bg-[#F5EFE6] text-[#18120E] border-t border-[#E8DFD3] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Brand + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#E8DFD3]">
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/brand/valcura-emblem-dark.png"
                  alt="VALCURA Emblem"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative w-36 h-7">
                <Image
                  src="/brand/valcura-wordmark-dark.png"
                  alt="VALCURA"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="font-serif text-lg text-[#8C6D42] tracking-wide italic">
              A scent for every side of you.
            </p>
            <p className="text-xs text-[#18120E]/70 font-light leading-relaxed max-w-sm">
              VALCURA is a modern fragrance house built around individuality, moods, and personal
              expression. Crafted with an uncompromising devotion to refined olfactory silhouettes.
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-[#FAF7F2] border border-[#E8DFD3] p-6 sm:p-8 shadow-sm">
              <h3 className="text-xs tracking-luxury uppercase text-[#18120E] mb-2 font-semibold">
                Join Our Fragrance Journey
              </h3>
              <p className="text-xs text-[#18120E]/60 font-light mb-4">
                Be the first to know about private reserve drops, upcoming fragrance debuts, and olfactory journals.
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-[#F5EFE6] border border-[#D5CDC2] px-4 py-3 text-xs text-[#18120E] tracking-wide focus:outline-none focus:border-[#18120E] flex-1 placeholder:text-[#18120E]/40"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="btn-luxury-primary px-6 py-3 text-xs font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {newsletterMessage && (
                <p className={`text-[11px] mt-2.5 font-light ${newsletterStatus === 'success' ? 'text-emerald-800 font-medium' : 'text-red-700'}`}>
                  {newsletterMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Middle Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#E8DFD3] text-xs">
          {/* Col 1 */}
          <div className="space-y-3">
            <h4 className="text-[11px] tracking-luxury uppercase text-[#18120E] font-bold">
              Explore
            </h4>
            <ul className="space-y-2 text-[#18120E]/75 font-light">
              <li>
                <Link href="/shop" className="hover:text-[#8C6D42] transition-colors">
                  All Fragrances
                </Link>
              </li>
              <li>
                <Link href="/collections/cacao" className="hover:text-[#8C6D42] transition-colors">
                  Cacao Collection
                </Link>
              </li>
              <li>
                <Link href="/moods" className="hover:text-[#8C6D42] transition-colors">
                  Explore the Mood
                </Link>
              </li>
              <li>
                <Link href="/fragrance-finder" className="hover:text-[#8C6D42] transition-colors">
                  Fragrance Finder Quiz
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-[11px] tracking-luxury uppercase text-[#18120E] font-bold">
              House of VALCURA
            </h4>
            <ul className="space-y-2 text-[#18120E]/75 font-light">
              <li>
                <Link href="/our-story" className="hover:text-[#8C6D42] transition-colors">
                  Our Story & Philosophy
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#8C6D42] transition-colors">
                  Collections Portfolio
                </Link>
              </li>
              <li>
                <Link href="/product/cacao-citrine" className="hover:text-[#8C6D42] transition-colors">
                  Cacao Citrine Edition
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#8C6D42] transition-colors">
                  Atelier Dashboard & Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-[11px] tracking-luxury uppercase text-[#18120E] font-bold">
              Client Care & Policies
            </h4>
            <ul className="space-y-2 text-[#18120E]/75 font-light">
              <li>
                <Link href="/contact" className="hover:text-[#8C6D42] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#8C6D42] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#8C6D42] transition-colors">
                  Shipping & Dispatch Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#8C6D42] transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-[11px] tracking-luxury uppercase text-[#18120E] font-bold">
              Legal & Payment
            </h4>
            <ul className="space-y-2 text-[#18120E]/75 font-light">
              <li>
                <Link href="/payment-info" className="hover:text-[#8C6D42] transition-colors">
                  Payment & Pre-order Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#8C6D42] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#8C6D42] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li className="pt-2 flex items-center space-x-3 text-[#18120E]/60">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#8C6D42] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="mailto:concierge@valcurafragrance.com"
                  className="hover:text-[#8C6D42] transition-colors"
                  aria-label="Email Concierge"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#18120E]/50 font-light space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} VALCURA. All rights reserved. Registered trademark.</p>
          <div className="flex items-center space-x-2 text-[#18120E]/60">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D42]" />
            <span>Encrypted Checkout • Official VALCURA Atelier Experience</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
