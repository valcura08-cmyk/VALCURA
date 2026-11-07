'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Layers, Droplets, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CacaoCitrineCompositionPage() {
  const { addToCart, setIsCartOpen } = useCart();
  const [activePhase, setActivePhase] = useState<'top' | 'heart' | 'base'>('top');
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = () => {
    addToCart(
      {
        productId: 'cacao-citrine',
        name: 'Cacao Citrine',
        slug: 'cacao-citrine',
        image: '/products/cacao-citrine-1.jpg',
        category: 'Unisex',
        volume: '50 ML',
        quantity: 1,
        paymentPlan: 'full',
      },
      'full'
    );
    setIsAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const phases = {
    top: {
      name: 'Top Notes • The Solar Awakening',
      timeline: 'Minutes 00 to 30',
      intensity: 'High Frequency Sparkle',
      description:
        'A burst of radiant morning energy. Cold-pressed Italian bergamot and sun-ripened mandarin peel deliver an immediate crystalline vitality that cuts cleanly through air without synthetic alcohol sharpness.',
      notes: [
        { name: 'Sun-drenched Bergamot', origin: 'Calabria, Italy', profile: 'Sparkling, brisk, aromatic peel' },
        { name: 'Crisp Mandarin Peel Accord', origin: 'Sicily', profile: 'Juicy, bright, sun-kissed sweetness' },
        { name: 'Crystalline Morning Air', origin: 'Atelier Solar Accord', profile: 'Aerated, breezy, uplifting ozone' },
      ],
      sensoryColor: 'from-[#FFF7ED] to-[#FEF3C7]',
      borderColor: 'border-amber-300',
    },
    heart: {
      name: 'Heart Notes • Velveteen Comfort',
      timeline: 'Minutes 30 to Hours 03',
      intensity: 'Opulent Cream Core',
      description:
        'As the brisk citrus veil warms into pulse points, it reveals a rich, comforting Hazelnut milk praline core. Delicately creamy, tactile, and comforting without tipping into sickly sugariness.',
      notes: [
        { name: 'Roasted Hazelnut Cream', origin: 'Piedmont, Italy', profile: 'Velvety nut milk, toasted butteriness' },
        { name: 'Steamed Almond Milk', origin: 'Organic Infusion', profile: 'Silky, soothing, warm second skin' },
        { name: 'Cocoa Butter Emulsion', origin: 'Cold-Pressed Absolute', profile: 'Creamy tactile softness, roundness' },
      ],
      sensoryColor: 'from-[#FAF6EE] to-[#EFE7DA]',
      borderColor: 'border-[#8C6D42]',
    },
    base: {
      name: 'Base Notes • The Enduring Sillage',
      timeline: 'Hours 03 to 10+',
      intensity: 'Intimate Magnetic Skin-scent',
      description:
        'The deep, unhurried foundation. Artisanal roasted cacao bean shells and sun-warmed cedarwood anchor the fragrance, cushioned by aerated silk musks that linger close to the skin like a cashmere knit.',
      notes: [
        { name: 'Roasted Cacao Shell Absolute', origin: 'Single-Estate Criollo Beans', profile: 'Warm roasted rind, dark cocoa husk' },
        { name: 'Sun-warmed Atlas Cedar', origin: 'Morocco', profile: 'Dry structural wood, grounding clarity' },
        { name: 'Aerated Silk Musks & Amber', origin: 'Clean Molecular Blend', profile: 'Sensual warmth, second-skin longevity' },
      ],
      sensoryColor: 'from-[#EFE7DA] to-[#DFD4C2]',
      borderColor: 'border-[#18120E]',
    },
  };

  return (
    <div className="bg-[#FAF7F2] text-[#18120E] min-h-screen pb-24">
      {/* Editorial Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-[#18120E]/60 font-light flex items-center justify-between border-b border-[#E8DFD3]">
        <div className="flex items-center space-x-2">
          <Link href="/" className="hover:text-[#8C6D42] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/product/cacao-citrine" className="hover:text-[#8C6D42] transition-colors">Cacao Citrine</Link>
          <span>/</span>
          <span className="text-[#18120E] font-medium font-mono uppercase">01 • The Composition</span>
        </div>
        <Link
          href="/product/cacao-citrine"
          className="hover:text-[#8C6D42] transition-colors flex items-center space-x-1 font-mono text-[11px] uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product</span>
        </Link>
      </div>

      {/* Hero Opening Header with Architectural Entrance Animation */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FAF6EE] border border-[#E8DFD3] text-[10px] tracking-luxury uppercase font-mono text-[#8C6D42]">
            <Sparkles className="w-3 h-3 text-[#8C6D42]" />
            <span>Formulation Architectural Dossier</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-wide uppercase text-[#18120E]">
            The Composition
          </h1>
          <p className="text-sm sm:text-base text-[#18120E]/75 font-light leading-relaxed">
            A three-tier olfactory pyramid engineered to balance high-voltage citrus freshness with deep, tactile gourmand warmth.
          </p>

          <div className="pt-2 flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="btn-luxury-primary py-3 px-6 text-xs font-semibold tracking-luxury uppercase flex items-center space-x-2 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAdded ? 'Added to Bag!' : 'Acquire Cacao Citrine • ₹499'}</span>
            </button>
            <Link
              href="/product/cacao-citrine"
              className="btn-luxury-outline py-3 px-6 text-xs uppercase tracking-luxury font-mono"
            >
              View Bottle Hero
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive 3-Tier Olfactory Pyramid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tier Selector Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
          {(['top', 'heart', 'base'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setActivePhase(tier)}
              className={`p-4 sm:p-6 text-center border transition-all duration-300 flex flex-col items-center justify-center space-y-2 ${
                activePhase === tier
                  ? 'bg-[#18120E] text-[#FAF7F2] border-[#18120E] shadow-md scale-[1.02]'
                  : 'bg-[#FAF6EE] text-[#18120E] border-[#E8DFD3] hover:border-[#8C6D42]'
              }`}
            >
              <span className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-widest ${
                activePhase === tier ? 'text-[#C9A96E]' : 'text-[#8C6D42]'
              }`}>
                Phase {tier === 'top' ? '01' : tier === 'heart' ? '02' : '03'}
              </span>
              <h3 className="text-xs sm:text-base font-serif uppercase tracking-wider">
                {tier === 'top' ? 'Top Notes' : tier === 'heart' ? 'Heart Notes' : 'Base Notes'}
              </h3>
              <span className={`text-[9px] sm:text-[10px] font-mono ${
                activePhase === tier ? 'text-[#FAF7F2]/70' : 'text-[#18120E]/50'
              }`}>
                {phases[tier].timeline}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Tier Deep-Dive Panel */}
        <div className="bg-[#FAF6EE] border border-[#E8DFD3] p-6 sm:p-10 shadow-sm space-y-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E8DFD3] gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-luxury text-[#8C6D42] font-semibold block">
                {phases[activePhase].intensity}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-wide text-[#18120E] mt-1">
                {phases[activePhase].name}
              </h2>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#FAF7F2] border border-[#E8DFD3] font-mono text-xs text-[#18120E]">
              <Layers className="w-3.5 h-3.5 text-[#8C6D42]" />
              <span>Longevity Arc: {phases[activePhase].timeline}</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#18120E]/80 font-light leading-relaxed max-w-3xl">
            {phases[activePhase].description}
          </p>

          {/* Notes Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
            {phases[activePhase].notes.map((note) => (
              <div
                key={note.name}
                className="bg-[#FAF7F2] border border-[#E8DFD3] p-5 space-y-3 hover:border-[#18120E] transition-all"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C6D42]">
                    {note.origin}
                  </span>
                  <h4 className="text-base font-serif text-[#18120E] uppercase">
                    {note.name}
                  </h4>
                </div>
                <p className="text-xs text-[#18120E]/70 font-light">
                  {note.profile}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulation Purity & Technical Specifications */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#18120E] text-[#FAF7F2] p-8 sm:p-12 border border-[#18120E] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] tracking-luxury uppercase text-[#C9A96E] font-mono block">
              Pure Technical Standards
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif uppercase tracking-wide">
              Atelier Purity & Concentration Matrix
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 text-center">
            <div className="p-4 bg-white/5 border border-white/10 space-y-1">
              <span className="text-2xl font-serif text-[#C9A96E]">20%</span>
              <p className="text-xs font-mono uppercase text-[#FAF7F2]">Eau de Parfum</p>
              <p className="text-[10px] text-[#FAF7F2]/60 font-light">High fragrance oil maceration</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 space-y-1">
              <span className="text-2xl font-serif text-[#C9A96E]">100%</span>
              <p className="text-xs font-mono uppercase text-[#FAF7F2]">Organic Cane Base</p>
              <p className="text-[10px] text-[#FAF7F2]/60 font-light">Zero synthetic petrochemicals</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 space-y-1">
              <span className="text-2xl font-serif text-[#C9A96E]">10 Hrs</span>
              <p className="text-xs font-mono uppercase text-[#FAF7F2]">Skin Longevity</p>
              <p className="text-[10px] text-[#FAF7F2]/60 font-light">Enduring hazelnut musk trail</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 space-y-1">
              <span className="text-2xl font-serif text-[#C9A96E]">Clean</span>
              <p className="text-xs font-mono uppercase text-[#FAF7F2]">Vegan & Cruelty Free</p>
              <p className="text-[10px] text-[#FAF7F2]/60 font-light">Ethically harvested cacao rinds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Switcher to Other Dimensions */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="border-t border-[#E8DFD3] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/product/cacao-citrine"
            className="text-xs font-mono text-[#8C6D42] hover:text-[#18120E] flex items-center space-x-1 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Cacao Citrine</span>
          </Link>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="text-[#18120E]/50">Next Dimension:</span>
            <Link
              href="/product/cacao-citrine/character"
              className="text-[#18120E] hover:text-[#8C6D42] font-semibold flex items-center space-x-1 uppercase tracking-wider"
            >
              <span>02 • The Character</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
