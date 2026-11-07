'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check, ArrowRight } from 'lucide-react';
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {products.map((product) => {
            const isCacaoCitrine = product.id === 'cacao-citrine';
            const price = 499;
            const mrp = 599;

            if (isCacaoCitrine) {
              return (
                <div
                  key={product.id}
                  className="bg-[#FAF6EE] border border-[#18120E] flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Smaller compact image for single-view glance */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative aspect-[4/3] max-h-56 bg-[#F4ECE1] overflow-hidden block group"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#18120E] text-[#FAF7F2] font-bold shadow-sm">
                        Available Now • 50 ML
                      </span>
                    </div>
                  </Link>

                  {/* Clean details - No extra clutter text */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D42] font-semibold block">
                        Unisex • Eau de Parfum
                      </span>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-wide uppercase text-[#110D09] hover:text-[#8C6D42] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Pricing & Quantity Selector */}
                    <div className="pt-2 border-t border-[#E8DFD3] space-y-3">
                      <div className="flex items-baseline justify-center space-x-3">
                        <span className="text-2xl font-serif font-bold text-[#110D09]">
                          ₹{price}
                        </span>
                        <span className="text-xs text-[#110D09]/40 line-through font-mono">
                          ₹{mrp}
                        </span>
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                          Save ₹100
                        </span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between text-xs px-1">
                        <span className="font-mono text-[#110D09]/70 font-semibold uppercase text-[10px]">
                          Quantity:
                        </span>
                        <div className="inline-flex items-center border border-[#D5CDC2] bg-[#FAF7F2]">
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="px-2.5 py-1 text-xs hover:text-[#8C6D42] transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-mono font-bold text-xs">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => q + 1)}
                            className="px-2.5 py-1 text-xs hover:text-[#8C6D42] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Add to Bag Button */}
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full btn-luxury-primary py-3 text-xs font-bold tracking-luxury uppercase flex items-center justify-center space-x-2 shadow-sm"
                      >
                        {addedSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Added to Bag!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart • ₹{price * quantity}</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/product/${product.slug}`}
                        className="w-full text-center block text-[10px] tracking-luxury uppercase text-[#110D09]/70 hover:text-[#110D09] pt-0.5 transition-colors font-bold font-mono"
                      >
                        Discover Cacao Citrine →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            // COMING SOON PERFUMES (Silken Sambac & Roasted Zest)
            // User requested: "make these two perfumes in comming soon nothing else just our perfume name should be there"
            return (
              <div
                key={product.id}
                className="bg-[#FAF6EE] border border-[#E8DFD3] flex flex-col justify-between overflow-hidden shadow-sm hover:border-[#110D09]/40 transition-all duration-300"
              >
                {/* Smaller compact image for single-view glance */}
                <div className="relative aspect-[4/3] max-h-56 bg-[#F4ECE1] overflow-hidden block">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover opacity-90"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#FAF7F2]/95 text-[#110D09] border border-[#D5CDC2] font-bold">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Just perfume name and Coming Soon - NO EXTRA CLUTTER TEXT */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between items-center text-center space-y-6">
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D42] font-semibold block">
                      {product.collection}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-wide uppercase text-[#110D09]">
                      {product.name}
                    </h3>
                  </div>

                  {/* Clean Coming Soon Banner */}
                  <div className="w-full pt-4 border-t border-[#E8DFD3]">
                    <div className="w-full py-3 px-4 bg-[#FAF7F2] border border-[#D5CDC2] text-center text-xs font-mono font-bold tracking-luxury uppercase text-[#110D09]">
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
