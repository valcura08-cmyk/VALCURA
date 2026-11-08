'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles, Feather, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CacaoCitrineInspirationPage() {
  const { addToCart, setIsCartOpen } = useCart();
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

  return (
    <div className="bg-[#FAF7F2] text-[#18120E] min-h-screen pb-24">
      {/* Editorial Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-[#18120E]/60 font-light flex items-center justify-between border-b border-[#E8DFD3]">
        <div className="flex items-center space-x-2">
          <Link href="/" className="hover:text-[#8C6D42] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/product/cacao-citrine" className="hover:text-[#8C6D42] transition-colors">Cacao Citrine</Link>
          <span>/</span>
          <span className="text-[#18120E] font-medium font-mono uppercase">03 • The Inspiration</span>
        </div>
        <Link
          href="/product/cacao-citrine"
          className="hover:text-[#8C6D42] transition-colors flex items-center space-x-1 font-mono text-[11px] uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product</span>
        </Link>
      </div>

      {/* Hero Opening with Editorial Curtain Split */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FAF6EE] border border-[#E8DFD3] text-[10px] tracking-luxury uppercase font-mono text-[#8C6D42]">
            <BookOpen className="w-3 h-3 text-[#8C6D42]" />
            <span>Atelier Lookbook & Botanical Journal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-wide uppercase text-[#18120E]">
            The Inspiration
          </h1>
          <p className="text-sm sm:text-base text-[#18120E]/75 font-light leading-relaxed">
            Mediterranean golden hour meets roasted artisanal beans. How a desire to dismantle conventional sugary gourmands birthed Cacao Citrine.
          </p>

          <div className="pt-2 flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="btn-luxury-primary py-3 px-6 text-xs font-semibold tracking-luxury uppercase flex items-center space-x-2 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAdded ? 'Added to Bag!' : 'Acquire Cacao Citrine • ₹399'}</span>
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

      {/* Editorial Double-Spread Magazine Feature */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#FAF6EE] border border-[#E8DFD3] overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Visual Storytelling */}
          <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full bg-[#F4ECE1] border-b lg:border-b-0 lg:border-r border-[#E8DFD3]">
            <Image
              src="/editorial/cacao-collection-citrus.jpg"
              alt="Artisanal Cacao Grove"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8D7C3]">
                Field Journal • Southern Italy
              </span>
              <p className="text-sm font-serif italic">
                “Citrus branches heavy with morning dew, brushing against burlap sacks of slow-roasted cocoa.”
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Essay */}
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 flex flex-col justify-center">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-luxury text-[#8C6D42] font-semibold">
                Chapter 01 • The Atelier Origin
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-wide text-[#18120E]">
                Indulgence Reimagined Through Modern Restraint
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#18120E]/80 font-light leading-relaxed">
              <p>
                For decades, the commercial gourmand fragrance category has been defined by high-fructose syrup notes: vanilla frosting, heavy caramel syrup, and suffocating ethyl maltol. They demand attention through overpowering sweetness that tires the senses after twenty minutes.
              </p>
              <p>
                VALCURA asked: What if gourmand didn’t mean dessert? What if it meant the tactile memory of breaking open an artisanal Piedmont hazelnut bar while standing in the shade of a Sicilian bergamot grove?
              </p>
              <p>
                The citrus doesn’t apologize for its sharpness; it cuts right through the hazelnut milk. The roasted cacao doesn’t taste like candy; it smells like warm earth, dry roasted shells, and dark cedar shavings.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E8DFD3] flex items-center space-x-3 text-xs text-[#8C6D42] font-mono">
              <Feather className="w-4 h-4 flex-shrink-0" />
              <span>Formulated by Master Perfumers in Grasse & Florence</span>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Pillars of Formulation Integrity */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono font-medium">
            Integrity Dossier
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif uppercase tracking-wide text-[#18120E]">
            Three Uncompromising Pillars
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF6EE] border border-[#E8DFD3] p-6 space-y-3 hover:border-[#18120E] transition-all">
            <span className="text-[10px] font-mono uppercase text-[#8C6D42] font-bold block">
              Pillar 01
            </span>
            <h4 className="text-lg font-serif uppercase tracking-wide text-[#18120E]">
              Pure Botanical Alcohol
            </h4>
            <p className="text-xs text-[#18120E]/75 font-light leading-relaxed">
              Fermented naturally from organic cane without petrochemical denaturants. This allows top bergamot and mandarin oils to bloom instantly upon atomization without the usual chemical sting.
            </p>
          </div>

          <div className="bg-[#FAF6EE] border border-[#E8DFD3] p-6 space-y-3 hover:border-[#18120E] transition-all">
            <span className="text-[10px] font-mono uppercase text-[#8C6D42] font-bold block">
              Pillar 02
            </span>
            <h4 className="text-lg font-serif uppercase tracking-wide text-[#18120E]">
              Roasted Bean Extraction
            </h4>
            <p className="text-xs text-[#18120E]/75 font-light leading-relaxed">
              Using supercritical CO2 extraction on gently roasted cacao rinds, capturing the authentic woodiness, toasted nuttiness, and dry earthy undertones that artificial aroma chemicals can never replicate.
            </p>
          </div>

          <div className="bg-[#FAF6EE] border border-[#E8DFD3] p-6 space-y-3 hover:border-[#18120E] transition-all">
            <span className="text-[10px] font-mono uppercase text-[#8C6D42] font-bold block">
              Pillar 03
            </span>
            <h4 className="text-lg font-serif uppercase tracking-wide text-[#18120E]">
              Genderless Architecture
            </h4>
            <p className="text-xs text-[#18120E]/75 font-light leading-relaxed">
              Formulated without stereotypical gendered signifiers. Balanced so that citrus vibrancy and warm woods flex seamlessly across all wearers, responding directly to individual body heat.
            </p>
          </div>
        </div>
      </section>

      {/* Switcher to Other Dimensions */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="border-t border-[#E8DFD3] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/product/cacao-citrine/character"
            className="text-xs font-mono text-[#8C6D42] hover:text-[#18120E] flex items-center space-x-1 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>02 • The Character</span>
          </Link>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="text-[#18120E]/50">Next Dimension:</span>
            <Link
              href="/product/cacao-citrine/experience"
              className="text-[#18120E] hover:text-[#8C6D42] font-semibold flex items-center space-x-1 uppercase tracking-wider"
            >
              <span>04 • The Experience</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
