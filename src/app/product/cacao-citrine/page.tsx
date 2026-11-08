'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  Droplets,
  Layers,
  Clock,
  Compass,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CacaoCitrineProductPage() {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'evolution' | 'moods' | 'ritual'>('evolution');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToImage = (index: number) => {
    setActiveImageIndex(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cards = container.querySelectorAll<HTMLElement>('[data-gallery-card]');
      if (cards[index]) {
        cards[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cards = container.querySelectorAll<HTMLElement>('[data-gallery-card]');
      const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;

      let closestIndex = activeImageIndex;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });

      if (closestIndex !== activeImageIndex) {
        setActiveImageIndex(closestIndex);
      }
    }
  };

  const handlePrev = () => {
    const prevIdx = (activeImageIndex - 1 + images.length) % images.length;
    scrollToImage(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeImageIndex + 1) % images.length;
    scrollToImage(nextIdx);
  };

  const images = [
    {
      src: '/products/cacao-citrine-1.jpg',
      caption: 'Stone & Cocoa Still Life',
      alt: 'VALCURA Cacao Citrine - Sandstone Still Life',
    },
    {
      src: '/products/cacao-citrine-2.jpg',
      caption: 'Travertine & Hazelnut',
      alt: 'VALCURA Cacao Citrine - Studio Portrait with Hazelnut',
    },
    {
      src: '/products/cacao-citrine-3.jpg',
      caption: 'Champagne Silk Satin',
      alt: 'VALCURA Cacao Citrine - Lay-flat Flacon in Liquid Silk',
    },
    {
      src: '/products/cacao-citrine-4.jpg',
      caption: 'Pedestal Perspective',
      alt: 'VALCURA Cacao Citrine - Polished Plinth Display',
    },
  ];

  const moodLinks = [
    { slug: 'coffee-date', title: 'The Coffee Date', tag: 'Morning Ritual' },
    { slug: 'after-hours', title: 'After Hours', tag: 'Twilight Evening' },
    { slug: 'little-indulgence', title: 'A Little Indulgence', tag: 'Afternoon Leisure' },
    { slug: 'slow-moments', title: 'Slow Moments', tag: 'Quiet Weekend' },
    { slug: 'light-up', title: 'Light Up', tag: 'Midnight Flame' },
  ];

  // Pricing constants per unit
  const standardPrice = 599;
  const fullPrice = 499;

  // Multi-quantity calculations
  const totalStandard = standardPrice * quantity;
  const totalFull = fullPrice * quantity;

  const handleAddToCart = () => {
    addToCart(
      {
        productId: 'cacao-citrine',
        name: 'Cacao Citrine',
        slug: 'cacao-citrine',
        image: images[0].src,
        category: 'Unisex',
        volume: '50 ML',
        quantity: quantity,
        paymentPlan: 'full',
      },
      'full'
    );
  };

  return (
    <div className="bg-[#FAF7F2] text-[#110D09] min-h-[calc(100vh-70px)] pb-12">
      {/* Compact Editorial Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 text-[11px] text-[#554D45] font-light flex items-center justify-between border-b border-[#E8DFD3]/70">
        <div className="flex items-center space-x-2">
          <Link href="/" className="hover:text-[#8C6D42] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[#8C6D42] transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-[#110D09] font-medium font-mono uppercase">Cacao Citrine</span>
        </div>
        <span className="text-[10px] font-mono text-[#8C6D42] uppercase tracking-wider hidden sm:inline">
          50 ML Extrait Formulation
        </span>
      </div>

      {/* Main Single-Open Product Experience */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 sm:pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          
          {/* ============================================================== */}
          {/* LEFT: HORIZONTAL SWIPEABLE PHOTOGRAPHY ROW */}
          {/* ============================================================== */}
          <div className="lg:col-span-6 space-y-3">
            {/* Header: Label + Quick Angle Stepper */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold">
                  Gallery Perspectives
                </span>
                <span className="text-[10px] font-mono text-[#554D45]/70">
                  (Swipe Horizontally)
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full bg-white border border-[#E8DFD3] text-[#110D09] hover:bg-[#FAF8F5] hover:border-[#8C6D42] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                  aria-label="Previous Perspective"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs font-bold text-[#110D09] px-1">
                  0{activeImageIndex + 1} / 0{images.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full bg-white border border-[#E8DFD3] text-[#110D09] hover:bg-[#FAF8F5] hover:border-[#8C6D42] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                  aria-label="Next Perspective"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Swipeable Track */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex flex-row overflow-x-auto snap-x snap-mandatory scroll-smooth gap-3.5 sm:gap-4 pb-2 px-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {images.map((img, idx) => (
                <div
                  key={img.src}
                  data-gallery-card
                  onClick={() => scrollToImage(idx)}
                  className={`relative w-[84%] sm:w-[82%] shrink-0 snap-center aspect-square max-h-[380px] sm:max-h-[420px] bg-[#FAF8F5] border rounded-2xl overflow-hidden shadow-xs group transition-all duration-300 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#110D09] ring-2 ring-[#110D09]/90 shadow-md'
                      : 'border-[#E8DFD3] opacity-80 hover:opacity-100 hover:border-[#8C6D42]'
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 85vw, 500px"
                    className="object-cover transition-transform duration-500 group-hover:scale-104"
                    priority={idx === 0}
                  />

                  {/* Angle Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-[#E8DFD3] px-2.5 py-0.5 text-[10px] tracking-widest uppercase text-[#110D09] font-mono font-bold rounded-full shadow-2xs">
                    0{idx + 1}
                  </div>

                  {/* Minimal Caption Strip */}
                  <div className="absolute bottom-2.5 inset-x-3 bg-black/65 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white text-[11px] font-sans flex items-center justify-between">
                    <span className="font-medium truncate">{img.caption}</span>
                    <span className="text-[9px] font-mono text-[#FAF7F2]/75 uppercase tracking-wider shrink-0 ml-2">
                      Angle 0{idx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Synchronized Angle Selector Pills */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {images.map((img, idx) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => scrollToImage(idx)}
                  className={`group relative py-2 px-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'bg-[#110D09] text-white border-[#110D09] shadow-xs'
                      : 'bg-[#FAF8F5] text-[#554D45] border-[#E8DFD3] hover:border-[#8C6D42] hover:bg-white'
                  }`}
                  aria-label={`Jump to angle 0${idx + 1}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        activeImageIndex === idx ? 'text-[#FAF7F2]' : 'text-[#8C6D42]'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activeImageIndex === idx ? 'bg-[#C5A880]' : 'bg-[#E8DFD3]'
                      }`}
                    />
                  </div>
                  <p className="text-[10px] font-serif font-medium truncate pt-0.5 leading-tight">
                    {img.caption.split(' ')[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT: BESPOKE ATELIER DOSSIER, PYRAMID & ACQUISITION */}
          {/* ============================================================== */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Header: Hierarchy & Title */}
            <div className="space-y-1 pb-2.5 border-b border-[#E8DFD3]">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold">
                  VALCURA • COLLECTION 01
                </span>
                <span className="text-[9px] tracking-wider uppercase px-2 py-0.5 bg-[#FAF8F5] text-[#110D09] border border-[#D5CDC2] font-mono font-bold rounded-sm">
                  50 ML Eau De Parfum
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
                Cacao Citrine
              </h1>

              {/* Fragrance Soul Line */}
              <p className="text-xs sm:text-sm font-serif italic text-[#8C6D42] font-medium pt-0.5">
                &ldquo;Mixture of chocolate and citrus gives you fresh creamy smell.&rdquo;
              </p>
            </div>

            {/* ========================================================== */}
            {/* BESPOKE OLFACTORY ARCHITECTURE (NO PICTURES, NO EQUAL SIGN) */}
            {/* NOTE NAME SIT S DIRECTLY BELOW TOP NOTE / HEART NOTE / BASE NOTE */}
            {/* ========================================================== */}
            <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DFD3] p-4 sm:p-4.5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DFD3]/80">
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold">
                  Olfactory Architecture
                </span>
                <span className="text-[9px] font-mono text-[#554D45]/70 uppercase tracking-widest">
                  Three Pure Tiers
                </span>
              </div>

              {/* 3 Tier Grid: Values positioned cleanly directly below each note header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-0 sm:divide-x sm:divide-[#E8DFD3]">
                
                {/* 1. TOP NOTE */}
                <div className="sm:pr-3.5 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C6D42] font-semibold block">
                    Top Note
                  </span>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#110D09] tracking-wide leading-tight">
                    Citrus
                  </h3>
                  <span className="text-[10px] text-[#554D45] font-light block pt-0.5">
                    Sun-drenched Calabrian Bergamot
                  </span>
                </div>

                {/* 2. HEART NOTE */}
                <div className="sm:px-3.5 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C6D42] font-semibold block">
                    Heart Note
                  </span>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#110D09] tracking-wide leading-tight">
                    Creamy Hazelnut &amp; Vanilla
                  </h3>
                  <span className="text-[10px] text-[#554D45] font-light block pt-0.5">
                    Velvety Roasted Praline Core
                  </span>
                </div>

                {/* 3. BASE NOTE */}
                <div className="sm:pl-3.5 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C6D42] font-semibold block">
                    Base Note
                  </span>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#110D09] tracking-wide leading-tight">
                    Rose + Fresh
                  </h3>
                  <span className="text-[10px] text-[#554D45] font-light block pt-0.5">
                    Clean Air &amp; Sheer Cashmere Musks
                  </span>
                </div>

              </div>
            </div>

            {/* ========================================================== */}
            {/* BOUTIQUE ACQUISITION BAR */}
            {/* ========================================================== */}
            <div className="bg-[#FAF8F5] border border-[#E8DFD3] rounded-2xl p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#110D09]">
                      ₹{totalFull}
                    </span>
                    <span className="text-xs font-mono text-[#888075] line-through">
                      ₹{totalStandard}
                    </span>
                    <span className="text-[10px] tracking-wider uppercase font-mono px-2 py-0.5 bg-[#EFE9DF] text-[#6E532F] border border-[#D5CDC2] rounded-sm font-semibold">
                      Save ₹{totalStandard - totalFull}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8C6D42] font-mono block mt-0.5">
                    All Taxes Included • Complimentary Pan-India Delivery
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 bg-[#110D09] text-white rounded-md font-bold">
                  In Stock
                </span>
              </div>

              {/* Quantity Selector & Action Button */}
              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center border border-[#D5CDC2] bg-white rounded-xl overflow-hidden shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-11 text-sm hover:text-[#8C6D42] hover:bg-[#FAF8F5] transition-colors font-mono font-bold"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono text-sm text-[#110D09] font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-11 text-sm hover:text-[#8C6D42] hover:bg-[#FAF8F5] transition-colors font-mono font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-11 bg-[#110D09] hover:bg-[#8C6D42] text-[#FAF7F2] text-xs font-serif font-bold tracking-[0.2em] uppercase flex items-center justify-center space-x-2 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-[#C5A880]/30"
                >
                  <span>Acquire Bottle • ₹{totalFull}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Trust Reassurances */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E8DFD3] text-[10px] font-mono text-[#554D45]">
                <span className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#8C6D42]" />
                  <span>Pan-India Air Express (2-4 Days)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D42]" />
                  <span>Tamper-Evident Atelier Packaging</span>
                </span>
              </div>
            </div>

            {/* ========================================================== */}
            {/* INTERACTIVE SEGMENTED ATELIER DOSSIER (NOT BORING ACCORDIONS) */}
            {/* ========================================================== */}
            <div className="bg-white border border-[#E8DFD3] rounded-2xl p-4 space-y-3 shadow-2xs">
              {/* Segmented Switcher Header */}
              <div className="grid grid-cols-3 p-1 bg-[#FAF7F2] rounded-xl border border-[#E8DFD3]/80 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setActiveTab('evolution')}
                  className={`py-1.5 px-1 rounded-lg transition-all text-center cursor-pointer ${
                    activeTab === 'evolution'
                      ? 'bg-[#110D09] text-white shadow-xs'
                      : 'text-[#554D45] hover:text-[#110D09]'
                  }`}
                >
                  Evolution
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('moods')}
                  className={`py-1.5 px-1 rounded-lg transition-all text-center cursor-pointer ${
                    activeTab === 'moods'
                      ? 'bg-[#110D09] text-white shadow-xs'
                      : 'text-[#554D45] hover:text-[#110D09]'
                  }`}
                >
                  Atmospheres
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ritual')}
                  className={`py-1.5 px-1 rounded-lg transition-all text-center cursor-pointer ${
                    activeTab === 'ritual'
                      ? 'bg-[#110D09] text-white shadow-xs'
                      : 'text-[#554D45] hover:text-[#110D09]'
                  }`}
                >
                  Vessel &amp; Ritual
                </button>
              </div>

              {/* Tab 1: Skin Evolution Timeline */}
              {activeTab === 'evolution' && (
                <div className="space-y-2 pt-1 animate-fadeIn text-xs">
                  <div className="flex items-start space-x-3 p-2 rounded-lg bg-[#FAF8F5] border border-[#E8DFD3]/60">
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-white border border-[#E8DFD3] rounded text-[#8C6D42] font-bold shrink-0">
                      00–30 Mins
                    </span>
                    <p className="text-[#110D09]/80 leading-relaxed font-light">
                      High-voltage Italian citrus sparkle; crystalline solar opening that immediately lifts the senses.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 p-2 rounded-lg bg-[#FAF8F5] border border-[#E8DFD3]/60">
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-white border border-[#E8DFD3] rounded text-[#8C6D42] font-bold shrink-0">
                      30m–04 Hrs
                    </span>
                    <p className="text-[#110D09]/80 leading-relaxed font-light">
                      Warms into velvety roasted hazelnut praline and smooth cocoa butter, creating a tactile second-skin indulgence.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 p-2 rounded-lg bg-[#FAF8F5] border border-[#E8DFD3]/60">
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-white border border-[#E8DFD3] rounded text-[#8C6D42] font-bold shrink-0">
                      04–12+ Hrs
                    </span>
                    <p className="text-[#110D09]/80 leading-relaxed font-light">
                      Intimate dry-down of dewy damascena rose, crisp mountain air, and magnetic cashmere musks with a 3-foot aura.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Atmospheric Pairings */}
              {activeTab === 'moods' && (
                <div className="space-y-2 pt-1 animate-fadeIn text-xs">
                  <p className="text-[#554D45] font-light">
                    Engineered to harmonize seamlessly with personal occasions and times of day:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
                    {moodLinks.map((m) => (
                      <Link
                        key={m.slug}
                        href={`/moods/${m.slug}`}
                        className="p-2 bg-[#FAF8F5] border border-[#E8DFD3] rounded-lg text-left hover:border-[#8C6D42] transition-colors group"
                      >
                        <span className="text-[9px] font-mono text-[#8C6D42] block uppercase tracking-wider">
                          {m.tag}
                        </span>
                        <span className="text-xs font-serif font-bold text-[#110D09] group-hover:text-[#8C6D42] transition-colors block">
                          {m.title} →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Vessel Craft & Application Ritual */}
              {activeTab === 'ritual' && (
                <div className="space-y-2 pt-1 animate-fadeIn text-xs text-[#554D45]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 bg-[#FAF8F5] border border-[#E8DFD3]/70 rounded-lg space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C6D42] font-bold block">
                        Concentration &amp; Purity
                      </span>
                      <p className="font-light leading-relaxed">
                        20% Extrait-grade Eau de Parfum oil ratio. 100% vegan, cruelty-free, and phthalate-free on clean botanical alcohol.
                      </p>
                    </div>
                    <div className="p-2.5 bg-[#FAF8F5] border border-[#E8DFD3]/70 rounded-lg space-y-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C6D42] font-bold block">
                        Flacon Architecture
                      </span>
                      <p className="font-light leading-relaxed">
                        Weighted Italian crystal glass, precision micro-mist atomization pump, and magnetic obsidian closure.
                      </p>
                    </div>
                  </div>
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#E8DFD3]/70 rounded-lg space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C6D42] font-bold block">
                      Application Ritual
                    </span>
                    <p className="font-light leading-relaxed">
                      Apply 2–3 mists to lateral neck, wrists, and collarbone. Allow to air-dry naturally; never rub wrists to protect the delicate citrus top note esters.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
