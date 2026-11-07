'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  image: string;
  title: string;
  link: string;
  bgColor: string;
}

const slides: BannerSlide[] = [
  {
    id: 'cacaoaveil',
    image: '/brand/home-banner-cacaoaveil.jpg',
    title: 'The Cacaoaveil Is Now Live',
    link: '/collections/cacao',
    bgColor: '#3D2314',
  },
  {
    id: 'valcura-roses',
    image: '/brand/home-banner-valcura-roses.jpg',
    title: 'VALCURA Atelier Fragrances',
    link: '/shop', // Redirects to All Scents catalogue as requested!
    bgColor: '#26070B',
  },
];

export default function HomeRotatingBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate automatically every 5 seconds (5000ms), pauses on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto -mt-2 sm:-mt-4 mb-10 sm:mb-14">
      {/* Full Size Rectangular Banner Frame */}
      <div
        className="relative w-full aspect-[16/10] sm:aspect-[18/9] md:aspect-[2/1] min-h-[320px] sm:min-h-[440px] md:min-h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#110D09] shadow-[0_16px_40px_-12px_rgba(17,13,9,0.25)] transition-colors duration-700 group select-none"
        style={{ backgroundColor: currentSlide.bgColor }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Ambient matching blurred background so frame is seamlessly filled */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            key={`blur-${currentSlide.id}`}
            src={currentSlide.image}
            alt=""
            fill
            className="object-cover blur-2xl opacity-35 scale-110 transition-opacity duration-700"
            aria-hidden
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Clickable Full-Size Slide Link */}
        <Link
          href={currentSlide.link}
          className="absolute inset-0 z-10 block w-full h-full cursor-pointer flex items-center justify-center p-2 sm:p-4"
          aria-label={currentSlide.title}
        >
          {/* Main Foreground Image — 100% Full Size, Uncropped */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              key={currentSlide.id}
              src={currentSlide.image}
              alt={currentSlide.title}
              fill
              className="object-contain object-center transition-opacity duration-700 ease-in-out drop-shadow-lg"
              priority
            />
          </div>
        </Link>

        {/* Floating Arrows to Change (Left & Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#110D09] border border-[#E8DFD3] shadow-lg flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 hover:scale-105 cursor-pointer z-30"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-[#110D09] border border-[#E8DFD3] shadow-lg flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 hover:scale-105 cursor-pointer z-30"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Clean Slide Dots (No Text Badges) */}
        <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="flex items-center space-x-2 pointer-events-auto bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 sm:w-8 bg-white shadow-md'
                    : 'w-2 sm:w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Jump to slide 0${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
