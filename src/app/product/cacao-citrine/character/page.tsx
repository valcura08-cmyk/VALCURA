'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Compass, Sparkles, Wind, Sun, Moon, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CacaoCitrineCharacterPage() {
  const { addToCart, setIsCartOpen } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('autumn');

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

  const seasonProfiles = {
    spring: {
      title: 'Spring Awakening',
      vibe: 'Solar Citrus Highlight',
      desc: 'The Calabrian bergamot and crisp mandarin sparkle in crisp morning spring air, delivering a sunny burst of optimism with light nut-milk softness.',
    },
    summer: {
      title: 'Summer Twilight',
      vibe: 'Golden Hour Radiance',
      desc: 'Effortless on warm skin. The solar citrus cut prevents heaviness even in humid twilight dinners, radiating an airy hazelnut aura.',
    },
    autumn: {
      title: 'Autumn Resonance (Ideal Season)',
      vibe: 'Praline & Toasted Cacao Harmony',
      desc: 'The crisp autumn breeze allows the heart notes of Piedmont hazelnut and roasted cacao shell to wrap around pulse points like a cashmere scarf.',
    },
    winter: {
      title: 'Winter Cocoon',
      vibe: 'Intimate Wool & Amber Trail',
      desc: 'Sprayed over tailored wool coats and collars, the cedarwood and silk musks create an enduring magnetic sanctuary from the cold.',
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
          <span className="text-[#18120E] font-medium font-mono uppercase">02 • The Character</span>
        </div>
        <Link
          href="/product/cacao-citrine"
          className="hover:text-[#8C6D42] transition-colors flex items-center space-x-1 font-mono text-[11px] uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product</span>
        </Link>
      </div>

      {/* Hero Opening with Velvet Spotlight Entrance Animation */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FAF6EE] border border-[#E8DFD3] text-[10px] tracking-luxury uppercase font-mono text-[#8C6D42]">
            <Compass className="w-3 h-3 text-[#8C6D42]" />
            <span>Scent Persona & Sensory Aura</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-wide uppercase text-[#18120E]">
            The Character
          </h1>
          <p className="text-sm sm:text-base text-[#18120E]/75 font-light leading-relaxed">
            Luminous, tactile, and quietly magnetic. Cacao Citrine avoids the loud, synthetic fanfare of ordinary commercial perfumes in favor of bespoke skin intimacy.
          </p>

          <div className="pt-2 flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="btn-luxury-primary py-3 px-6 text-xs font-semibold tracking-luxury uppercase flex items-center space-x-2 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAdded ? 'Added to Bag!' : 'Acquire Cacao Citrine • ₹450'}</span>
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

      {/* Persona Quadrant: 4 Pillars of Character */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FAF6EE] border border-[#E8DFD3] p-8 space-y-4 hover:border-[#18120E] transition-all">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D42] font-semibold">
              Dimension 01 • Olfactory Tension
            </span>
            <h3 className="text-2xl font-serif uppercase tracking-wide text-[#18120E]">
              Zest Meets Cream
            </h3>
            <p className="text-sm text-[#18120E]/75 font-light leading-relaxed">
              The soul of Cacao Citrine lies in its deliberate internal friction: high-pitch, crystalline Calabrian bergamot rubbing against warm, velvety Piedmont hazelnut cream. Rather than colliding, they create an electric harmony that feels alive on the skin.
            </p>
          </div>

          <div className="bg-[#FAF6EE] border border-[#E8DFD3] p-8 space-y-4 hover:border-[#18120E] transition-all">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D42] font-semibold">
              Dimension 02 • Sillage & Projection
            </span>
            <h3 className="text-2xl font-serif uppercase tracking-wide text-[#18120E]">
              Whisper Rather Than Shout
            </h3>
            <p className="text-sm text-[#18120E]/75 font-light leading-relaxed">
              Designed for private allure. During the first two hours, it projects within an arm’s length. As the day unfolds, it draws closer, becoming an irresistible skin-scent that only someone leaning in can fully experience.
            </p>
          </div>

          <div className="bg-[#FAF6EE] border border-[#E8DFD3] p-8 space-y-4 hover:border-[#18120E] transition-all">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D42] font-semibold">
              Dimension 03 • Skin Texture Feel
            </span>
            <h3 className="text-2xl font-serif uppercase tracking-wide text-[#18120E]">
              Cashmere Veil Sensation
            </h3>
            <p className="text-sm text-[#18120E]/75 font-light leading-relaxed">
              Formulated with pure botanical alcohols and cold-pressed botanical lipids, the dry-down never feels greasy or sticky. It settles as smooth as a brushed cashmere sweater resting against warm skin.
            </p>
          </div>

          <div className="bg-[#FAF6EE] border border-[#E8DFD3] p-8 space-y-4 hover:border-[#18120E] transition-all">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D42] font-semibold">
              Dimension 04 • Genderless Fluidity
            </span>
            <h3 className="text-2xl font-serif uppercase tracking-wide text-[#18120E]">
              The Unisex Chameleon
            </h3>
            <p className="text-sm text-[#18120E]/75 font-light leading-relaxed">
              On masculine pulse points, the dry roasted cedar and roasted cacao husks take center stage. On feminine skin, the sparkling mandarin peel and silky hazelnut milk radiate with luminous warmth.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Seasonality Matrix */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#FAF6EE] border border-[#E8DFD3] p-8 sm:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E8DFD3] gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D42] font-semibold block">
                Year-Round Expression
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif uppercase tracking-wide text-[#18120E] mt-1">
                Seasonal Versatility Matrix
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8C6D42]">
              Select a season to preview sensory behavior
            </span>
          </div>

          {/* Season Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['spring', 'summer', 'autumn', 'winter'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSeason(s)}
                className={`py-3 px-4 text-xs font-mono uppercase tracking-wider border transition-all ${
                  selectedSeason === s
                    ? 'bg-[#18120E] text-[#FAF7F2] border-[#18120E] shadow-sm'
                    : 'bg-[#FAF7F2] text-[#18120E] border-[#E8DFD3] hover:border-[#18120E]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Active Season Preview Box */}
          <div className="p-6 bg-[#FAF7F2] border border-[#E8DFD3] space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#8C6D42] font-semibold">
                {seasonProfiles[selectedSeason].vibe}
              </span>
              <span className="text-[10px] font-mono uppercase text-[#18120E]/60">
                Pulse-Point Behavior
              </span>
            </div>
            <h4 className="text-xl font-serif uppercase tracking-wide text-[#18120E]">
              {seasonProfiles[selectedSeason].title}
            </h4>
            <p className="text-sm text-[#18120E]/75 font-light leading-relaxed max-w-3xl">
              {seasonProfiles[selectedSeason].desc}
            </p>
          </div>
        </div>
      </section>

      {/* Switcher to Other Dimensions */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="border-t border-[#E8DFD3] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/product/cacao-citrine/composition"
            className="text-xs font-mono text-[#8C6D42] hover:text-[#18120E] flex items-center space-x-1 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>01 • The Composition</span>
          </Link>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="text-[#18120E]/50">Next Dimension:</span>
            <Link
              href="/product/cacao-citrine/inspiration"
              className="text-[#18120E] hover:text-[#8C6D42] font-semibold flex items-center space-x-1 uppercase tracking-wider"
            >
              <span>03 • The Inspiration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
