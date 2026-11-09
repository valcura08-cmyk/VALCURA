import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '@/lib/db';

export const metadata = {
  title: 'Cacaoveil | VALCURA Atelier',
  description:
    'Explore the 3 fragrances in our inaugural Cacaoveil Collection: Cacao Citrine, Silken Sambac, and Roasted Zest.',
};

export default function CacaoveilCollectionPage() {
  const db = getDb();
  const products = db.products.filter(
    (p) =>
      p.collection === 'Cacaoveil' ||
      p.collection === 'Cacao Collection' ||
      p.collection?.toLowerCase().includes('cacao')
  );

  return (
    <div className="bg-[#FAF7F2] text-[#110D09] min-h-screen pb-10 sm:pb-14">
      {/* Editorial Collection Header Banner */}
      <section className="relative w-full overflow-hidden border-b border-[#E8DFD3]">
        <div className="relative aspect-[21/9] sm:aspect-[16/5] min-h-[160px] sm:min-h-[220px] w-full">
          <Image
            src="/editorial/cacao-collection-citrus.jpg"
            alt="Cacaoveil by VALCURA"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

          {/* Centered Editorial Typography */}
          <div className="absolute inset-0 flex flex-col justify-end pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="max-w-2xl mx-auto space-y-1">
              <span className="text-[9px] tracking-luxury uppercase text-[#E8D7C3] font-mono font-bold block">
                Inaugural Trilogy
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-wide uppercase text-white drop-shadow-md">
                Cacaoveil
              </h1>
              <p className="text-[11px] sm:text-xs text-white/90 font-light max-w-lg mx-auto leading-relaxed drop-shadow-sm">
                Where rich hazelnut comfort and roasted cacao depth meet luminous citrus vitality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ONLY THE FRAGRANCES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
        <div className="flex items-center justify-between pb-2.5 mb-4 border-b border-[#E8DFD3] text-xs font-mono text-[#110D09]/60">
          <span>Showing {products.length} Fragrances</span>
          <span className="font-semibold text-[#8C6D42]">The Cacaoveil Trilogy • 50 ML</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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
                          ₹{product.fullPrice || 399}
                        </span>
                        <span className="text-[10px] text-[#110D09]/40 line-through font-mono">
                          ₹599
                        </span>
                        <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Save ₹200
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8DFD3]/80 space-y-2">
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-full py-2 bg-[#110D09] hover:bg-[#8C6D42] text-[#FAF7F2] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all duration-200 block text-center shadow-xs"
                      >
                        Add to Cart • ₹399
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            // Blurred Teaser Flacons (Silken Sambac / Roasted Zest)
            return (
              <div
                key={product.id}
                className="bg-[#FAF6EE] border border-[#E8DFD3] rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs hover:border-[#110D09] transition-all duration-300"
              >
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
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 bg-amber-900 text-white font-bold rounded-full shadow-xs">
                      Formulation in Progress
                    </span>
                  </div>
                </Link>

                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-0.5 text-center">
                    <span className="text-[9px] text-[#8C6D42] font-mono uppercase tracking-wider font-semibold block">
                      {product.category}
                    </span>
                    <Link href={`/product/${product.slug}`}>
                      <h2 className="text-base sm:text-lg font-serif font-bold tracking-wide uppercase text-[#110D09] hover:text-[#8C6D42] transition-colors leading-tight">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="text-[11px] text-[#110D09]/60 font-light mt-1">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E8DFD3]/80">
                    <Link
                      href={`/product/${product.slug}`}
                      className="w-full py-2 bg-[#F3EFE8] hover:bg-[#110D09] hover:text-white text-[#110D09] text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 block text-center"
                    >
                      View Private Formulation →
                    </Link>
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
