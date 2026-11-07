import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass } from 'lucide-react';

export const metadata = {
  title: 'Our Collections | VALCURA Atelier',
  description: 'Explore the curated chapters and olfactive universes conceived by VALCURA.',
};

export default function CollectionsOverviewPage() {
  return (
    <div className="bg-[#FAF7F2] text-[#110D09] min-h-screen pb-24">
      {/* Editorial Front Banner */}
      <section className="relative w-full h-[300px] sm:h-[380px] lg:h-[440px] bg-[#110D09] overflow-hidden">
        <Image
          src="/editorial/explore-all-collections-banner.jpg"
          alt="Our Collections - VALCURA Atelier"
          fill
          className="object-cover object-center opacity-85"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="max-w-2xl mx-auto space-y-2.5 text-white">
            <div className="inline-flex items-center space-x-2 text-[10px] tracking-widest uppercase text-[#D5CDC2] font-mono font-bold">
              <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Curated Chapters</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-[#FAF7F2] font-bold">
              Our Collections
            </h1>
            <p className="text-xs sm:text-sm text-white/85 font-light max-w-lg mx-auto leading-relaxed">
              Every collection tells an overarching story across distinct olfactory profiles. Explore our inaugural chapters and themed universes below.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Grid - Compact Small Square Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="text-center max-w-md mx-auto mb-8 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold block">
            Archival Chapters
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase text-[#110D09]">
            Select A Collection
          </h2>
          <p className="text-xs text-[#110D09]/60 font-light">
            Click to explore the collection and reveal all included flacons
          </p>
        </div>

        {/* The Cacao Collection - Small Compact Square Box */}
        <div className="flex justify-center">
          <Link
            href="/collections/cacao"
            className="group w-full max-w-[310px] sm:max-w-[330px] bg-[#FAF6EE] border border-[#E8DFD3] hover:border-[#110D09] rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
          >
            {/* Square Aspect Image - Compact, not overly filled */}
            <div className="relative aspect-square w-full bg-[#F4ECE1] overflow-hidden">
              <Image
                src="/editorial/cacao-collection-citrus.jpg"
                alt="The Cacao Collection by VALCURA"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 bg-[#110D09] text-[#FAF7F2] font-bold rounded-full shadow-sm">
                  Collection 01
                </span>
              </div>
              <div className="absolute bottom-2.5 right-2.5">
                <span className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 bg-white/95 text-[#110D09] font-bold backdrop-blur-sm border border-[#E8DFD3] rounded-full shadow-xs">
                  Debut Trilogy
                </span>
              </div>
            </div>

            {/* Compact Clean Details - No excessive filling */}
            <div className="p-4 sm:p-5 flex flex-col text-center space-y-2 bg-[#FAF6EE]">
              <div>
                <span className="text-[9px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold block mb-1">
                  Available Now & In Formulation
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold uppercase tracking-wide text-[#110D09] group-hover:text-[#8C6D42] transition-colors">
                  The Cacao Collection
                </h3>
                <p className="text-[10px] font-mono text-[#110D09]/60 uppercase tracking-wider mt-0.5">
                  50 ML Eau de Parfum • 20% Concentration
                </p>
              </div>

              <p className="text-xs text-[#110D09]/75 font-light leading-snug">
                Featuring flagship <span className="font-semibold text-[#110D09]">Cacao Citrine</span> alongside upcoming chapters.
              </p>

              <div className="pt-2 border-t border-[#E8DFD3]">
                <div className="w-full inline-flex items-center justify-center space-x-1.5 py-2.5 px-4 bg-[#110D09] group-hover:bg-[#8C6D42] text-[#FAF7F2] text-xs font-serif font-bold uppercase tracking-wider rounded-lg transition-all duration-300 shadow-xs">
                  <span>Open Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
