import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '@/lib/db';

export default function ShopAllFragrancesPage() {
  const db = getDb();
  const products = db.products;

  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Editorial Front Banner */}
      <section className="relative w-full h-[300px] sm:h-[380px] lg:h-[440px] bg-[#110D09] overflow-hidden">
        <Image
          src="/editorial/explore-by-scents-banner.jpg"
          alt="Explore By Scents - VALCURA Atelier"
          fill
          className="object-cover object-[center_15%] opacity-85"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <div className="max-w-2xl mx-auto space-y-2.5 text-white">
            <span className="text-[10px] tracking-widest uppercase text-[#D5CDC2] font-mono font-bold block">
              Atelier Fragrance Catalogue
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-[#FAF7F2]">
              Explore By Scents
            </h1>
            <p className="text-xs sm:text-sm text-white/85 font-light max-w-lg mx-auto leading-relaxed">
              Discover our handcrafted 50 ML Eau de Parfum creations, olfactory pyramids, and second-skin sillage.
            </p>
          </div>
        </div>
      </section>

      {/* Catalogue Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E8E2D8] text-xs text-[#110D09]/60 font-mono">
          <span>Showing {products.length} Fragrance Profiles</span>
          <span>Collection: Cacao Edition</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => {
            const isAvailable = product.id === 'cacao-citrine';

            if (isAvailable) {
              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#110D09] flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Compact Image */}
                  <Link href={`/product/${product.slug}`} className="relative aspect-[4/3] max-h-56 bg-[#F8F5F0] overflow-hidden block group">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] tracking-luxury uppercase px-2.5 py-1 bg-[#110D09] text-white font-bold">
                        Available Now • 50 ML
                      </span>
                    </div>
                  </Link>

                  {/* Details */}
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
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-mono font-bold">
                          Save ₹100
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E8E2D8]">
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-full btn-luxury-primary text-center block text-xs font-bold py-3 uppercase tracking-luxury"
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
                className="bg-white border border-[#E8E2D8] flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-300"
              >
                {/* Compact Image */}
                <div className="relative aspect-[4/3] max-h-56 bg-[#F8F5F0] overflow-hidden block">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover opacity-90"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 bg-white/90 text-[#110D09] border border-[#D5CDC2] font-bold">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Just perfume name and Coming Soon */}
                <div className="p-5 flex-1 flex flex-col justify-between items-center text-center space-y-6">
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] text-[#8C6D42] font-mono uppercase tracking-wider font-semibold block">
                      {product.collection}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wide uppercase text-[#110D09]">
                      {product.name}
                    </h2>
                  </div>

                  <div className="w-full pt-3 border-t border-[#E8E2D8]">
                    <div className="w-full py-3 px-4 bg-[#FAF8F5] border border-[#D5CDC2] text-center text-xs font-mono font-bold tracking-luxury uppercase text-[#110D09]">
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
