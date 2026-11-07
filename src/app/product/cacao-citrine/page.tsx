'use client';

import React, { useState } from 'react';
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
  Clock,
  Layers,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CacaoCitrineProductPage() {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<'feel' | 'mood' | 'specs' | null>(null);

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
    <div className="bg-[#FAF7F2] text-[#110D09] min-h-[calc(100vh-70px)] pb-10">
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
          {/* LEFT: COMPACT PHOTOGRAPHY GALLERY */}
          {/* ============================================================== */}
          <div className="lg:col-span-6 space-y-3">
            {/* Primary Bottle View */}
            <div className="relative aspect-square max-h-[380px] sm:max-h-[420px] w-full bg-[#FAF8F5] border border-[#E8DFD3] rounded-2xl overflow-hidden shadow-xs group">
              <Image
                src={images[activeImageIndex].src}
                alt={images[activeImageIndex].alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
                className="object-cover transition-transform duration-500 group-hover:scale-103"
                priority
              />

              {/* Angle Counter */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-[#E8DFD3] px-2.5 py-0.5 text-[10px] tracking-widest uppercase text-[#110D09] font-mono font-bold rounded-full shadow-2xs">
                0{activeImageIndex + 1} / 0{images.length}
              </div>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)
                }
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8DFD3] text-[#110D09] hover:bg-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 shadow-sm cursor-pointer"
                aria-label="Previous Perspective"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8DFD3] text-[#110D09] hover:bg-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 shadow-sm cursor-pointer"
                aria-label="Next Perspective"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Minimal caption */}
              <div className="absolute bottom-2.5 inset-x-3 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white text-[11px] font-sans flex items-center justify-between">
                <span>{images[activeImageIndex].caption}</span>
                <span className="text-[9px] font-mono text-[#FAF7F2]/75 uppercase tracking-wider">Tap angles below</span>
              </div>
            </div>

            {/* Clean Horizontal Thumbnails Strip */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`group relative aspect-square bg-[#FAF8F5] border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#110D09] ring-2 ring-[#110D09] shadow-xs'
                      : 'border-[#E8DFD3] opacity-65 hover:opacity-100 hover:border-[#8C6D42]'
                  }`}
                  aria-label={`View perspective 0${idx + 1}`}
                >
                  <Image
                    src={img.src}
                    alt={`Angle 0${idx + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/75 text-white font-mono text-[8px] px-1 py-0.2 rounded-xs">
                    0{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT: COMPACT PRODUCT SUMMARY, NOTES & PURCHASE CONTROLS */}
          {/* ============================================================== */}
          <div className="lg:col-span-6 space-y-3.5">
            
            {/* Header: Hierarchy & Title */}
            <div className="space-y-1 pb-2 border-b border-[#E8DFD3]">
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

              {/* Exact Requested Quote Line */}
              <p className="text-xs sm:text-sm font-sans italic text-[#8C6D42] font-medium pt-0.5">
                &ldquo;Mixture of chocolate and citrus gives you fresh creamy smell.&rdquo;
              </p>
            </div>

            {/* ========================================================== */}
            {/* 3 NOTES IN COMPACT POINTER STYLE WITH INGREDIENT IMAGES */}
            {/* ========================================================== */}
            <div className="p-3 bg-white rounded-xl border border-[#E8DFD3] space-y-2.5 shadow-2xs">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C6D42] font-bold block">
                The Olfactory Pyramid:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* 1. Top Note */}
                <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-[#FAF8F5] border border-[#E8DFD3]/70 hover:border-[#8C6D42] transition-colors">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-white">
                    <Image
                      src="/notes/citrus-note.jpg"
                      alt="Citrus"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 font-sans">
                    <span className="text-[10px] font-bold uppercase text-[#8C6D42] block leading-none">
                      • Top Note
                    </span>
                    <span className="text-xs font-semibold text-[#110D09] truncate block mt-1">
                      = Citrus
                    </span>
                  </div>
                </div>

                {/* 2. Heart Note */}
                <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-[#FAF8F5] border border-[#E8DFD3]/70 hover:border-[#8C6D42] transition-colors">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-white">
                    <Image
                      src="/notes/hazelnut-vanilla-note.jpg"
                      alt="Creamy Hazelnut & Vanilla"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 font-sans">
                    <span className="text-[10px] font-bold uppercase text-[#8C6D42] block leading-none">
                      • Heart Note
                    </span>
                    <span className="text-xs font-semibold text-[#110D09] truncate block mt-1">
                      = Creamy Hazel Nut &amp; Vanilla
                    </span>
                  </div>
                </div>

                {/* 3. Base Note */}
                <div className="flex items-center space-x-2.5 p-2 rounded-lg bg-[#FAF8F5] border border-[#E8DFD3]/70 hover:border-[#8C6D42] transition-colors">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-white">
                    <Image
                      src="/notes/rose-fresh-note.jpg"
                      alt="Rose plus Fresh"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 font-sans">
                    <span className="text-[10px] font-bold uppercase text-[#8C6D42] block leading-none">
                      • Base Note
                    </span>
                    <span className="text-xs font-semibold text-[#110D09] truncate block mt-1">
                      = Rose + Fresh
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* COMPACT PRICING & INSTANT PURCHASE */}
            {/* ========================================================== */}
            <div className="bg-[#FAF8F5] border border-[#E8DFD3] rounded-xl p-3.5 sm:p-4 space-y-3 shadow-2xs">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#110D09]">
                      ₹{totalFull}
                    </span>
                    <span className="text-xs font-mono text-[#888075] line-through">
                      ₹{totalStandard}
                    </span>
                    <span className="text-[10px] tracking-wider uppercase font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm font-semibold">
                      Save ₹{totalStandard - totalFull}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8C6D42] font-mono block mt-0.5">
                    Taxes Included • Complimentary Pan-India Delivery
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-[#110D09] text-white rounded-sm font-bold">
                  In Stock
                </span>
              </div>

              {/* Quantity Selector & Action Button */}
              <div className="flex items-center gap-2.5">
                <div className="inline-flex items-center border border-[#D5CDC2] bg-white rounded-lg overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-10 text-sm hover:text-[#8C6D42] transition-colors font-mono font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono text-sm text-[#110D09] font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-10 text-sm hover:text-[#8C6D42] transition-colors font-mono font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 btn-luxury-primary py-3 px-4 text-xs font-semibold tracking-luxury uppercase flex items-center justify-center space-x-2 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <span>Add to Bag • ₹{totalFull}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Trust Reassurances */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E8DFD3] text-[10px] font-mono text-[#554D45]">
                <span className="flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-[#8C6D42]" />
                  <span>Pan-India Air Express</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D42]" />
                  <span>100% Authentic Formulation</span>
                </span>
              </div>
            </div>

            {/* ========================================================== */}
            {/* LOW-PROFILE COMPACT ACCORDION (OPTIONAL DISCOVERY) */}
            {/* ========================================================== */}
            <div className="divide-y divide-[#E8DFD3] border-y border-[#E8DFD3] text-xs">
              {/* Accordion 1: Sensory Aura */}
              <div>
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'feel' ? null : 'feel')}
                  className="w-full py-2.5 flex items-center justify-between text-left font-serif font-bold uppercase tracking-wider text-[#110D09] hover:text-[#8C6D42] transition-colors cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#8C6D42]" />
                    <span>Sensory Aura &amp; Evolution</span>
                  </span>
                  <span className="font-mono text-sm text-[#8C6D42]">
                    {activeAccordion === 'feel' ? '−' : '+'}
                  </span>
                </button>
                {activeAccordion === 'feel' && (
                  <div className="pb-3 text-xs text-[#554D45] font-light leading-relaxed animate-fadeIn space-y-1">
                    <p>
                      Cacao Citrine opens with radiant Italian citrus zest that effortlessly melts into an intimate, creamy heart of roasted hazelnut and cocoa butter, settling into a comfortable 10–12 hour second-skin sillage.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Atmospheric Pairings */}
              <div>
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'mood' ? null : 'mood')}
                  className="w-full py-2.5 flex items-center justify-between text-left font-serif font-bold uppercase tracking-wider text-[#110D09] hover:text-[#8C6D42] transition-colors cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Droplets className="w-3.5 h-3.5 text-[#8C6D42]" />
                    <span>Atmospheric Mood Pairings</span>
                  </span>
                  <span className="font-mono text-sm text-[#8C6D42]">
                    {activeAccordion === 'mood' ? '−' : '+'}
                  </span>
                </button>
                {activeAccordion === 'mood' && (
                  <div className="pb-3 text-xs text-[#554D45] animate-fadeIn space-y-2">
                    <p className="font-light">Engineered for intimate morning rituals and alluring late-evening occasions:</p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {moodLinks.map((m) => (
                        <Link
                          key={m.slug}
                          href={`/moods/${m.slug}`}
                          className="px-2.5 py-1 bg-white border border-[#E8DFD3] rounded-md text-[10px] font-mono text-[#110D09] hover:border-[#8C6D42] hover:text-[#8C6D42] transition-colors flex items-center space-x-1"
                        >
                          <span>{m.title}</span>
                          <span className="text-[#8C6D42] font-semibold">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Specifications & Ritual */}
              <div>
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === 'specs' ? null : 'specs')}
                  className="w-full py-2.5 flex items-center justify-between text-left font-serif font-bold uppercase tracking-wider text-[#110D09] hover:text-[#8C6D42] transition-colors cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <Layers className="w-3.5 h-3.5 text-[#8C6D42]" />
                    <span>Flacon Engineering &amp; Application Ritual</span>
                  </span>
                  <span className="font-mono text-sm text-[#8C6D42]">
                    {activeAccordion === 'specs' ? '−' : '+'}
                  </span>
                </button>
                {activeAccordion === 'specs' && (
                  <div className="pb-3 text-xs text-[#554D45] font-light leading-relaxed animate-fadeIn space-y-1.5">
                    <p>
                      • <strong>Concentration:</strong> 20% Eau de Parfum (Extrait-grade oil ratio, IFRA certified clean).
                    </p>
                    <p>
                      • <strong>Flacon Vessel:</strong> 50 ML weighted crystal bottle with micro-mist atomization and obsidian magnetic cap.
                    </p>
                    <p>
                      • <strong>Application Ritual:</strong> Mist 2–3 pumps across lateral pulse points (wrists, lateral neck, collarbone). Allow to air-dry without rubbing.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
