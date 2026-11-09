import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '@/lib/db';

export default function ShopAllFragrancesPage() {
  const db = getDb();
  const products = db.products;

  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-10 sm:pb-14">
      {/* Editorial Front Banner */}
      <section className="relative w-full h-[160px] sm:h-[220px] lg:h-[260px] bg-[#110D09] overflow-hidden">
        <Image
          src="/editorial/explore-by-scents-banner.jpg"
          alt="Explore By Scents - VALCURA Atelier"
          fill
          className="object-cover object-[center_15%] opacity-85"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-3 sm:p-4">
          <div className="max-w-2xl mx-auto space-y-1.5 text-white">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif tracking-wide uppercase text-[#FAF7F2]">
              Explore By Scents
            </h1>
            <p className="text-[11px] sm:text-xs text-white/85 font-light max-w-lg mx-auto leading-relaxed">
              Discover our handcrafted 50 ML Eau de Parfum creations, olfactory pyramids, and second-skin sillage.
            </p>
          </div>
        </div>
      </section>

      {/* Catalogue Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
        <div className="flex items-center justify-between pb-2.5 mb-4 border-b border-[#E8E2D8] text-xs text-[#110D09]/60 font-mono">
          <span>Showing {products.length} Fragrance Profiles</span>
          <span>Collection: Cacao Edition</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => {
            const isAvailable = product.id === 'cacao-citrine';

            if (isAvailable) {
              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#110D09] rounded-xl max-w-[270px] sm:max-w-[280px] w-full mx-auto flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300"
                >
                  {/* Compact Image */}
                  <Link href={`/product/${product.slug}`} className="relative aspect-[16/10] max-h-40 sm:max-h-44 bg-[#F8F5F0] overflow-hidden block group">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#110D09] text-white font-bold rounded-full shadow-xs">
                        Available Now • 50 ML
                      </span>
                    </div>
                  </Link>

                  {/* Details */}
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
                          ₹{product.fullPrice || 399}
                        </span>
                        <span className="text-[10px] text-[#110D09]/40 line-through font-mono">
                          ₹{product.standardPrice || 599}
                        </span>
                        <span className="text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200 font-mono font-bold rounded">
                          Save ₹200
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8E2D8]">
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-full btn-luxury-primary text-center block text-[11px] font-bold py-2 px-3 uppercase tracking-luxury rounded-lg shadow-2xs"
                      >
                        Add to Cart • ₹399
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
                className="bg-white border border-[#E8E2D8] rounded-xl max-w-[270px] sm:max-w-[280px] w-full mx-auto flex flex-col justify-between overflow-hidden shadow-2xs transition-all duration-300"
              >
                {/* Compact Image */}
                <div className="relative aspect-[16/10] max-h-40 sm:max-h-44 bg-[#F8F5F0] overflow-hidden block">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover opacity-90"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 bg-white/90 text-[#110D09] border border-[#D5CDC2] font-bold rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Just perfume name and Coming Soon */}
                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between items-center text-center space-y-2.5">
                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] text-[#8C6D42] font-mono uppercase tracking-wider font-semibold block">
                      {product.collection}
                    </span>
                    <h2 className="text-base sm:text-lg font-serif font-bold tracking-wide uppercase text-[#110D09] leading-tight">
                      {product.name}
                    </h2>
                  </div>

                  <div className="w-full pt-2 border-t border-[#E8E2D8]">
                    <div className="w-full py-2 px-3 bg-[#FAF8F5] border border-[#D5CDC2] text-center text-[10px] font-mono font-bold tracking-luxury uppercase text-[#110D09] rounded-lg">
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
