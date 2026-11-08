'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Check,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CacaoCitrineProductPage() {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'notes' | 'experience' | 'details' | 'all'>('notes');
  
  // Instagram mood state
  const [activeMoodIndex, setActiveMoodIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

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

  const moodSlides = [
    {
      slug: 'coffee-date',
      title: 'The Coffee Date',
      image: '/moods/coffee-date.jpg',
      tag: 'Morning Ritual • 10:00 AM',
      handle: 'the.coffee.date',
      desc: 'An unhurried café table, warm espresso aroma, and effortless conversation wrapped in sunlit citrus.',
    },
    {
      slug: 'after-hours',
      title: 'After Hours',
      image: '/moods/after-hours.jpg',
      tag: 'Twilight & Evening • 8:00 PM',
      handle: 'after.hours.intimate',
      desc: 'Low-lit dining, chocolate dessert, and magnetic roasted cacao deepening on warm evening skin.',
    },
    {
      slug: 'little-indulgence',
      title: 'A Little Indulgence',
      image: '/moods/little-indulgence.jpg',
      tag: 'Afternoon Leisure • 3:30 PM',
      handle: 'little.indulgence.ritual',
      desc: 'Hazelnut pastries and cocoa-dusted treats. A tactile reminder to savor the finer moments.',
    },
    {
      slug: 'slow-moments',
      title: 'Slow Moments',
      image: '/moods/slow-moments.jpg',
      tag: 'Quiet Solitude • 7:00 AM',
      handle: 'slow.moments.peace',
      desc: 'Linen sheets, morning sunlight pouring across hardwood, and soft skin carrying the intimate dry-down of cashmere musk.',
    },
    {
      slug: 'light-up',
      title: 'Light Up',
      image: '/moods/light-up.jpg',
      tag: 'Night Atmosphere • 11:30 PM',
      handle: 'light.up.midnight',
      desc: 'Match strikes, amber glow, and deep woods intertwining with creamy vanilla to ignite the night.',
    },
  ];

  // Pricing constants per unit
  const standardPrice = 599;
  const fullPrice = 399;

  // Multi-quantity calculations
  const totalStandard = standardPrice * quantity;
  const totalFull = fullPrice * quantity;

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevMood = () => {
    setActiveMoodIndex((prev) => (prev - 1 + moodSlides.length) % moodSlides.length);
  };

  const handleNextMood = () => {
    setActiveMoodIndex((prev) => (prev + 1) % moodSlides.length);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `VALCURA • ${moodSlides[activeMoodIndex].title}`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#110D09] min-h-[calc(100vh-70px)] pb-16">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* ============================================================== */}
          {/* LEFT: VERTICAL ROW GALLERY (VERTICAL THUMBNAILS ON LEFT + MAIN PHOTO) */}
          {/* ============================================================== */}
          <div className="lg:col-span-6">
            <div className="flex flex-row items-start gap-2.5 sm:gap-3.5">
              
              {/* Vertical Left-Side Thumbnails Row */}
              <div className="w-16 sm:w-20 md:w-22 flex flex-col gap-2 sm:gap-2.5 shrink-0">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C6D42] text-center block pb-0.5 font-bold">
                  Angles
                </span>
                {images.map((img, idx) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`group relative aspect-square bg-[#FAF8F5] border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#110D09] ring-2 ring-[#110D09] shadow-sm scale-[1.02]'
                        : 'border-[#E8DFD3] opacity-70 hover:opacity-100 hover:border-[#8C6D42]'
                    }`}
                    aria-label={`Switch to perspective 0${idx + 1}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="90px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/75 text-white font-mono text-[8px] sm:text-[9px] px-1 py-0.2 rounded-xs">
                      0{idx + 1}
                    </span>
                  </button>
                ))}
              </div>

              {/* Main Product Image (To the right of the vertical thumbnails row) */}
              <div className="relative flex-1 aspect-square max-h-[440px] sm:max-h-[470px] bg-[#FAF8F5] border border-[#E8DFD3] rounded-2xl overflow-hidden shadow-xs group">
                <Image
                  src={images[activeImageIndex].src}
                  alt={images[activeImageIndex].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 550px"
                  className="object-cover transition-transform duration-500 group-hover:scale-102"
                  priority
                />

                {/* Angle Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-[#E8DFD3] px-2.5 py-0.5 text-[10px] tracking-widest uppercase text-[#110D09] font-mono font-bold rounded-full shadow-2xs">
                  0{activeImageIndex + 1} / 0{images.length}
                </div>

                {/* Navigation Arrows */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8DFD3] text-[#110D09] hover:bg-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 shadow-sm cursor-pointer"
                  aria-label="Previous Perspective"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8DFD3] text-[#110D09] hover:bg-white flex items-center justify-center transition-all opacity-85 hover:opacity-100 shadow-sm cursor-pointer"
                  aria-label="Next Perspective"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Minimal Caption Strip */}
                <div className="absolute bottom-2.5 inset-x-3 bg-black/65 backdrop-blur-xs px-3 py-1.5 rounded-lg text-white text-[11px] font-sans flex items-center justify-between">
                  <span className="font-medium truncate">{images[activeImageIndex].caption}</span>
                  <span className="text-[9px] font-mono text-[#FAF7F2]/75 uppercase tracking-wider shrink-0 ml-2">
                    Angle 0{activeImageIndex + 1}
                  </span>
                </div>
              </div>

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
                  VALCURA
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
            </div>

            {/* Quick Specs Pills */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-[10px] font-mono text-[#554D45]">
              <div className="p-2 bg-white border border-[#E8DFD3] rounded-xl">
                <span className="text-[#8C6D42] font-bold block">20% EDP</span>
                <span className="text-[9px] text-[#888075]">Extrait Ratio</span>
              </div>
              <div className="p-2 bg-white border border-[#E8DFD3] rounded-xl">
                <span className="text-[#8C6D42] font-bold block">4 HOURS</span>
                <span className="text-[9px] text-[#888075]">Projection Time</span>
              </div>
              <div className="p-2 bg-white border border-[#E8DFD3] rounded-xl">
                <span className="text-[#8C6D42] font-bold block">4-5 HOURS</span>
                <span className="text-[9px] text-[#888075]">Skin Longevity</span>
              </div>
            </div>

          </div>

        </div>

        {/* ============================================================== */}
        {/* 3 CORE PILLARS BELOW THE IMAGE: NOTES, EXPERIENCE & DETAILS */}
        {/* ============================================================== */}
        <section className="mt-10 sm:mt-12 pt-8 border-t border-[#E8DFD3] space-y-6">
          {/* Clean 3-Tab Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8DFD3]">
            <div className="inline-flex items-center p-1 bg-[#FAF6EE] rounded-xl border border-[#E8DFD3] text-xs font-mono font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`px-3.5 sm:px-5 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-[#110D09] text-white shadow-xs'
                    : 'text-[#554D45] hover:text-[#110D09]'
                }`}
              >
                01 The Notes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('experience')}
                className={`px-3.5 sm:px-5 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'experience'
                    ? 'bg-[#110D09] text-white shadow-xs'
                    : 'text-[#554D45] hover:text-[#110D09]'
                }`}
              >
                02 Experience
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`px-3.5 sm:px-5 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'details'
                    ? 'bg-[#110D09] text-white shadow-xs'
                    : 'text-[#554D45] hover:text-[#110D09]'
                }`}
              >
                03 Details
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'all' ? 'notes' : 'all')}
              className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D42] hover:text-[#110D09] underline hidden sm:inline cursor-pointer"
            >
              {activeTab === 'all' ? 'Show Selected Tab' : 'View All 3 Sections'}
            </button>
          </div>

          {/* 1. THE NOTES: ONLY 3 LINES IN ORDER, NOTHING ELSE */}
          {(activeTab === 'notes' || activeTab === 'all') && (
            <div className="bg-white border border-[#E8DFD3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 animate-fadeIn">
              <div className="border-b border-[#E8DFD3] pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold block">
                    Olfactory Structure
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
                    The Notes
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#8C6D42] uppercase tracking-wider bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[#E8DFD3] font-semibold">
                  3 Notes In Order
                </span>
              </div>

              {/* Exact 3 Lines in Order: Top Note, Heart Note, Base Note */}
              <div className="py-2 space-y-3 font-serif text-base sm:text-lg">
                <div className="flex items-baseline space-x-3 py-2 border-b border-[#FAF6EE]">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8C6D42] font-bold w-32 shrink-0">
                    Top Note:
                  </span>
                  <span className="font-bold text-[#110D09]">Citrus</span>
                </div>
                <div className="flex items-baseline space-x-3 py-2 border-b border-[#FAF6EE]">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8C6D42] font-bold w-32 shrink-0">
                    Heart Note:
                  </span>
                  <span className="font-bold text-[#110D09]">Creamy Hazelnut &amp; Vanilla</span>
                </div>
                <div className="flex items-baseline space-x-3 py-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8C6D42] font-bold w-32 shrink-0">
                    Base Note:
                  </span>
                  <span className="font-bold text-[#110D09]">Rose + Fresh</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. EXPERIENCE: ALL LINKED IMAGES IN INSTAGRAM POST STYLE */}
          {(activeTab === 'experience' || activeTab === 'all') && (
            <div className="bg-[#FFFDF9] border border-[#E8DFD3] rounded-3xl p-5 sm:p-7 shadow-xs space-y-6 animate-fadeIn">
              <div className="border-b border-[#E8DFD3] pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold block">
                    Visual Atmosphere
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
                    Experience
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#8C6D42] uppercase tracking-wider bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[#E8DFD3] font-semibold">
                  Instagram Post Style
                </span>
              </div>

              {/* Instagram Post Showcase Stage */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#FAF6EE] p-4 sm:p-6 rounded-2xl border border-[#E8DFD3]">
                {/* Left Column: Authentic Instagram Post Card */}
                <div className="lg:col-span-5 max-w-sm mx-auto w-full">
                  <div className="bg-white border-2 border-[#110D09] rounded-2xl overflow-hidden shadow-lg">
                    {/* Instagram Header with Verified Badge and Stepper */}
                    <div className="p-3 border-b border-[#E8DFD3] flex items-center justify-between bg-[#FAF6EE]">
                      <div className="flex items-center space-x-2.5">
                        <div className="relative w-7 h-7 rounded-full border border-[#8C6D42] overflow-hidden bg-[#110D09] p-0.5 shrink-0">
                          <Image
                            src="/brand/valcura-emblem-dark.png"
                            alt="VALCURA Emblem"
                            fill
                            className="object-contain p-0.5 invert"
                          />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs font-mono font-bold text-[#110D09]">valcura.atelier</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D42] text-white flex items-center justify-center text-[7px] font-bold">✓</span>
                          </div>
                          <span className="text-[9px] font-mono text-[#8C6D42] block">
                            {moodSlides[activeMoodIndex].tag}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#110D09]/70 mr-0.5">
                          0{activeMoodIndex + 1} / 0{moodSlides.length}
                        </span>
                        <button
                          type="button"
                          onClick={handlePrevMood}
                          className="w-6 h-6 rounded-full bg-white border border-[#110D09]/40 hover:bg-[#110D09] hover:text-[#FAF7F2] text-[#110D09] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                          aria-label="Previous mood slide"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextMood}
                          className="w-6 h-6 rounded-full bg-white border border-[#110D09]/40 hover:bg-[#110D09] hover:text-[#FAF7F2] text-[#110D09] flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                          aria-label="Next mood slide"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Instagram Square Post Image with Hover Arrows */}
                    <div className="relative aspect-square w-full bg-[#110D09] overflow-hidden group">
                      <Image
                        key={moodSlides[activeMoodIndex].slug}
                        src={moodSlides[activeMoodIndex].image}
                        alt={moodSlides[activeMoodIndex].title}
                        fill
                        className="object-cover transition-opacity duration-500 animate-fadeIn"
                        priority
                      />

                      <button
                        type="button"
                        onClick={handlePrevMood}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMood}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center space-x-1.5">
                        {moodSlides.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveMoodIndex(idx)}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              activeMoodIndex === idx ? 'w-4 bg-white shadow-md' : 'w-1.5 bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Jump to slide 0${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Instagram Actions Bar (Heart, Comment, Share, Bookmark) */}
                    <div className="p-3 bg-white flex items-center justify-between text-[#110D09] border-t border-[#E8DFD3]">
                      <div className="flex items-center space-x-3.5">
                        <button
                          type="button"
                          onClick={() => setIsLiked(!isLiked)}
                          className={`transition-colors cursor-pointer ${isLiked ? 'text-rose-600' : 'hover:text-[#8C6D42]'}`}
                          aria-label="Like post"
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                        </button>
                        <Link href={`/moods/${moodSlides[activeMoodIndex].slug}`} aria-label="Comment on mood">
                          <MessageCircle className="w-4 h-4 hover:text-[#8C6D42] transition-colors" />
                        </Link>
                        <button
                          type="button"
                          onClick={handleShare}
                          aria-label="Share post"
                          className="cursor-pointer"
                        >
                          <Share2 className="w-4 h-4 hover:text-[#8C6D42] transition-colors" />
                        </button>
                        {shareFeedback && (
                          <span className="text-[10px] font-mono text-emerald-600 font-bold animate-fadeIn">
                            Copied!
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsSaved(!isSaved)}
                          className={`transition-colors cursor-pointer ${isSaved ? 'text-[#8C6D42]' : 'hover:text-[#8C6D42]'}`}
                          aria-label="Bookmark post"
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#8C6D42]' : ''}`} />
                        </button>
                        <span className="text-[10px] font-mono text-[#8C6D42] font-semibold">
                          @{moodSlides[activeMoodIndex].handle}
                        </span>
                      </div>
                    </div>

                    {/* Instagram Post Likes & Caption */}
                    <div className="px-3 pb-3 pt-1 bg-white space-y-1 text-xs text-[#110D09] border-t border-[#FAF6EE]">
                      <div className="font-bold text-[11px] font-mono text-[#110D09]">
                        {isLiked ? '1,429 likes' : '1,428 likes'}
                      </div>
                      <p className="leading-snug">
                        <span className="font-bold mr-1.5 font-mono text-[11px]">valcura.atelier</span>
                        <span className="font-serif italic font-medium">{moodSlides[activeMoodIndex].title}</span>
                        {' — '}
                        <span className="text-[#554D45] font-light">{moodSlides[activeMoodIndex].desc}</span>
                      </p>
                      <div className="pt-0.5 text-[10px] font-mono text-[#8C6D42] space-x-1.5">
                        <span>#valcura</span>
                        <span>#cacaocitrine</span>
                        <span>#experience</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Narrative & All 5 Linked Images in Grid */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C6D42] font-bold">
                      Atmosphere 0{activeMoodIndex + 1} of 0{moodSlides.length}
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
                      {moodSlides[activeMoodIndex].title}
                    </h4>
                    <p className="text-sm font-serif italic text-[#110D09]/85 leading-relaxed">
                      &ldquo;{moodSlides[activeMoodIndex].desc}&rdquo;
                    </p>
                  </div>

                  {/* All 5 Linked Images (Clickable Instagram Post Switchers) */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#554D45] font-bold block">
                      All Linked Atmosphere Images:
                    </span>
                    <div className="grid grid-cols-5 gap-2.5">
                      {moodSlides.map((m, idx) => (
                        <button
                          key={m.slug}
                          type="button"
                          onClick={() => setActiveMoodIndex(idx)}
                          className={`relative aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer group ${
                            activeMoodIndex === idx
                              ? 'border-[#110D09] ring-2 ring-[#8C6D42] shadow-md scale-105'
                              : 'border-[#E8DFD3] opacity-65 hover:opacity-100'
                          }`}
                          aria-label={`Switch to ${m.title}`}
                        >
                          <Image
                            src={m.image}
                            alt={m.title}
                            fill
                            sizes="90px"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/75 text-white font-mono text-[7px] px-1 rounded-xs">
                            0{idx + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/moods/${moodSlides[activeMoodIndex].slug}`}
                      className="inline-flex items-center space-x-2 bg-[#110D09] hover:bg-[#8C6D42] text-white py-3 px-5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <span>Explore {moodSlides[activeMoodIndex].title} Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. DETAILS: EXACTLY 5 ONE-LINE POINTED BULLETS ABOUT THE FRAGRANCE */}
          {(activeTab === 'details' || activeTab === 'all') && (
            <div className="bg-white border border-[#E8DFD3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 animate-fadeIn">
              <div className="border-b border-[#E8DFD3] pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold block">
                    Product Dossier
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
                    Details
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#8C6D42] uppercase tracking-wider bg-[#FAF6EE] px-2.5 py-1 rounded-md border border-[#E8DFD3] font-semibold">
                  Key Specifications
                </span>
              </div>

              {/* Exact Pointed Bullets About Fragrance */}
              <ul className="space-y-3.5 text-xs sm:text-sm font-sans text-[#110D09] leading-relaxed pt-1">
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-[#8C6D42] shrink-0" />
                  <span><strong>50 ML Extrait de Parfum</strong> formulated with a concentrated 20% pure oil ratio.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-[#8C6D42] shrink-0" />
                  <span><strong>4 Hours active projection</strong> radiating a distinctive, arm&apos;s-length fragrance aura.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-[#8C6D42] shrink-0" />
                  <span><strong>4 to 5 Hours skin longevity</strong> settling into an intimate, warm chocolate-musk dry-down.</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-[#8C6D42] shrink-0" />
                  <span><strong>Unisex composition</strong> harmonizing sparkling Italian citrus with velvety roasted hazelnut &amp; vanilla.</span>
                </li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
