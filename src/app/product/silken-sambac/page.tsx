import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function SilkenSambacPage() {
  return (
    <div className="bg-[#FAF7F2] text-[#110D09] min-h-screen pb-16">
      {/* Editorial Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 text-xs text-[#110D09]/60 font-light flex items-center justify-between border-b border-[#E8DFD3]">
        <div className="flex items-center space-x-2">
          <Link href="/" className="hover:text-[#8C6D42] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/collections/cacaoaveil" className="hover:text-[#8C6D42] transition-colors">
            Cacaoaveil
          </Link>
          <span>/</span>
          <span className="text-[#110D09] font-bold font-mono uppercase">Silken Sambac</span>
        </div>
        <Link
          href="/"
          className="hover:text-[#8C6D42] transition-colors flex items-center space-x-1 font-mono text-[11px] uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Compact Single View Card */}
      <div className="max-w-2xl mx-auto px-4 pt-10 sm:pt-14">
        <div className="bg-[#FAF6EE] border border-[#E8DFD3] p-6 sm:p-10 text-center space-y-6 shadow-sm">
          
          {/* Compact Product Image */}
          <div className="relative w-56 sm:w-64 aspect-square mx-auto bg-[#F4ECE1] border border-[#E8DFD3] overflow-hidden shadow-sm">
            <Image
              src="/products/silken-sambac-teaser.jpg"
              alt="Silken Sambac"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-2.5 left-2.5">
              <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#FAF7F2]/95 text-[#110D09] border border-[#D5CDC2] font-bold">
                For Her
              </span>
            </div>
          </div>

          {/* Just perfume name and Coming Soon */}
          <div className="space-y-3">
            <span className="text-[10px] tracking-luxury uppercase text-[#8C6D42] font-mono font-bold block">
              Cacaoaveil
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-wide uppercase text-[#110D09]">
              Silken Sambac
            </h1>

            <div className="inline-block py-2 px-6 bg-[#FAF7F2] border border-[#D5CDC2] text-xs tracking-luxury uppercase text-[#110D09] font-mono font-bold shadow-sm">
              Coming Soon
            </div>
          </div>

          <div className="pt-6 border-t border-[#E8DFD3] flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/product/cacao-citrine"
              className="btn-luxury-primary text-xs tracking-luxury uppercase py-3 px-6 font-bold"
            >
              Discover Cacao Citrine
            </Link>
            <Link
              href="/collections/cacaoaveil"
              className="btn-luxury-outline text-xs tracking-luxury uppercase py-3 px-6 font-bold"
            >
              View Cacaoaveil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
