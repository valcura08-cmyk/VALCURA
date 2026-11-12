'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check, ArrowRight, Bell } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/db';

interface Props {
  products: Product[];
}

export default function ExploreByScents({ products }: Props) {
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const cacaoCitrine = products.find((p) => p.id === 'cacao-citrine');

  const handleAddToCart = () => {
    if (!cacaoCitrine) return;
    addToCart(
      {
        productId: cacaoCitrine.id,
        name: cacaoCitrine.name,
        slug: cacaoCitrine.slug,
        image: cacaoCitrine.images[0] || '/products/cacao-citrine-1.jpg',
        category: cacaoCitrine.category,
        volume: cacaoCitrine.volume,
        quantity: quantity,
        paymentPlan: 'full',
      },
      'full'
    );

    setAddedSuccess(true);
    setIsCartOpen(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <section id="explore-by-scents" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] border-t border-[#E8DFD3]">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold block">
            Fragrance Catalogue
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-wide text-[#110D09] uppercase">
            Explore By Scents
          </h2>
        </div>

        {/* 3 Fragrances Grid - Compact in one view ("one see") */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 max-w-4xl mx-auto items-stretch">
          {products.map((product) => {
            const isCacaoCitrine = product.id === 'cacao-citrine';
            const price = 399;
            const mrp = 599;

            if (isCacaoCitrine) {
              return (
                <div
                  key={product.id}
                  className="bg-[#FAF6EE] border border-[#18120E] rounded-xl max-w-[270px] sm:max-w-[280px] w-full mx-auto flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300"
                >
                  {/* Smaller compact image for single-view glance */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative aspect-[16/10] max-h-40 sm:max-h-44 bg-[#F4ECE1] overflow-hidden block group"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 bg-amber-950 text-amber-200 border border-amber-600/40 font-bold rounded-full shadow-xs">
                        Current Slot Sold Out • 50 ML
                      </span>
                    </div>
                  </Link>

                  {/* Clean details */}
                  <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                    <div className="space-y-0.5 text-center">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C6D42] font-semibold block">
                        Unisex • Eau de Parfum
                      </span>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="text-base sm:text-lg font-serif font-bold tracking-wide uppercase text-[#110D09] hover:text-[#8C6D42] transition-colors leading-tight">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Pricing & Next Slot Button */}
                    <div className="pt-2 border-t border-[#E8DFD3] space-y-2">
                      <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-lg sm:text-xl font-serif font-bold text-[#110D09]">
                          ₹{price}
                        </span>
                        <span className="text-[10px] text-[#110D09]/40 line-through font-mono">
                          MRP ₹{mrp}
                        </span>
                        <span className="text-[9px] font-mono font-bold uppercase text-amber-900 bg-amber-50 px-1.5 py-0.2 border border-amber-300 rounded">
                          Slot Full
                        </span>
                      </div>

                      <Link
                        href={`/product/${product.slug}#notify`}
                        className="w-full btn-luxury-primary py-2 px-3 text-[11px] font-bold tracking-luxury uppercase flex items-center justify-center space-x-1.5 rounded-lg shadow-2xs"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Notify Me For Next Slot →</span>
                      </Link>

                      <Link
                        href={`/product/${product.slug}`}
                        className="w-full text-center block text-[9px] tracking-luxury uppercase text-[#110D09]/70 hover:text-[#110D09] pt-0.5 transition-colors font-bold font-mono"
                      >
                        View Fragrance Details →
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
                className="bg-[#FAF6EE] border border-[#E8DFD3] rounded-xl max-w-[270px] sm:max-w-[280px] w-full mx-auto flex flex-col justify-between overflow-hidden shadow-2xs hover:border-[#110D09]/40 transition-all duration-300"
              >
                {/* Smaller compact image for single-view glance */}
                <div className="relative aspect-[16/10] max-h-40 sm:max-h-44 bg-[#F4ECE1] overflow-hidden block">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover opacity-90"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#FAF7F2]/95 text-[#110D09] border border-[#D5CDC2] rounded-full font-bold">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Just perfume name and Coming Soon - NO EXTRA CLUTTER TEXT */}
                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between items-center text-center space-y-2.5">
                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C6D42] font-semibold block">
                      {product.collection}
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-bold tracking-wide uppercase text-[#110D09] leading-tight">
                      {product.name}
                    </h3>
                  </div>

                  {/* Clean Coming Soon Banner */}
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
      </div>
    </section>
  );
}
