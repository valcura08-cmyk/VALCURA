import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import HeroAnimatedLogo from '@/components/HeroAnimatedLogo';
import HomeRotatingBanner from '@/components/HomeRotatingBanner';

export const metadata = {
  title: 'VALCURA | A Scent for Every Side of You',
  description:
    'VALCURA is a modern fragrance house built around individuality, moods, and personal expression. Explore by moods, explore by scents, and discover Cacaoaveil.',
};

export default function HomePage() {
  return (
    <div className="bg-[#FAF7F2] text-[#110D09] overflow-hidden">
      {/* 1. HERO OPENING: ANIMATED VALCURA LOGO (Adjusted Proportions) */}
      <HeroAnimatedLogo />

      {/* 2. ROTATING BRAND BANNER: RECTANGULAR CAMPAIGN SHOWCASE WITH ARROWS */}
      <HomeRotatingBanner />

      {/* 3. DISCOVERY GATEWAYS: 3 SQUARE / RECTANGULAR BOXES (MOODS, SCENTS, ALL COLLECTIONS) */}
      <section id="discovery-gateways" className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-3 sm:mb-5 space-y-1">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C6D42] font-mono font-bold block">
            Begin Your Fragrance Journey
          </span>
          <h2 className="text-lg sm:text-2xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
            Find A Scent That Feels Like You
          </h2>
          <p className="text-xs text-[#110D09]/70 font-light leading-relaxed">
            Choose whether to explore curated moods, browse our creations directly, or explore our themed collections.
          </p>
        </div>

        {/* 3 Structured Gateway Portals with Sophisticated Curved Corners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          
          {/* PORTAL 1: EXPLORE BY MOODS */}
          <Link
            href="/moods"
            className="group bg-[#FAF6EE] border border-[#E8DFD3] hover:border-[#110D09] rounded-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-[#F4ECE1] overflow-hidden">
              <Image
                src="/editorial/explore-by-moods-banner.jpg"
                alt="Explore By Moods - VALCURA"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 380px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-[#8C6D42] uppercase tracking-wider font-semibold block">
                  Portal 01 • Atmospheric Discovery
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide text-[#110D09] group-hover:text-[#8C6D42] transition-colors">
                  Explore By Moods
                </h3>
                <p className="text-[11px] sm:text-xs text-[#110D09]/70 font-light leading-relaxed line-clamp-2">
                  Select an emotion, situation, or hour. Reveal curated fragrances and find your bespoke signature match.
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8DFD3] flex items-center justify-between text-[11px] font-serif font-bold uppercase tracking-[0.15em] text-[#110D09] group-hover:text-[#8C6D42] transition-colors">
                <span>Enter Moods</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* PORTAL 2: EXPLORE BY SCENTS */}
          <Link
            href="/shop"
            className="group bg-[#FAF6EE] border border-[#E8DFD3] hover:border-[#110D09] rounded-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-[#F4ECE1] overflow-hidden">
              <Image
                src="/editorial/explore-by-scents-banner-v2.jpg"
                alt="Explore By Scents - VALCURA"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 380px"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-[#8C6D42] uppercase tracking-wider font-semibold block">
                  Portal 02 • Fragrance Catalogue
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide text-[#110D09] group-hover:text-[#8C6D42] transition-colors">
                  Explore By Scents
                </h3>
                <p className="text-[11px] sm:text-xs text-[#110D09]/70 font-light leading-relaxed line-clamp-2">
                  Browse our handcrafted 50 ML Eau de Parfum creations, pyramid formulations, notes architecture, and craftsmanship.
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8DFD3] flex items-center justify-between text-[11px] font-serif font-bold uppercase tracking-[0.15em] text-[#110D09] group-hover:text-[#8C6D42] transition-colors">
                <span>Browse All Scents</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* PORTAL 3: EXPLORE ALL COLLECTIONS */}
          <Link
            href="/collections"
            className="group bg-[#FAF6EE] border border-[#E8DFD3] hover:border-[#110D09] rounded-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-[#F4ECE1] overflow-hidden">
              <Image
                src="/editorial/explore-all-collections-banner.jpg"
                alt="Explore All Collections - VALCURA"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 380px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-[#8C6D42] uppercase tracking-wider font-semibold block">
                  Portal 03 • Curated Chapters
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide text-[#110D09] group-hover:text-[#8C6D42] transition-colors">
                  Explore All Collections
                </h3>
                <p className="text-[11px] sm:text-xs text-[#110D09]/70 font-light leading-relaxed line-clamp-2">
                  Discover our curated themed trilogies and scent worlds, featuring the inaugural Cacaoaveil Collection.
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8DFD3] flex items-center justify-between text-[11px] font-serif font-bold uppercase tracking-[0.15em] text-[#110D09] group-hover:text-[#8C6D42] transition-colors">
                <span>View Collections</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. SUBTLE MONOGRAM BRAND SIGN-OFF */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-center bg-[#FAF7F2] border-t border-[#E8DFD3]">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="relative w-7 h-7 mx-auto opacity-75">
            <Image
              src="/brand/valcura-emblem-dark.png"
              alt="VALCURA Emblem"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#110D09] tracking-[0.25em] uppercase">
            VALCURA
          </h3>
          <p className="text-xs sm:text-sm font-serif italic text-[#110D09]/75 font-light">
            A scent for every side of you.
          </p>
        </div>
      </section>
    </div>
  );
}
