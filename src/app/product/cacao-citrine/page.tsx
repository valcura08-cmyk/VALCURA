'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle2,
  Droplets,
  Layers,
  Star,
  X,
  Plus,
  Minus,
  Clock,
  Compass,
  Feather,
  Sun,
  Flame,
  BookOpen,
  Info,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CacaoCitrineProductPage() {
  const { addToCart } = useCart();
  const [selectedPlan, setSelectedPlan] = useState<'full' | 'deposit'>('full');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // Dossier chapters are closed by default (null). Opens when clicked.
  const [openSection, setOpenSection] = useState<'notes' | 'feel' | 'experience' | 'details' | null>(null);

  // Instagram-style mood carousel in Experience section
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
      tag: 'Quiet Weekend • 4:00 PM',
      handle: 'slow.moments.calm',
      desc: 'Soft linen, cocooning cashmere silk, and intimate second-skin tranquility.',
    },
    {
      slug: 'light-up',
      title: 'Light Up',
      image: '/moods/light-up.jpg',
      tag: 'Midnight Flame • 11:30 PM',
      handle: 'light.up.velvet',
      desc: 'A flick of flame illuminating glossy lips, smoky allure, and magnetic late-night warmth.',
    },
  ];

  const [moodSlideIndex, setMoodSlideIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Auto-change mood slide every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setMoodSlideIndex((prev) => (prev + 1) % moodSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [moodSlides.length]);

  const prevMoodSlide = () => {
    setMoodSlideIndex((prev) => (prev - 1 + moodSlides.length) % moodSlides.length);
  };

  const nextMoodSlide = () => {
    setMoodSlideIndex((prev) => (prev + 1) % moodSlides.length);
  };

  const images = [
    {
      src: '/products/cacao-citrine-1.jpg',
      caption: 'Stone & Cocoa Still Life',
      sub: 'Angle 01 • Architectural angled flacon against natural sandstone',
    },
    {
      src: '/products/cacao-citrine-2.jpg',
      caption: 'Travertine & Hazelnut',
      sub: 'Angle 02 • Centered studio portrait with hazelnut and chocolate pyramid',
    },
    {
      src: '/products/cacao-citrine-3.jpg',
      caption: 'Champagne Silk Satin',
      sub: 'Angle 03 • Sensory lay-flat flacon draped in liquid silk',
    },
    {
      src: '/products/cacao-citrine-4.jpg',
      caption: 'Pedestal Atmosphere',
      sub: 'Angle 04 • Direct flacon perspective on polished stone plinth',
    },
  ];

  // Pricing constants per unit
  const standardPrice = 599;
  const fullPrice = 499;
  const reserveTotal = 449;
  const depositToday = 314;
  const balanceRemaining = 135;

  // Multi-quantity calculations
  const totalStandard = standardPrice * quantity;
  const totalFull = fullPrice * quantity;
  const totalReservePlan = reserveTotal * quantity;
  const totalDepositToday = depositToday * quantity;
  const totalBalanceRemaining = balanceRemaining * quantity;

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
        paymentPlan: selectedPlan,
      },
      selectedPlan
    );
  };

  return (
    <div className="bg-[#FAF7F2] text-[#18120E] min-h-screen pb-16">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 text-xs text-[#554D45] font-light flex items-center space-x-2 border-b border-[#E8E2D8]/60">
        <Link href="/" className="hover:text-[#8C6D42] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/collections/cacao" className="hover:text-[#8C6D42] transition-colors">
          Cacao Collection
        </Link>
        <span>/</span>
        <span className="text-[#110D09] font-medium">Cacao Citrine</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Two-Column Grid: Left Photography, Right Product Information & Add to Bag */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT SIDE: VERTICAL ANGLE SWITCHER (LEFT) + LARGE PHOTOGRAPHY (RIGHT) */}
          <div className="lg:col-span-6 order-1 space-y-2">
            
            {/* Horizontal Flex: Left = Vertical Angle Thumbnails, Right = Large Primary Photo */}
            <div className="flex flex-row items-start gap-2.5 sm:gap-3.5">
              
              {/* VERTICAL LEFT-SIDE ANGLE SWITCHER */}
              <div className="w-16 sm:w-20 md:w-24 flex flex-col gap-2 sm:gap-2.5 flex-shrink-0">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C6D42] text-center block pb-0.5">
                  Angles
                </span>
                {images.map((img, idx) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`group relative aspect-[4/5] bg-[#F8F5F0] border overflow-hidden rounded-lg transition-all duration-300 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#110D09] ring-2 ring-[#110D09] shadow-md scale-[1.02]'
                        : 'border-[#E8E2D8] opacity-70 hover:opacity-100 hover:border-[#8C6D42]'
                    }`}
                    aria-label={`Switch to angle 0${idx + 1}`}
                  >
                    <Image
                      src={img.src}
                      alt={`Thumbnail 0${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/75 text-white font-mono text-[8px] sm:text-[9px] px-1 py-0.5 rounded-sm">
                      0{idx + 1}
                    </span>
                  </button>
                ))}
              </div>

              {/* Main Compact Product Image (On Right of Thumbnails) */}
              <div className="relative flex-1 aspect-square max-h-[440px] bg-[#F8F5F0] border border-[#E8E2D8] rounded-2xl overflow-hidden shadow-sm group">
                <Image
                  src={images[activeImageIndex].src}
                  alt={`VALCURA Cacao Citrine - ${images[activeImageIndex].caption}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />

                {/* View Counter Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-[#E8E2D8] px-2.5 py-1 text-[10px] tracking-widest uppercase text-[#110D09] font-mono font-medium rounded-full shadow-sm">
                  0{activeImageIndex + 1} / 0{images.length}
                </div>

                {/* Official Bottle Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-[#E8E2D8] px-3 py-1 text-[10px] tracking-luxury uppercase text-[#110D09] font-mono font-medium rounded-full shadow-sm">
                  Official Bottle
                </div>

                {/* Navigation Arrows */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8E2D8] text-[#110D09] hover:bg-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 shadow-md cursor-pointer"
                  aria-label="Previous Image Angle"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8E2D8] text-[#110D09] hover:bg-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 shadow-md cursor-pointer"
                  aria-label="Next Image Angle"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 sm:p-5 text-white">
                  <p className="text-xs font-serif tracking-wide">{images[activeImageIndex].caption}</p>
                  <p className="text-[10px] text-white/80 font-light font-mono mt-0.5">
                    {images[activeImageIndex].sub}
                  </p>
                </div>
              </div>

            </div>

            {/* Gallery Guidance Footer */}
            <div className="flex items-center justify-between text-[11px] text-[#554D45] font-light px-1 pt-0.5">
              <span>Select any angle on the left to inspect flacon details</span>
              <span className="font-mono text-[10px] text-[#8C6D42]">4 Editorial Perspectives</span>
            </div>
          </div>

          {/* RIGHT SIDE: PRODUCT INFORMATION, CONTROLS & ADD TO BAG */}
          <div className="lg:col-span-6 order-2 space-y-4">
            
            {/* Header: Hierarchy & Name */}
            <div className="space-y-1.5 pb-3 border-b border-[#E8E2D8]">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold">
                  UNISEX • EAU DE PARFUM • 50 ML
                </span>
                <span className="text-[9px] tracking-wider uppercase px-2 py-0.5 bg-[#FAF8F5] text-[#110D09] border border-[#D5CDC2] font-mono font-bold rounded-sm">
                  Flagship
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide uppercase text-[#110D09]">
                Cacao Citrine
              </h1>

              <p className="text-xs sm:text-sm text-[#554D45] font-light leading-relaxed">
                Vibrant solar citrus freshness softening into the rich tactile comfort of creamy hazelnut and roasted cacao.
              </p>
            </div>

            {/* PRICING & PURCHASE PANEL */}
            <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex items-baseline justify-between border-b border-[#E8E2D8] pb-3">
                <div>
                  <div className="flex items-baseline space-x-2.5">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#110D09]">
                      ₹{fullPrice}
                    </span>
                    <span className="text-sm font-mono text-[#888075] line-through">
                      ₹{standardPrice}
                    </span>
                    <span className="text-[10px] tracking-wider uppercase font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                      Save ₹{standardPrice - fullPrice}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8C6D42] font-mono block mt-1">
                    Inclusive of all taxes • 50 ML Eau de Parfum
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 bg-[#18120E] text-[#FAF7F2] font-medium block rounded-md">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Quantity Selector & Instant Add to Bag */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-luxury uppercase text-[#554D45] font-mono">
                    Select Quantity:
                  </span>
                  <div className="inline-flex items-center border border-[#D5CDC2] bg-white rounded-md overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 text-sm hover:text-[#8C6D42] transition-colors font-mono font-bold"
                    >
                      -
                    </button>
                    <span className="w-9 text-center font-mono text-sm text-[#110D09] font-semibold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 text-sm hover:text-[#8C6D42] transition-colors font-mono font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full btn-luxury-primary py-4 text-xs font-semibold tracking-luxury uppercase flex items-center justify-center space-x-2 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <span>Add to Bag • ₹{totalFull}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-[#8C6D42] text-center font-mono pt-1">
                  ✨ Pre-order settlement options (₹399 Full / ₹449 70% Plan) selectable at checkout.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8E2D8] text-[11px] text-[#554D45] font-light">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#8C6D42] flex-shrink-0" />
                  <span>Authentic Atelier Formulation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#8C6D42] flex-shrink-0" />
                  <span>Complimentary Pan-India Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE ATELIER DOSSIER: 4 CHAPTERS (CLOSED BY DEFAULT) */}
        {/* CHAPTER 01: THE NOTES | CHAPTER 02: FEEL IT */}
        {/* CHAPTER 03: THE EXPERIENCE | CHAPTER 04: THE DETAILS */}
        {/* Shows whenever someone clicks it; otherwise neatly collapsed */}
        {/* ============================================================== */}
        <section className="mt-3.5 sm:mt-4 max-w-7xl mx-auto">
          {/* Header Bar with Status Indicator & Collapse Toggle */}
          <div className="flex items-center justify-between pb-2 px-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#8C6D42] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-[#8C6D42] font-bold">
                Atelier Dossier • 4 Olfactory Chapters
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#554D45] font-light">
              {openSection ? 'Click active chapter to close' : 'Tap any chapter to explore'}
            </span>
          </div>

          {/* 4 HORIZONTAL CHAPTER CARDS (CLOSED BY DEFAULT) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {/* CHAPTER 01: THE NOTES */}
            <button
              type="button"
              onClick={() => setOpenSection(openSection === 'notes' ? null : 'notes')}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between shadow-xs cursor-pointer group ${
                openSection === 'notes'
                  ? 'bg-[#110D09] text-[#FAF7F2] border-[#C5A880] ring-1 ring-[#C5A880] shadow-md -translate-y-0.5'
                  : 'bg-[#FAF6EE] hover:bg-white text-[#110D09] border-[#E8DFD3] hover:border-[#8C6D42] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between w-full pb-1.5 border-b border-current/15">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${openSection === 'notes' ? 'text-[#C5A880]' : 'text-[#8C6D42]'}`}>
                  Chapter 01
                </span>
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                  openSection === 'notes' ? 'bg-[#C5A880] text-[#110D09]' : 'bg-[#110D09] text-[#FAF7F2]'
                }`}>
                  {openSection === 'notes' ? '− Close' : '+ Open'}
                </span>
              </div>
              <div className="pt-2">
                <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide">
                  The Notes
                </h3>
                <p className={`text-[11px] font-light leading-snug line-clamp-1 mt-0.5 ${openSection === 'notes' ? 'text-[#FAF7F2]/80' : 'text-[#554D45]'}`}>
                  Citrus, Hazelnut &amp; Vanilla, Rose
                </p>
              </div>
            </button>

            {/* CHAPTER 02: FEEL IT */}
            <button
              type="button"
              onClick={() => setOpenSection(openSection === 'feel' ? null : 'feel')}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between shadow-xs cursor-pointer group ${
                openSection === 'feel'
                  ? 'bg-[#110D09] text-[#FAF7F2] border-[#C5A880] ring-1 ring-[#C5A880] shadow-md -translate-y-0.5'
                  : 'bg-[#FAF6EE] hover:bg-white text-[#110D09] border-[#E8DFD3] hover:border-[#8C6D42] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between w-full pb-1.5 border-b border-current/15">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${openSection === 'feel' ? 'text-[#C5A880]' : 'text-[#8C6D42]'}`}>
                  Chapter 02
                </span>
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                  openSection === 'feel' ? 'bg-[#C5A880] text-[#110D09]' : 'bg-[#110D09] text-[#FAF7F2]'
                }`}>
                  {openSection === 'feel' ? '− Close' : '+ Open'}
                </span>
              </div>
              <div className="pt-2">
                <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide">
                  Feel It
                </h3>
                <p className={`text-[11px] font-light leading-snug line-clamp-1 mt-0.5 ${openSection === 'feel' ? 'text-[#FAF7F2]/80' : 'text-[#554D45]'}`}>
                  Luxury, Fresh & Impressed Aura
                </p>
              </div>
            </button>

            {/* CHAPTER 03: THE EXPERIENCE */}
            <button
              type="button"
              onClick={() => setOpenSection(openSection === 'experience' ? null : 'experience')}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between shadow-xs cursor-pointer group ${
                openSection === 'experience'
                  ? 'bg-[#110D09] text-[#FAF7F2] border-[#C5A880] ring-1 ring-[#C5A880] shadow-md -translate-y-0.5'
                  : 'bg-[#FAF6EE] hover:bg-white text-[#110D09] border-[#E8DFD3] hover:border-[#8C6D42] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between w-full pb-1.5 border-b border-current/15">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${openSection === 'experience' ? 'text-[#C5A880]' : 'text-[#8C6D42]'}`}>
                  Chapter 03
                </span>
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                  openSection === 'experience' ? 'bg-[#C5A880] text-[#110D09]' : 'bg-[#110D09] text-[#FAF7F2]'
                }`}>
                  {openSection === 'experience' ? '− Close' : '+ Open'}
                </span>
              </div>
              <div className="pt-2">
                <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide">
                  The Experience
                </h3>
                <p className={`text-[11px] font-light leading-snug line-clamp-1 mt-0.5 ${openSection === 'experience' ? 'text-[#FAF7F2]/80' : 'text-[#554D45]'}`}>
                  5 Linked Mood Visualizers
                </p>
              </div>
            </button>

            {/* CHAPTER 04: THE DETAILS (NEW SECTION) */}
            <button
              type="button"
              onClick={() => setOpenSection(openSection === 'details' ? null : 'details')}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between shadow-xs cursor-pointer group ${
                openSection === 'details'
                  ? 'bg-[#110D09] text-[#FAF7F2] border-[#C5A880] ring-1 ring-[#C5A880] shadow-md -translate-y-0.5'
                  : 'bg-[#FAF6EE] hover:bg-white text-[#110D09] border-[#E8DFD3] hover:border-[#8C6D42] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between w-full pb-1.5 border-b border-current/15">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${openSection === 'details' ? 'text-[#C5A880]' : 'text-[#8C6D42]'}`}>
                  Chapter 04
                </span>
                <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                  openSection === 'details' ? 'bg-[#C5A880] text-[#110D09]' : 'bg-[#110D09] text-[#FAF7F2]'
                }`}>
                  {openSection === 'details' ? '− Close' : '+ Open'}
                </span>
              </div>
              <div className="pt-2">
                <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide">
                  The Details
                </h3>
                <p className={`text-[11px] font-light leading-snug line-clamp-1 mt-0.5 ${openSection === 'details' ? 'text-[#FAF7F2]/80' : 'text-[#554D45]'}`}>
                  Craft, Formulation & Specs
                </p>
              </div>
            </button>
          </div>

          {/* ============================================================== */}
          {/* EXPANDED DOSSIER STAGE (OPENS WHEN USER CLICKS ANY CHAPTER) */}
          {/* ============================================================== */}
          {openSection && (
            <div className="mt-3.5 bg-[#FFFDF9] border-2 border-[#110D09] rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xl animate-fadeIn relative">
              {/* Top Navigation & Close Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-[#E8DFD3]">
                {/* Active Chapter Label */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold block">
                    {openSection === 'notes' && 'Chapter 01 • Olfactory Pyramid'}
                    {openSection === 'feel' && 'Chapter 02 • Sensory Aura'}
                    {openSection === 'experience' && 'Chapter 03 • Atmospheric Pairing'}
                    {openSection === 'details' && 'Chapter 04 • Technical Dossier & Ritual'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wide text-[#110D09] mt-0.5">
                    {openSection === 'notes' && 'The Notes'}
                    {openSection === 'feel' && 'Feel It'}
                    {openSection === 'experience' && 'The Experience'}
                    {openSection === 'details' && 'The Details'}
                  </h2>
                </div>

                {/* Chapter Quick Switchers & Close Button */}
                <div className="flex items-center flex-wrap gap-2">
                  <div className="inline-flex items-center bg-[#FAF6EE] p-1 rounded-xl border border-[#E8DFD3] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setOpenSection('notes')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        openSection === 'notes' ? 'bg-[#110D09] text-white font-bold shadow-xs' : 'text-[#554D45] hover:text-[#110D09]'
                      }`}
                    >
                      01 Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenSection('feel')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        openSection === 'feel' ? 'bg-[#110D09] text-white font-bold shadow-xs' : 'text-[#554D45] hover:text-[#110D09]'
                      }`}
                    >
                      02 Feel
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenSection('experience')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        openSection === 'experience' ? 'bg-[#110D09] text-white font-bold shadow-xs' : 'text-[#554D45] hover:text-[#110D09]'
                      }`}
                    >
                      03 Experience
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenSection('details')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        openSection === 'details' ? 'bg-[#110D09] text-white font-bold shadow-xs' : 'text-[#554D45] hover:text-[#110D09]'
                      }`}
                    >
                      04 Details
                    </button>
                  </div>

                  {/* Close Pill Button */}
                  <button
                    type="button"
                    onClick={() => setOpenSection(null)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#110D09] hover:bg-[#8C6D42] text-[#FAF7F2] rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close</span>
                  </button>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* CHAPTER 01: THE NOTES CONTENT */}
              {/* -------------------------------------------------------- */}
              {openSection === 'notes' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* 3 LINES IN POINTER STYLE WITH INGREDIENT IMAGES */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Top Note */}
                    <div className="group bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-5 shadow-xs hover:border-[#110D09] hover:shadow-md transition-all duration-300 flex flex-col space-y-3.5">
                      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#FAF7F2]">
                        <Image
                          src="/notes/citrus-note.jpg"
                          alt="Citrus Top Note"
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="flex items-center space-x-2.5 font-sans pt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#110D09] group-hover:bg-[#8C6D42] transition-colors shrink-0" />
                        <span className="px-2.5 py-1 rounded-md bg-[#110D09] text-white text-[11px] font-bold uppercase tracking-wider">
                          Top Note
                        </span>
                        <span className="text-base font-bold text-[#8C6D42]">=</span>
                        <span className="text-sm font-semibold uppercase tracking-wide text-[#110D09]">
                          Citrus
                        </span>
                      </div>
                    </div>

                    {/* Heart Note */}
                    <div className="group bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-5 shadow-xs hover:border-[#110D09] hover:shadow-md transition-all duration-300 flex flex-col space-y-3.5">
                      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#FAF7F2]">
                        <Image
                          src="/notes/hazelnut-vanilla-note.jpg"
                          alt="Creamy Hazelnut and Vanilla Heart Note"
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="flex items-center space-x-2.5 font-sans pt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#110D09] group-hover:bg-[#8C6D42] transition-colors shrink-0" />
                        <span className="px-2.5 py-1 rounded-md bg-[#110D09] text-white text-[11px] font-bold uppercase tracking-wider">
                          Heart Note
                        </span>
                        <span className="text-base font-bold text-[#8C6D42]">=</span>
                        <span className="text-sm font-semibold uppercase tracking-wide text-[#110D09]">
                          Creamy Hazel Nut &amp; Vanilla
                        </span>
                      </div>
                    </div>

                    {/* Base Note */}
                    <div className="group bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-5 shadow-xs hover:border-[#110D09] hover:shadow-md transition-all duration-300 flex flex-col space-y-3.5">
                      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#FAF7F2]">
                        <Image
                          src="/notes/rose-fresh-note.jpg"
                          alt="Rose plus Fresh Base Note"
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="flex items-center space-x-2.5 font-sans pt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#110D09] group-hover:bg-[#8C6D42] transition-colors shrink-0" />
                        <span className="px-2.5 py-1 rounded-md bg-[#110D09] text-white text-[11px] font-bold uppercase tracking-wider">
                          Base Note
                        </span>
                        <span className="text-base font-bold text-[#8C6D42]">=</span>
                        <span className="text-sm font-semibold uppercase tracking-wide text-[#110D09]">
                          Rose + Fresh
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ONLY ONE SIGNATURE LINE */}
                  <div className="p-4 sm:p-5 bg-[#110D09] text-white rounded-2xl shadow-sm text-center">
                    <p className="text-sm sm:text-base font-sans font-medium tracking-wide text-[#FAF7F2]">
                      &ldquo;Mixture of chocolate and citrus gives you fresh creamy smell.&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* CHAPTER 02: FEEL IT CONTENT */}
              {/* -------------------------------------------------------- */}
              {openSection === 'feel' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="max-w-2xl">
                    <p className="text-sm sm:text-base font-serif italic text-[#110D09]/85 font-light leading-relaxed">
                      How Cacao Citrine commands the room. Designed to be intimate yet magnetic, projecting effortless confidence without overwhelming.
                    </p>
                  </div>

                  {/* 1st Thing: Luxury & Fresh (2 lines max) | 2nd Thing: Impressed (2 lines max) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 1st Thing: Luxury and Fresh */}
                    <div className="bg-[#FAF6EE] border-2 border-[#110D09] rounded-2xl p-5 sm:p-6 space-y-3 shadow-sm hover:border-[#8C6D42] transition-colors">
                      <div className="flex items-center justify-between pb-2 border-b border-[#110D09]/15">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                          <h4 className="text-lg sm:text-xl font-serif font-bold uppercase tracking-wider text-[#110D09]">
                            Luxury & Fresh
                          </h4>
                        </div>
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-white border border-[#E8DFD3] rounded-md text-[#8C6D42]">
                          Opening Sensation
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#110D09]/90 font-light leading-relaxed pt-1">
                        An uplifting splash of sunlit citrus blending into rich hazelnut praline.<br />
                        Delivers a clean, effortlessly opulent second-skin aura all day long.
                      </p>
                      <div className="pt-2 flex items-center space-x-2 text-[10px] font-mono text-[#8C6D42] font-semibold">
                        <span>✦ Radiant Solar Spark</span>
                        <span>•</span>
                        <span>✦ Velvet Hazelnut Touch</span>
                      </div>
                    </div>

                    {/* 2nd Thing: Impressed */}
                    <div className="bg-[#FAF6EE] border-2 border-[#110D09] rounded-2xl p-5 sm:p-6 space-y-3 shadow-sm hover:border-[#8C6D42] transition-colors">
                      <div className="flex items-center justify-between pb-2 border-b border-[#110D09]/15">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8C6D42] ring-4 ring-[#8C6D42]/20" />
                          <h4 className="text-lg sm:text-xl font-serif font-bold uppercase tracking-wider text-[#110D09]">
                            Impressed
                          </h4>
                        </div>
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 bg-white border border-[#E8DFD3] rounded-md text-[#8C6D42]">
                          Lasting Resonance
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#110D09]/90 font-light leading-relaxed pt-1">
                        A deeply captivating scent trail that commands silent admiration.<br />
                        Leaves everyone who enters your aura fascinated and thoroughly impressed.
                      </p>
                      <div className="pt-2 flex items-center space-x-2 text-[10px] font-mono text-[#8C6D42] font-semibold">
                        <span>✦ Magnetic Sillage</span>
                        <span>•</span>
                        <span>✦ Quiet Compliments</span>
                      </div>
                    </div>
                  </div>

                  {/* Sensory Touchpoint Pills */}
                  <div className="pt-2 flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D42] font-bold">
                      Aura Touchpoints:
                    </span>
                    {['Clean Gourmand', 'Zero Cloying Sweetness', 'Warm Magnetism', 'Tactile Cashmere Silk', 'All-Day Radiance'].map((pill) => (
                      <span
                        key={pill}
                        className="text-[10px] font-mono uppercase tracking-wider bg-[#FAF6EE] text-[#110D09] px-3 py-1 rounded-full border border-[#E8DFD3] font-medium"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* CHAPTER 03: THE EXPERIENCE CONTENT */}
              {/* -------------------------------------------------------- */}
              {openSection === 'experience' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="max-w-2xl">
                    <p className="text-sm sm:text-base font-serif italic text-[#110D09]/85 font-light leading-relaxed">
                      Five cinematic mood atmospheres calibrated to Cacao Citrine. Experience how each lifestyle chapter connects with our formulation.
                    </p>
                  </div>

                  {/* Two-Column Experience Stage: Left Square Box, Right Mood Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#FAF6EE] p-4 sm:p-6 rounded-2xl border border-[#E8DFD3]">
                    {/* LEFT COLUMN: THE ONE SQUARE BOX DISPLAY WITH ARROWS ABOVE */}
                    <div className="lg:col-span-5 max-w-sm mx-auto w-full">
                      <div className="bg-white border-2 border-[#110D09] rounded-2xl overflow-hidden shadow-md">
                        {/* Instagram Header with Arrows Above Photo */}
                        <div className="p-3 border-b border-[#E8DFD3] flex items-center justify-between bg-[#FAF6EE]">
                          <div className="flex items-center space-x-2">
                            <div className="relative w-7 h-7 rounded-full border border-[#8C6D42] overflow-hidden bg-[#110D09] p-0.5">
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
                                {moodSlides[moodSlideIndex].tag}
                              </span>
                            </div>
                          </div>

                          {/* Arrows Above To Change Like Instagram Post */}
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] font-mono font-bold text-[#110D09]/70 mr-1">
                              0{moodSlideIndex + 1} / 0{moodSlides.length}
                            </span>
                            <button
                              type="button"
                              onClick={prevMoodSlide}
                              className="w-7 h-7 rounded-full bg-white border border-[#110D09]/40 hover:bg-[#110D09] hover:text-[#FAF7F2] text-[#110D09] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                              aria-label="Previous mood slide"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={nextMoodSlide}
                              className="w-7 h-7 rounded-full bg-white border border-[#110D09]/40 hover:bg-[#110D09] hover:text-[#FAF7F2] text-[#110D09] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                              aria-label="Next mood slide"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* THE ONE SQUARE BOX DISPLAY */}
                        <div className="relative aspect-square w-full bg-[#F4ECE1] overflow-hidden group">
                          <Image
                            key={moodSlides[moodSlideIndex].slug}
                            src={moodSlides[moodSlideIndex].image}
                            alt={moodSlides[moodSlideIndex].title}
                            fill
                            className="object-cover transition-opacity duration-700 animate-fadeIn"
                            priority
                          />

                          {/* Direct Click Zones for Instagram Tap */}
                          <button
                            type="button"
                            onClick={prevMoodSlide}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                            aria-label="Previous"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={nextMoodSlide}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer"
                            aria-label="Next"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          {/* Dots */}
                          <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center space-x-1.5">
                            {moodSlides.map((_, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setMoodSlideIndex(idx)}
                                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                  moodSlideIndex === idx ? 'w-4 bg-white shadow-md' : 'w-1.5 bg-white/50 hover:bg-white/80'
                                }`}
                                aria-label={`Jump to slide 0${idx + 1}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Instagram Actions Bar */}
                        <div className="p-3 bg-white flex items-center justify-between text-[#110D09] border-t border-[#E8DFD3]">
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => setIsLiked(!isLiked)}
                              className={`transition-colors cursor-pointer ${isLiked ? 'text-rose-600' : 'hover:text-[#8C6D42]'}`}
                              aria-label="Like post"
                            >
                              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                            </button>
                            <Link href={`/moods/${moodSlides[moodSlideIndex].slug}`} aria-label="Comment">
                              <MessageCircle className="w-4 h-4 hover:text-[#8C6D42] transition-colors" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                if (typeof navigator !== 'undefined' && navigator.share) {
                                  navigator.share({
                                    title: `VALCURA • ${moodSlides[moodSlideIndex].title}`,
                                    url: window.location.href,
                                  });
                                }
                              }}
                              aria-label="Share"
                              className="cursor-pointer"
                            >
                              <Share2 className="w-4 h-4 hover:text-[#8C6D42] transition-colors" />
                            </button>
                          </div>
                          <span className="text-[10px] font-mono text-[#8C6D42] font-semibold">
                            {moodSlides[moodSlideIndex].handle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: CURRENT MOOD NARRATIVE & SELECTOR */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C6D42] font-bold">
                          Atmosphere 0{moodSlideIndex + 1} of 0{moodSlides.length}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
                          {moodSlides[moodSlideIndex].title}
                        </h3>
                        <p className="text-sm font-serif italic text-[#110D09]/80 leading-relaxed">
                          &ldquo;{moodSlides[moodSlideIndex].desc}&rdquo;
                        </p>
                      </div>

                      {/* 5 Clickable Mood Thumbnails */}
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#554D45] font-bold block">
                          Switch Atmosphere:
                        </span>
                        <div className="grid grid-cols-5 gap-2">
                          {moodSlides.map((m, idx) => (
                            <button
                              key={m.slug}
                              type="button"
                              onClick={() => setMoodSlideIndex(idx)}
                              className={`relative aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer ${
                                moodSlideIndex === idx
                                  ? 'border-[#110D09] ring-2 ring-[#8C6D42] shadow-md scale-105'
                                  : 'border-[#E8DFD3] opacity-60 hover:opacity-100'
                              }`}
                            >
                              <Image
                                src={m.image}
                                alt={m.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/25 flex items-end p-1">
                                <span className="text-[8px] font-mono text-white font-bold truncate">
                                  0{idx + 1}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link
                          href={`/moods/${moodSlides[moodSlideIndex].slug}`}
                          className="btn-luxury-primary inline-flex items-center space-x-2 py-3 px-6 text-xs uppercase tracking-luxury shadow-md hover:shadow-lg"
                        >
                          <span>Explore {moodSlides[moodSlideIndex].title} Atmosphere</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------- */}
              {/* CHAPTER 04: THE DETAILS CONTENT (NEW SECTION) */}
              {/* -------------------------------------------------------- */}
              {openSection === 'details' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="max-w-2xl">
                    <p className="text-sm sm:text-base font-serif italic text-[#110D09]/85 font-light leading-relaxed">
                      Complete formulation architecture, bottle engineering, longevity parameters, and the sensory application ritual.
                    </p>
                  </div>

                  {/* 4 Rich Details Spec Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Concentration & Formulation */}
                    <div className="bg-[#FAF6EE] border border-[#E8DFD3] hover:border-[#8C6D42] rounded-2xl p-5 space-y-3 transition-colors shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD3] flex items-center justify-center text-[#8C6D42]">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D42] font-bold block">
                        Concentration
                      </span>
                      <h4 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide text-[#110D09]">
                        20% Eau de Parfum
                      </h4>
                      <p className="text-xs text-[#110D09]/75 font-light leading-relaxed">
                        Extrait-grade oil concentration compounded with supercritical roasted cacao extract and natural Calabrian bergamot essence. 100% vegan & cruelty-free.
                      </p>
                    </div>

                    {/* Card 2: Longevity & Sillage */}
                    <div className="bg-[#FAF6EE] border border-[#E8DFD3] hover:border-[#8C6D42] rounded-2xl p-5 space-y-3 transition-colors shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD3] flex items-center justify-center text-[#8C6D42]">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D42] font-bold block">
                        Performance
                      </span>
                      <h4 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide text-[#110D09]">
                        10–12+ Hours Longevity
                      </h4>
                      <p className="text-xs text-[#110D09]/75 font-light leading-relaxed">
                        Anchored with skin-intimate cashmere musks creating an intoxicating 3-foot magnetic aura without overpowering enclosed rooms.
                      </p>
                    </div>

                    {/* Card 3: Flacon Architecture */}
                    <div className="bg-[#FAF6EE] border border-[#E8DFD3] hover:border-[#8C6D42] rounded-2xl p-5 space-y-3 transition-colors shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD3] flex items-center justify-center text-[#8C6D42]">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D42] font-bold block">
                        Vessel Craft
                      </span>
                      <h4 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide text-[#110D09]">
                        50 ML Crystal Flacon
                      </h4>
                      <p className="text-xs text-[#110D09]/75 font-light leading-relaxed">
                        Weighted Italian crystal glass with embossed VALCURA V monogram, micro-mist atomization pump, and magnetic obsidian closure.
                      </p>
                    </div>

                    {/* Card 4: Sillage Application Ritual */}
                    <div className="bg-[#FAF6EE] border border-[#E8DFD3] hover:border-[#8C6D42] rounded-2xl p-5 space-y-3 transition-colors shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DFD3] flex items-center justify-center text-[#8C6D42]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D42] font-bold block">
                        Application Ritual
                      </span>
                      <h4 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide text-[#110D09]">
                        Pulse-Point Mastery
                      </h4>
                      <p className="text-xs text-[#110D09]/75 font-light leading-relaxed">
                        Apply 2–3 mists to lateral neck, wrists, and collarbone. Allow to air-dry naturally; never rub wrists to protect the delicate citrus top note esters.
                      </p>
                    </div>
                  </div>

                  {/* Provenance & Batch Seal */}
                  <div className="p-4 bg-white border border-[#E8DFD3] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#554D45]">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#8C6D42]" />
                      <span>Batch No. VC-CIT-001 • 28-Day Cold Maturation in Glass Carboys</span>
                    </div>
                    <span className="text-[#8C6D42] font-bold uppercase tracking-wider">
                      IFRA Certified • Paraben & Phthalate Free
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom Quick Bar to Close or Next */}
              <div className="mt-8 pt-4 border-t border-[#E8DFD3] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setOpenSection(null)}
                  className="text-xs font-mono text-[#554D45] hover:text-[#110D09] uppercase tracking-wider flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Collapse Section</span>
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-[#8C6D42] font-bold uppercase tracking-widest hidden sm:inline">
                    VALCURA Atelier Dossier
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* ATELIER CRAFTSMANSHIP & OLFACTORY EXCELLENCE PILLARS */}
        {/* Compact, dense, high substance showcase without bloated margins */}
        {/* ============================================================== */}
        <section className="mt-6 sm:mt-8 max-w-6xl mx-auto space-y-5">
          <div className="text-center space-y-1 max-w-xl mx-auto">
            <span className="text-[9px] font-mono tracking-[0.25em] text-[#8C6D42] uppercase font-bold block">
              Atelier Olfactory Standards
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
              The Craftsmanship Behind The Scent
            </h2>
            <p className="text-xs text-[#110D09]/75 font-light leading-relaxed">
              Every drop of Cacao Citrine is compounded using traditional high-perfumery methods and verified clean ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#FAF6EE] border border-[#E8DFD3] rounded-xl p-4 sm:p-5 space-y-2 shadow-xs hover:border-[#110D09] transition-all">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#8C6D42] block">
                Pillar I • Concentration
              </span>
              <h3 className="text-base font-serif font-bold uppercase tracking-wide text-[#110D09]">
                20% Eau De Parfum
              </h3>
              <p className="text-xs text-[#110D09]/75 font-light leading-relaxed">
                Meticulously dosed at 20% fragrance oil concentration for radiant daylight projection and an intimate 8–10 hour skin trail.
              </p>
            </div>

            <div className="bg-[#FAF6EE] border border-[#E8DFD3] rounded-xl p-4 sm:p-5 space-y-2 shadow-xs hover:border-[#110D09] transition-all">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#8C6D42] block">
                Pillar II • Botanicals
              </span>
              <h3 className="text-base font-serif font-bold uppercase tracking-wide text-[#110D09]">
                Calabrian Bergamot & Cacao
              </h3>
              <p className="text-xs text-[#110D09]/75 font-light leading-relaxed">
                Cold-pressed bergamot rinds paired with artisanally roasted cocoa absolutes, avoiding cloying synthetic sweeteners.
              </p>
            </div>

            <div className="bg-[#FAF6EE] border border-[#E8DFD3] rounded-xl p-4 sm:p-5 space-y-2 shadow-xs hover:border-[#110D09] transition-all">
              <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#8C6D42] block">
                Pillar III • Clean Formulation
              </span>
              <h3 className="text-base font-serif font-bold uppercase tracking-wide text-[#110D09]">
                Organic Plant Alcohol Base
              </h3>
              <p className="text-xs text-[#110D09]/75 font-light leading-relaxed">
                Certified vegan, cruelty-free, and phthalate-free. Formulated on a skin-kind botanical alcohol carrier with zero chemical sting.
              </p>
            </div>
          </div>

          {/* Testimonial Quote Banner */}
          <div className="bg-[#FAF6EE] border-2 border-[#110D09] rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center space-y-2 shadow-xs">
            <div className="flex justify-center space-x-1 text-[#8C6D42]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#8C6D42]" />
              ))}
            </div>
            <p className="text-sm sm:text-base font-serif italic text-[#110D09] max-w-2xl mx-auto leading-relaxed">
              &ldquo;Cacao Citrine strikes that impossible balance: bright, sparkling citrus in the first hour that gently settles into warm hazelnut chocolate. It feels like golden morning sunlight on a bespoke cashmere coat.&rdquo;
            </p>
            <div className="pt-1 text-[10px] font-mono text-[#8C6D42] uppercase tracking-widest font-bold">
              — Atelier Fragrance Collector • Verified Purchase
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
