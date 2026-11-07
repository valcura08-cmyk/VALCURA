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
    <div className="bg-[#FAF7F2] text-[#110D09] min-h-screen pb-16">
      {/* Editorial Compact Front Banner */}
      <section className="relative w-full h-[180px] sm:h-[220px] bg-[#110D09] overflow-hidden">
        <Image
          src="/editorial/explore-all-collections-banner.jpg"
          alt="Our Collections - VALCURA Atelier"
          fill
          className="object-cover object-center opacity-85"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="max-w-xl mx-auto space-y-1.5 text-white">
            <div className="inline-flex items-center space-x-1.5 text-[9px] tracking-widest uppercase text-[#D5CDC2] font-mono font-bold">
              <Compass className="w-3 h-3 text-[#C5A880]" />
              <span>Curated Chapters</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wide uppercase text-[#FAF7F2] font-bold">
              Our Collections
            </h1>
            <p className="text-[11px] sm:text-xs text-white/80 font-light max-w-md mx-auto leading-relaxed">
              Explore our inaugural fragrance chapters and themed olfactory universes.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Section - Small Compact Square Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        <div className="text-center max-w-sm mx-auto mb-4 space-y-0.5">
          <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-[#8C6D42] font-bold block">
            Archival Chapters
          </span>
          <h2 className="text-lg sm:text-xl font-serif font-bold uppercase text-[#110D09]">
            Select A Collection
          </h2>
          <p className="text-[11px] text-[#110D09]/60 font-light">
            Click to explore the collection and reveal all included flacons
          </p>
        </div>

        {/* The Cacao Collection - Small Compact Square Box (Decreased Length) */}
        <div className="flex justify-center">
          <Link
            href="/collections/cacao"
            className="group w-full max-w-[220px] sm:max-w-[240px] bg-[#FAF6EE] border border-[#E8DFD3] hover:border-[#110D09] rounded-2xl transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 overflow-hidden flex flex-col"
          >
            {/* Compact Image */}
            <div className="relative aspect-[4/3] w-full bg-[#F4ECE1] overflow-hidden">
              <Image
                src="/editorial/cacao-collection-citrus.jpg"
                alt="The Cacao Collection by VALCURA"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute top-2 left-2">
                <span className="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#110D09] text-[#FAF7F2] font-bold rounded-full shadow-2xs">
                  Collection 01
                </span>
              </div>
            </div>

            {/* Compact Minimal Details - Decreased Length */}
            <div className="p-3 flex flex-col text-center space-y-1 bg-[#FAF6EE]">
              <h3 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wide text-[#110D09] group-hover:text-[#8C6D42] transition-colors leading-tight">
                The Cacao Collection
              </h3>
              <p className="text-[9px] font-mono text-[#8C6D42] uppercase tracking-wider">
                50 ML Eau de Parfum
              </p>

              <div className="pt-1.5">
                <div className="w-full inline-flex items-center justify-center space-x-1 py-1.5 px-3 bg-[#110D09] group-hover:bg-[#8C6D42] text-[#FAF7F2] text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all duration-200">
                  <span>Open Collection</span>
                  <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
