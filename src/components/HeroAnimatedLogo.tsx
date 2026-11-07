'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, RotateCcw, Compass } from 'lucide-react';

export default function HeroAnimatedLogo() {
  const [stage, setStage] = useState<number>(0);
  const [replayCount, setReplayCount] = useState<number>(0);

  useEffect(() => {
    // Reset stage
    setStage(0);

    // Timeline:
    // Stage 0: Initial state (V emblem appears)
    // Stage 1 (350ms): VAL and CURA pop out from below the logo to form VALCURA
    // Stage 2 (1100ms): Tagline reveals
    // Stage 3 (1500ms): CTAs fade in
    const timer1 = setTimeout(() => setStage(1), 350);
    const timer2 = setTimeout(() => setStage(2), 1100);
    const timer3 = setTimeout(() => setStage(3), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [replayCount]);

  const handleReplay = () => {
    setStage(0);
    setReplayCount((prev) => prev + 1);
  };

  const isPoppedOut = stage >= 1;
  const isTaglineVisible = stage >= 2;
  const isCtaVisible = stage >= 3;

  return (
    <section className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center pt-5 sm:pt-6 pb-5 sm:pb-6 overflow-hidden bg-[#FBF3E5]">
      
      {/* Soft Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FBF3E5]/40 via-transparent to-[#FBF3E5] pointer-events-none" />

      {/* Replay Pill Button (Discreet, Top Right) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <button
          type="button"
          onClick={handleReplay}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-[#E8DFD3] text-[10px] tracking-widest uppercase font-mono text-[#554D45] hover:text-[#18120E] transition-all shadow-sm"
          title="Replay Logo Reveal Animation"
        >
          <RotateCcw className="w-3 h-3 text-[#8C6D42]" />
          <span className="hidden sm:inline">Replay Motion</span>
        </button>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">

        {/* ============================================================ */}
        {/* HERO LOGO: ADJUSTED PROPORTIONED V EMBLEM + POP OUT VALCURA */}
        {/* ============================================================ */}
        <div className="relative flex flex-col items-center justify-center w-full my-1.5 select-none">
          
          {/* 1. TOP: THE ICONIC V EMBLEM (Refined Size) */}
          <div
            className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 z-20 cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              stage >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            onClick={handleReplay}
            title="Click to replay motion"
          >
            <Image
              src="/brand/v-emblem-center.png"
              alt="VALCURA Emblem"
              fill
              className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>

          {/* 2. BELOW THE LOGO: "VAL" and "CURA" POP OUT DOWNWARDS (Refined Height) */}
          <div className="relative flex items-center justify-center h-7 sm:h-9 md:h-10 lg:h-11 w-full max-w-xs sm:max-w-sm md:max-w-md -mt-1 sm:-mt-1.5 z-10 overflow-visible">
            
            {/* "VAL" POPS DOWN-LEFT */}
            <div
              className="relative h-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
              style={{
                aspectRatio: '330 / 152',
                transform: isPoppedOut
                  ? 'translateY(0) translateX(0) scale(1)'
                  : 'translateY(-30px) translateX(15px) scale(0.6)',
                opacity: isPoppedOut ? 1 : 0,
                filter: isPoppedOut ? 'blur(0px)' : 'blur(4px)',
              }}
            >
              <Image
                src="/brand/val-left.png"
                alt="VAL"
                fill
                className="object-contain object-right pointer-events-none"
                priority
              />
            </div>

            {/* "CURA" POPS DOWN-RIGHT */}
            <div
              className="relative h-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
              style={{
                aspectRatio: '462 / 152',
                transform: isPoppedOut
                  ? 'translateY(0) translateX(0) scale(1)'
                  : 'translateY(-30px) translateX(-15px) scale(0.6)',
                opacity: isPoppedOut ? 1 : 0,
                filter: isPoppedOut ? 'blur(0px)' : 'blur(4px)',
              }}
            >
              <Image
                src="/brand/cura-right.png"
                alt="CURA"
                fill
                className="object-contain object-left pointer-events-none"
                priority
              />
            </div>

          </div>
        </div>

        {/* Brand Tagline: "A scent for every side of you." */}
        <div
          className={`mt-2.5 sm:mt-3 max-w-lg transition-all duration-1000 ease-out ${
            isTaglineVisible
              ? 'opacity-100 translate-y-0 filter-none'
              : 'opacity-0 translate-y-3 blur-sm'
          }`}
        >
          <p className="text-sm sm:text-base md:text-lg font-serif text-[#18120E] tracking-wider italic font-light">
            A scent for every side of you.
          </p>
        </div>

        {/* Primary CTAs: Explore By Scents & Explore By Moods */}
        <div
          className={`mt-4 sm:mt-5 flex flex-col sm:flex-row items-center gap-3 transition-all duration-1000 ease-out ${
            isCtaVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <Link
            href="/shop"
            className="w-full sm:w-auto btn-luxury-primary flex items-center justify-center space-x-2.5 group px-6 py-3 text-xs shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Explore By Scents</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/moods"
            className="w-full sm:w-auto btn-luxury-outline flex items-center justify-center space-x-2 px-6 py-3 text-xs bg-white/70 hover:bg-white cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#8C6D42]" />
            <span>Explore By Moods</span>
          </Link>
        </div>

        {/* Scroll Down Indicator - Positioned cleanly below CTAs with no overlap */}
        <button
          type="button"
          onClick={() => {
            const target = document.getElementById('discovery-gateways');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: window.innerHeight * 0.75, behavior: 'smooth' });
            }
          }}
          className={`mt-6 sm:mt-8 flex flex-col items-center space-y-1.5 transition-all duration-1000 cursor-pointer group ${
            isCtaVisible ? 'opacity-60 hover:opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          title="Scroll down to discover"
        >
          <span className="text-[9px] sm:text-[10px] tracking-luxury uppercase text-[#18120E]/60 font-mono group-hover:text-[#8C6D42] transition-colors">
            Scroll To Discover
          </span>
          <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-[#18120E] to-transparent animate-pulse group-hover:from-[#8C6D42]" />
        </button>
      </div>
    </section>
  );
}
