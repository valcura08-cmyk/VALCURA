'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Clock, MapPin, Sparkles, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CacaoCitrineExperiencePage() {
  const { addToCart, setIsCartOpen } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(0);

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

  const experiences = [
    {
      id: 'coffee-date',
      slug: 'coffee-date',
      title: 'THE COFFEE DATE',
      time: 'Morning Ritual • 10:00 AM',
      location: 'Intimate Sunlit Café',
      image: '/moods/coffee-date.jpg',
      quote: '“Where conversations stretch across warm ceramic cups and effortless morning laughter.”',
      description:
        'An intimate café table bathed in morning sunlight. The fresh Calabrian bergamot cuts through the rich roasted notes of freshly ground espresso, while the heart of creamy chocolate and vanilla blends seamlessly with the café atmosphere. A fragrance that feels instantly approachable yet memorable.',
      applicationTip: 'Two sprays at collarbones and inside wrists before stepping out.',
    },
    {
      id: 'after-hours',
      slug: 'after-hours',
      time: 'Twilight & Evening • 8:00 PM',
      location: 'Candle-lit Dining Lounge',
      image: '/moods/after-hours.jpg',
      quote: '“Low candlelight, dark velvet jackets, and a pulse of quiet electricity.”',
      description:
        'When the sun has set and the city turns to amber light. On warm skin, Cacao Citrine’s roasted cacao shell and silk amber base notes deepen into a quietly seductive skin-scent. Perfect for close conversations, cocktails, and midnight walks.',
      applicationTip: 'One spray behind each ear and one onto the back of the neck.',
    },
    {
      id: 'little-indulgence',
      slug: 'little-indulgence',
      time: 'Afternoon Leisure • 3:30 PM',
      location: 'Artisanal Pâtisserie Corner',
      image: '/moods/little-indulgence.jpg',
      quote: '“A reminder that pleasure does not have to be earned—it only has to be savored.”',
      description:
        'A moment carved out entirely for yourself. Chocolate pastries dusted with fine cocoa powder, a quiet terrace, and no rush to be anywhere. The sweet chocolate, vanilla, and mandarin aroma creates a personal sanctuary of quiet tactile luxury.',
      applicationTip: 'Mist onto chest and forearms for an enveloping personal cocoon.',
    },
    {
      id: 'slow-moments',
      slug: 'slow-moments',
      time: 'Unhurried Afternoon • 4:30 PM',
      location: 'Sun-warmed Reading Nook',
      image: '/moods/slow-moments.jpg',
      quote: '“Turning pages while the afternoon shadows slowly lengthen across the floor.”',
      description:
        'Curled in an armchair with an open book, wearing an oversized cashmere knit. The dry-down of cedarwood and aerated musk feels like clean sheets dried in sun-warmed mountain air, grounding you in peaceful stillness.',
      applicationTip: 'Lightly mist over clothing or a scarf for lasting ambient diffusion.',
    },
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#18120E] min-h-screen pb-24">
      {/* Editorial Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-[#18120E]/60 font-light flex items-center justify-between border-b border-[#E8DFD3]">
        <div className="flex items-center space-x-2">
          <Link href="/" className="hover:text-[#8C6D42] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/product/cacao-citrine" className="hover:text-[#8C6D42] transition-colors">Cacao Citrine</Link>
          <span>/</span>
          <span className="text-[#18120E] font-medium font-mono uppercase">04 • The Experience</span>
        </div>
        <Link
          href="/product/cacao-citrine"
          className="hover:text-[#8C6D42] transition-colors flex items-center space-x-1 font-mono text-[11px] uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product</span>
        </Link>
      </div>

      {/* Hero Header with Cinematic Entrance Animation */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FAF6EE] border border-[#E8DFD3] text-[10px] tracking-luxury uppercase font-mono text-[#8C6D42]">
            <Sparkles className="w-3 h-3 text-[#8C6D42]" />
            <span>Atmospheric Lifestyle Canvas</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-wide uppercase text-[#18120E]">
            The Experience
          </h1>
          <p className="text-sm sm:text-base text-[#18120E]/75 font-light leading-relaxed">
            Perfumery is not merely molecules; it is an atmospheric memory. Explore the four signature life settings where Cacao Citrine unfolds with effortless distinction.
          </p>

          <div className="pt-2 flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="btn-luxury-primary py-3 px-6 text-xs font-semibold tracking-luxury uppercase flex items-center space-x-2 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAdded ? 'Added to Cart!' : 'Add to Cart • ₹399'}</span>
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

      {/* Interactive Cinematic Mood Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Horizontal Mood Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {experiences.map((exp, idx) => (
            <button
              key={exp.id}
              type="button"
              onClick={() => setSelectedMoodIndex(idx)}
              className={`p-3 sm:p-4 text-left border transition-all duration-300 flex flex-col justify-between space-y-3 ${
                selectedMoodIndex === idx
                  ? 'bg-[#18120E] text-[#FAF7F2] border-[#18120E] shadow-md scale-[1.02]'
                  : 'bg-[#FAF6EE] text-[#18120E] border-[#E8DFD3] hover:border-[#8C6D42]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-mono uppercase tracking-widest ${
                  selectedMoodIndex === idx ? 'text-[#C9A96E]' : 'text-[#8C6D42]'
                }`}>
                  0{idx + 1}
                </span>
                <span className={`text-[9px] font-mono ${
                  selectedMoodIndex === idx ? 'text-[#FAF7F2]/70' : 'text-[#18120E]/50'
                }`}>
                  Active
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-serif uppercase tracking-wider line-clamp-1">
                {exp.title}
              </h4>
              <span className={`text-[9px] font-mono truncate ${
                selectedMoodIndex === idx ? 'text-[#FAF7F2]/70' : 'text-[#18120E]/50'
              }`}>
                {exp.time.split('•')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Mood Cinematic Deep-Dive Split */}
        <div className="bg-[#FAF6EE] border border-[#E8DFD3] overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 animate-fadeIn">
          {/* Mood Image Frame */}
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-auto min-h-[350px] lg:min-h-[480px] bg-[#F4ECE1]">
            <Image
              src={experiences[selectedMoodIndex].image}
              alt={experiences[selectedMoodIndex].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 border border-[#E8DFD3] text-[10px] tracking-widest uppercase font-mono text-[#18120E]">
              Atmosphere 0{selectedMoodIndex + 1}
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-sm p-4 text-white">
              <p className="text-xs sm:text-sm font-serif italic">
                {experiences[selectedMoodIndex].quote}
              </p>
            </div>
          </div>

          {/* Mood Editorial Details */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-xs text-[#8C6D42] font-mono">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{experiences[selectedMoodIndex].time}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{experiences[selectedMoodIndex].location}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-wide text-[#18120E]">
                {experiences[selectedMoodIndex].title}
              </h2>

              <p className="text-xs sm:text-sm text-[#18120E]/80 font-light leading-relaxed">
                {experiences[selectedMoodIndex].description}
              </p>

              <div className="p-4 bg-[#FAF7F2] border border-[#E8DFD3] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8C6D42] font-semibold block">
                  Application Guide
                </span>
                <p className="text-xs text-[#18120E]/75 font-light">
                  {experiences[selectedMoodIndex].applicationTip}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DFD3] flex items-center justify-between">
              <Link
                href={`/moods/${experiences[selectedMoodIndex].slug}`}
                className="text-xs font-mono uppercase tracking-wider text-[#8C6D42] hover:text-[#18120E] flex items-center space-x-1 font-semibold"
              >
                <span>View Full Mood Journal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleQuickAdd}
                className="btn-luxury-primary py-2.5 px-4 text-xs font-semibold uppercase tracking-luxury"
              >
                Add Bottle to Bag
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Switcher to Other Dimensions */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="border-t border-[#E8DFD3] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/product/cacao-citrine/inspiration"
            className="text-xs font-mono text-[#8C6D42] hover:text-[#18120E] flex items-center space-x-1 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>03 • The Inspiration</span>
          </Link>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="text-[#18120E]/50">Restart Cycle:</span>
            <Link
              href="/product/cacao-citrine/composition"
              className="text-[#18120E] hover:text-[#8C6D42] font-semibold flex items-center space-x-1 uppercase tracking-wider"
            >
              <span>01 • The Composition</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
