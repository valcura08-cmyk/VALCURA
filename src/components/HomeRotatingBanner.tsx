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
  objectPosition?: string;
}

const slides: BannerSlide[] = [
  {
    id: 'cacaoaveil',
    image: '/brand/home-banner-cacaoaveil.jpg',
    title: 'Cacaoveil Is Now Live',
    link: '/collections/cacaoveil',
    bgColor: '#3D2314',
    objectPosition: 'center center',
  },
  {
    id: 'valcura-roses',
    image: '/brand/home-banner-valcura-roses.jpg',
    title: 'VALCURA Atelier Fragrances',
    link: '/shop', // Redirects to All Scents catalogue as requested!
    bgColor: '#26070B',
    objectPosition: 'center 38%',
  },
];

export default function HomeRotatingBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextSlide(); // Swiped left -> next slide
    } else if (diff < -45) {
      prevSlide(); // Swiped right -> previous slide
    }
    setTouchStartX(null);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="px-3 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto -mt-1 sm:-mt-2 mb-3 sm:mb-5">
      {/* Sleek Wide Rectangular Banner Frame - Natural 1024/346 ratio preserves full image on mobile and desktop without cutting */}
      <div
        className="relative w-full aspect-[1024/346] rounded-xl sm:rounded-2xl overflow-hidden border border-[#110D09]/80 sm:border-2 sm:border-[#110D09] shadow-[0_12px_36px_-12px_rgba(17,13,9,0.2)] transition-colors duration-700 group select-none touch-pan-y"
        style={{ backgroundColor: currentSlide.bgColor }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Preload and render all slides for instant zero-lag rotation */}
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Clickable Full-Size Slide Link - Stretches edge-to-edge to full fill */}
              <Link
                href={slide.link}
                className="absolute inset-0 block w-full h-full cursor-pointer z-10 overflow-hidden"
                aria-label={slide.title}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 1440px"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                    style={{ objectPosition: slide.objectPosition || 'center center' }}
                    priority={idx === 0}
                  />
                </div>
              </Link>
            </div>
          );
        })}

        {/* Floating Arrows to Change (Left & Right - Scaled for Mobile) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-1.5 sm:left-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#110D09] border border-[#E8DFD3] shadow-md flex items-center justify-center transition-all opacity-70 group-hover:opacity-100 hover:scale-105 cursor-pointer z-30"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-1.5 sm:right-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#110D09] border border-[#E8DFD3] shadow-md flex items-center justify-center transition-all opacity-70 group-hover:opacity-100 hover:scale-105 cursor-pointer z-30"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>

        {/* Bottom Clean Slide Dots (Scaled for Mobile) */}
        <div className="absolute bottom-1.5 sm:bottom-3 inset-x-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="flex items-center space-x-1.5 sm:space-x-2 pointer-events-auto bg-black/40 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/15">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 sm:h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'w-5 sm:w-8 bg-white shadow-md'
                    : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
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
