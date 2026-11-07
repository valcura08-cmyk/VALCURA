'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, ArrowRight, Sparkles } from 'lucide-react';
import { Mood, Product } from '@/lib/db';

interface Props {
  moods: Mood[];
  products: Product[];
}

export default function MoodsClientView({ moods }: Props) {
  return (
    <div className="bg-[#FAF7F2] text-[#110D09] min-h-screen pb-24">
      {/* Editorial Header Banner */}
      <section className="relative w-full h-[300px] sm:h-[380px] lg:h-[440px] bg-[#110D09] overflow-hidden">
        <Image
          src="/editorial/explore-by-moods-banner.jpg"
          alt="Explore By Moods - VALCURA Atelier"
          fill
          className="object-cover object-center opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="max-w-2xl mx-auto space-y-2.5 text-white">
            <div className="inline-flex items-center space-x-2 text-[10px] tracking-widest uppercase text-[#D5CDC2] font-mono font-bold">
              <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Atmospheric Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-[#FAF7F2] font-bold">
              Explore By Moods
            </h1>
            <p className="text-xs sm:text-sm text-white/85 font-light max-w-lg mx-auto leading-relaxed">
              Every fragrance begins with a feeling. Choose an atmospheric moment below to open its dedicated curation, discover paired perfumes, or let us help you find your signature match.
            </p>
          </div>
        </div>
      </section>

      {/* 4 MOOD IMAGES SELECTION GALLERY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="text-center mb-10 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold block">
            Curated Lifestyles
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold uppercase text-[#110D09]">
            Select Your Atmosphere
          </h2>
          <p className="text-xs text-[#110D09]/60 font-light">
            Click any mood image to enter its exclusive showcase & bespoke perfume pairing
          </p>
        </div>

        {/* 5 Curated Moods in Square Box Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {moods.map((mood, idx) => {
            const pIds =
              mood.recommendedProductIds ||
              (mood.recommendedProductId ? [mood.recommendedProductId] : []);

            return (
              <Link
                key={mood.id}
                href={`/moods/${mood.slug}`}
                className="group bg-white border border-[#E8DFD3] hover:border-[#110D09] transition-all duration-300 overflow-hidden flex flex-col cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1"
              >
                {/* Square Image Box */}
                <div className="relative aspect-square bg-[#F4ECE1] overflow-hidden">
                  <Image
                    src={mood.image}
                    alt={mood.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 240px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 bg-[#110D09] text-[#FAF7F2] font-bold shadow-md">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-[#FAF7F2]/95 text-[#110D09] border border-[#E8DFD3] backdrop-blur-sm shadow-md font-semibold">
                      {pIds.length} Scent Pairing{pIds.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8C6D42] font-bold">
                      Atmosphere Mood
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide text-[#110D09] group-hover:text-[#8C6D42] transition-colors">
                      {mood.title}
                    </h3>
                    <p className="text-xs text-[#110D09]/70 font-light line-clamp-2 leading-relaxed">
                      {mood.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8DFD3] flex items-center justify-between text-xs text-[#110D09] font-serif font-bold uppercase tracking-wider group-hover:text-[#8C6D42] transition-colors">
                    <span>Explore Fragrance</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 text-[#8C6D42]" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Informative Guidance Banner */}
        <div className="mt-14 max-w-3xl mx-auto p-6 bg-[#FAF6EE] border border-[#E8DFD3] text-center space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#8C6D42] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Bespoke Experience</span>
          </div>
          <p className="text-xs sm:text-sm text-[#110D09]/80 font-light leading-relaxed">
            Each mood page features a curated signature perfume ready for instant purchase or pre-order at ₹499, alongside the &ldquo;Help to Find Best One&rdquo; fragrance quiz for tailored recommendations.
          </p>
        </div>
      </section>
    </div>
  );
}
