'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, ArrowRight, Instagram } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { totalQuantity, setIsCartOpen } = useCart();
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore By Moods', href: '/moods' },
    { label: 'Explore By Scents', href: '/shop' },
    { label: 'Our Collections', href: '/collections' },
    { label: 'Our Story', href: '/our-story' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md py-3.5 border-b border-[#E8DFD3] shadow-sm'
            : 'bg-[#FAF7F2]/90 backdrop-blur-sm py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="text-[#110D09] p-1.5 sm:p-2 hover:text-[#A68455] transition-colors"
                aria-label="Open mobile navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Left Nav Links - Includes HOME & Creative Navigation Options */}
            <nav className="hidden lg:flex items-center space-x-3 xl:space-x-5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-[11px] xl:text-xs tracking-luxury uppercase transition-colors duration-300 ${
                      isActive
                        ? 'text-[#110D09] font-bold border-b border-[#110D09] pb-0.5'
                        : 'text-[#110D09]/75 hover:text-[#A68455]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Center Logo: Crisp Authentic Dark VALCURA Logo */}
            <div className="flex-1 lg:flex-none flex justify-center items-center">
              <Link href="/" className="group flex items-center space-x-1.5 sm:space-x-2.5 py-1">
                <div className="relative w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src="/brand/valcura-emblem-dark.png"
                    alt="VALCURA Emblem"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative w-24 h-4.5 sm:w-32 sm:h-6">
                  <Image
                    src="/brand/valcura-wordmark-dark.png"
                    alt="VALCURA"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2.5 sm:space-x-6">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-[#110D09]/80 hover:text-[#A68455] transition-colors p-1"
                aria-label="Search Fragrances"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Instagram Direct Link */}
              <a
                href="https://www.instagram.com/valcura__?cplk=MWdscXZoN3BqY3Q3NQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#110D09]/80 hover:text-[#A68455] transition-colors p-1"
                aria-label="VALCURA Instagram (@valcura__)"
                title="Follow @valcura__ on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* Account / Running Account Trigger */}
              {user ? (
                <Link
                  href="/account"
                  className="text-[#110D09] hover:text-[#8C6D42] transition-colors p-1 flex items-center space-x-1.5"
                  title={`Running Account: ${user.fullName}`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#110D09] text-white text-[10px] font-bold flex items-center justify-center relative shadow-sm">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                  </div>
                  <span className="hidden xl:inline text-[11px] font-mono uppercase text-[#110D09] font-semibold truncate max-w-[90px]">
                    {user.fullName.split(' ')[0]}
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="text-[#110D09]/80 hover:text-[#A68455] transition-colors p-1 flex items-center space-x-1"
                  title="Sign In or Create Account"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden xl:inline text-[10px] tracking-widest uppercase text-[#110D09]/60 hover:text-[#110D09]">
                    Account
                  </span>
                </button>
              )}

              {/* Bag Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-[#110D09]/80 hover:text-[#A68455] transition-colors p-1 flex items-center"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#110D09] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white border-r border-[#E8E2D8] flex flex-col justify-between p-6 transition-transform duration-500 shadow-2xl ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#E8E2D8]">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative w-6 h-6">
                  <Image
                    src="/brand/valcura-emblem-dark.png"
                    alt="VALCURA Emblem"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative w-24 h-5">
                  <Image
                    src="/brand/valcura-wordmark-dark.png"
                    alt="VALCURA"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#110D09]/70 hover:text-[#110D09] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-base tracking-luxury uppercase text-[#110D09] hover:text-[#A68455] transition-colors py-1 flex items-center justify-between group"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#110D09] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              <div className="pt-4 border-t border-[#E8E2D8] flex flex-col space-y-4">
                <Link
                  href="/moods"
                  className="text-xs tracking-luxury uppercase text-[#8C6D42] hover:text-[#110D09] transition-colors font-medium"
                >
                  Explore the Mood
                </Link>
                <Link
                  href="/collections/cacaoveil"
                  className="text-xs tracking-luxury uppercase text-[#8C6D42] hover:text-[#110D09] transition-colors font-medium"
                >
                  Cacaoveil
                </Link>
                <Link
                  href="/account"
                  className="text-xs tracking-luxury uppercase text-[#110D09]/80 hover:text-[#110D09] transition-colors"
                >
                  Account & Order Inquiry
                </Link>
                <a
                  href="https://www.instagram.com/valcura__?cplk=MWdscXZoN3BqY3Q3NQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-xs tracking-luxury uppercase text-[#8C6D42] hover:text-[#110D09] transition-colors font-medium pt-2 border-t border-[#E8E2D8]"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram @valcura__</span>
                </a>
              </div>
            </nav>
          </div>

          <div className="pt-6 border-t border-[#E8E2D8]">
            <p className="text-[11px] tracking-widest uppercase text-[#110D09]/50 text-center font-serif">
              A scent for every side of you.
            </p>
          </div>
        </div>
      </div>

      {/* Global Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white border border-[#E8E2D8] p-6 shadow-2xl relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-[#110D09]/60 hover:text-[#110D09]"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 pb-3 border-b border-[#E8E2D8]">
              <Search className="w-5 h-5 text-[#8C6D42]" />
              <input
                type="text"
                placeholder="Search notes, collections, or moods (e.g. Citrus, Hazelnut, Pre-order)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-[#110D09] text-sm tracking-wide focus:outline-none placeholder:text-[#110D09]/40"
              />
            </div>

            <div className="mt-4">
              <p className="text-[10px] tracking-luxury uppercase text-[#8C6D42] mb-2 font-mono">
                Creative Olfactory Discoveries
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Cacao Citrine', href: '/product/cacao-citrine' },
                  { name: 'Calabrian Bergamot', href: '/product/cacao-citrine' },
                  { name: 'Roasted Cacao Absolute', href: '/product/cacao-citrine' },
                  { name: 'Hazelnut Praline Notes', href: '/product/cacao-citrine' },
                  { name: 'Golden Amber Silk', href: '/product/cacao-citrine' },
                  { name: '20% Eau De Parfum', href: '/product/cacao-citrine' },
                  { name: 'The Coffee Date (Mood 01)', href: '/moods/coffee-date' },
                  { name: 'After Hours (Mood 02)', href: '/moods/after-hours' },
                  { name: 'Slow Moments (Mood 04)', href: '/moods/slow-moments' },
                  { name: 'Cacaoveil Collection', href: '/collections/cacaoveil' },
                  { name: 'Pre-Order Privilege (₹399)', href: '/product/cacao-citrine' },
                  { name: 'Atelier Philosophy', href: '/our-story' },
                ].map((tag) => (
                  <Link
                    key={tag.name}
                    href={tag.href}
                    onClick={() => setSearchOpen(false)}
                    className="text-xs bg-[#FAF8F5] text-[#110D09]/80 hover:text-[#110D09] hover:bg-[#F3EFE8] px-3 py-1.5 transition-colors border border-[#E8E2D8] rounded-sm"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
