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

      {/* Collections Grid - Square Presentation Card for The Cacao Collection */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="text-center max-w-md mx-auto mb-10 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold block">
            Archival Chapters
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold uppercase text-[#110D09]">
            Select A Collection
          </h2>
          <p className="text-xs text-[#110D09]/60 font-light">
            Click below to open the collection and reveal all included flacons
          </p>
        </div>

        {/* The Cacao Collection Square Box */}
        <div className="max-w-sm sm:max-w-md mx-auto">
          <Link
            href="/collections/cacao"
            className="group bg-[#FAF6EE] border border-[#E8DFD3] hover:border-[#110D09] rounded-2xl sm:rounded-3xl transition-all duration-500 shadow-sm hover:shadow-xl overflow-hidden flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="px-5 py-3 bg-[#FAF6EE] border-b border-[#E8DFD3] flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8C6D42] font-bold">
                Collection 01
              </span>
              <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#110D09] font-bold group-hover:text-[#8C6D42] transition-colors">
                Open Collection →
              </span>
            </div>

            {/* Square Aspect Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-[#F4ECE1]">
              <Image
                src="/editorial/cacao-collection-citrus.jpg"
                alt="The Cacao Collection by VALCURA"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 bg-[#110D09] text-[#FAF7F2] font-bold rounded-full shadow-md">
                  3 Fragrances
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 bg-[#FAF7F2]/95 text-[#110D09] font-bold backdrop-blur-sm border border-[#E8DFD3] rounded-full shadow-sm">
                  Debut Trilogy
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col text-center space-y-3 bg-[#FAF6EE]">
              <div className="space-y-1">
                <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold block">
                  Available Now & In Formulation
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wide text-[#110D09] group-hover:text-[#8C6D42] transition-colors">
                  The Cacao Collection
                </h3>
                <p className="text-[11px] font-mono text-[#110D09]/60 uppercase tracking-wider">
                  50 ML Eau de Parfum • 20% Concentration
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#110D09]/75 font-light leading-relaxed">
                Featuring flagship <span className="font-semibold text-[#110D09]">Cacao Citrine</span> alongside upcoming creations <span className="font-semibold text-[#110D09]">Silken Sambac</span> & <span className="font-semibold text-[#110D09]">Roasted Zest</span>.
              </p>

              <div className="text-[11px] text-[#8C6D42] font-mono font-semibold pt-1">
                1 Active Launch • 2 In Formulation
              </div>

              <div className="pt-3 border-t border-[#E8DFD3]">
                <div className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#110D09] group-hover:bg-[#8C6D42] text-[#FAF7F2] text-xs font-serif font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 shadow-sm">
                  <span>View Full Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
