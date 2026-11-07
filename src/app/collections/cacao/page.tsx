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
                    className="relative aspect-[16/10] max-h-40 sm:max-h-44 bg-[#F4ECE1] overflow-hidden block group"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#110D09] text-[#FAF7F2] font-bold rounded-full shadow-xs">
                        Available Now • 50 ML
                      </span>
                    </div>
                  </Link>

                  {/* Product Card Details */}
                  <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                    <div className="space-y-0.5 text-center">
                      <span className="text-[9px] text-[#8C6D42] font-mono uppercase tracking-wider font-semibold block">
                        Unisex • Eau de Parfum
                      </span>
                      <Link href={`/product/${product.slug}`}>
                        <h2 className="text-base sm:text-lg font-serif font-bold tracking-wide uppercase text-[#110D09] hover:text-[#8C6D42] transition-colors leading-tight">
                          {product.name}
                        </h2>
                      </Link>

                      <div className="pt-1.5 flex items-baseline justify-center space-x-2">
                        <span className="text-lg sm:text-xl font-serif text-[#110D09] font-bold">
                          ₹{product.fullPrice || 499}
                        </span>
                        <span className="text-[10px] text-[#110D09]/40 line-through font-mono">
                          ₹{product.standardPrice || 599}
                        </span>
                        <span className="text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200 rounded font-mono font-bold">
                          Save ₹100
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-[#E8DFD3]">
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-full btn-luxury-primary text-center block text-[11px] font-serif font-bold py-2 px-3 uppercase tracking-[0.15em] rounded-lg shadow-2xs"
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
                className="bg-[#FAF6EE] border border-[#E8DFD3] rounded-xl max-w-[270px] sm:max-w-[280px] w-full mx-auto flex flex-col justify-between overflow-hidden shadow-2xs transition-all duration-300"
              >
                {/* Compact Product Image */}
                <div className="relative aspect-[16/10] max-h-40 sm:max-h-44 bg-[#F4ECE1] overflow-hidden block">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover opacity-90"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#FAF7F2]/95 text-[#110D09] border border-[#D5CDC2] rounded-full font-bold">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Just perfume name and Coming Soon - NO EXTRA CLUTTER */}
                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between items-center text-center space-y-2.5">
                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] text-[#8C6D42] font-mono uppercase tracking-wider font-semibold block">
                      {product.collection}
                    </span>
                    <h2 className="text-base sm:text-lg font-serif font-bold tracking-wide uppercase text-[#110D09] leading-tight">
                      {product.name}
                    </h2>
                  </div>

                  <div className="w-full pt-2 border-t border-[#E8DFD3]">
                    <div className="w-full py-2 px-3 bg-[#FAF7F2] border border-[#D5CDC2] text-center text-[10px] font-mono font-bold tracking-luxury uppercase text-[#110D09] rounded-lg">
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
