import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '@/lib/db';

export const metadata = {
  title: 'The Cacao Collection | VALCURA Atelier',
  description:
    'Explore the 3 fragrances in our inaugural Cacao Collection: Cacao Citrine, Silken Sambac, and Roasted Zest.',
};

export default function CacaoCollectionPage() {
  const db = getDb();
  const products = db.products.filter((p) => p.collection === 'Cacao Collection');

  return (
    <div className="bg-[#FAF7F2] text-[#110D09] min-h-screen pb-24">
      {/* Editorial Collection Header Banner */}
      <section className="relative w-full overflow-hidden border-b border-[#E8DFD3]">
        <div className="relative aspect-[21/9] sm:aspect-[16/6] min-h-[280px] sm:min-h-[360px] w-full">
          <Image
            src="/editorial/cacao-collection-citrus.jpg"
            alt="The Cacao Collection by VALCURA"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

          {/* Centered Editorial Typography */}
          <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="max-w-3xl mx-auto space-y-2.5">
              <span className="text-[10px] tracking-luxury uppercase text-[#E8D7C3] font-mono font-bold block">
                Collection 01 • Inaugural Trilogy
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-wide uppercase text-white drop-shadow-md">
                The Cacao Collection
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-light max-w-xl mx-auto leading-relaxed drop-shadow-sm">
                Where rich hazelnut comfort and roasted cacao depth meet luminous citrus vitality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ONLY THE FRAGRANCES — NOTHING ELSE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E8DFD3] text-xs font-mono text-[#110D09]/60">
          <span>Showing {products.length} Fragrances</span>
          <span className="font-semibold text-[#8C6D42]">The Cacao Trilogy • 50 ML</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => {
            const isAvailable = product.id === 'cacao-citrine';

            if (isAvailable) {
              return (
                <div
                  key={product.id}
                  className="bg-[#FAF6EE] border border-[#110D09] rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Compact Product Image */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative aspect-[4/3] max-h-56 bg-[#F4ECE1] overflow-hidden block group"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 bg-[#110D09] text-[#FAF7F2] font-bold rounded-full shadow-md">
                        Available Now • 50 ML
                      </span>
                    </div>
                  </Link>

                  {/* Product Card Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2 text-center">
                      <span className="text-[10px] text-[#8C6D42] font-mono uppercase tracking-wider font-semibold block">
                        Unisex • Eau de Parfum
                      </span>
                      <Link href={`/product/${product.slug}`}>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wide uppercase text-[#110D09] hover:text-[#8C6D42] transition-colors">
                          {product.name}
                        </h2>
                      </Link>

                      <div className="pt-2 flex items-baseline justify-center space-x-3">
                        <span className="text-2xl font-serif text-[#110D09] font-bold">
                          ₹{product.fullPrice || 499}
                        </span>
                        <span className="text-xs text-[#110D09]/40 line-through font-mono">
                          ₹{product.standardPrice || 599}
                        </span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-md font-mono font-bold">
                          Save ₹100
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t border-[#E8DFD3]">
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-full btn-luxury-primary text-center block text-xs font-serif font-bold py-3 uppercase tracking-[0.2em] rounded-xl"
                      >
                        Explore Fragrance →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            // COMING SOON PERFUMES (Silken Sambac & Roasted Zest)
            return (
              <div
                key={product.id}
                className="bg-[#FAF6EE] border border-[#E8DFD3] rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-300"
              >
                {/* Compact Product Image */}
                <div className="relative aspect-[4/3] max-h-56 bg-[#F4ECE1] overflow-hidden block">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover opacity-90"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 bg-[#FAF7F2]/95 text-[#110D09] border border-[#D5CDC2] rounded-full font-bold">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Just perfume name and Coming Soon - NO EXTRA CLUTTER */}
                <div className="p-5 flex-1 flex flex-col justify-between items-center text-center space-y-6">
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] text-[#8C6D42] font-mono uppercase tracking-wider font-semibold block">
                      {product.collection}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wide uppercase text-[#110D09]">
                      {product.name}
                    </h2>
                  </div>

                  <div className="w-full pt-3 border-t border-[#E8DFD3]">
                    <div className="w-full py-3 px-4 bg-[#FAF7F2] border border-[#D5CDC2] text-center text-xs font-mono font-bold tracking-luxury uppercase text-[#110D09] rounded-xl">
                      Coming Soon
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
