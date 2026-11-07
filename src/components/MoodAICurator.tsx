'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, Check, Compass, RefreshCw, ChevronRight } from 'lucide-react';
import { Product, Mood } from '@/lib/db';

interface Props {
  mood: Mood;
  curatedProducts: Product[];
}

type Step = 'initial' | 'q1' | 'q2' | 'thinking' | 'result' | 'all';

export default function MoodAICurator({ mood, curatedProducts }: Props) {
  const [step, setStep] = useState<Step>('initial');
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
  const [aiRationale, setAiRationale] = useState<string>('');

  const cacaoCitrine = curatedProducts.find((p) => p.id === 'cacao-citrine') || curatedProducts[0];

  const handleStartConsultation = () => {
    setStep('q1');
  };

  const handleShowAll = () => {
    setStep('all');
  };

  const handleAnswerQ1 = (answer: string) => {
    setQ1Answer(answer);
    setStep('q2');
  };

  const handleAnswerQ2 = (answer: string) => {
    setQ2Answer(answer);
    setStep('thinking');

    setTimeout(() => {
      // Determine recommendation logic
      let matched = cacaoCitrine;
      let rationale = '';

      if (q1Answer?.includes('citrus') || answer.includes('daily') || answer.includes('sun')) {
        matched = curatedProducts.find((p) => p.id === 'cacao-citrine') || cacaoCitrine;
        rationale = `Based on your love for bright solar radiance and creamy hazelnut depth, Cacao Citrine is your bespoke signature. Its 20% Eau de Parfum concentration delivers effortless elegance from morning into evening.`;
      } else if (q1Answer?.includes('smoky') || answer.includes('evening') || answer.includes('bold')) {
        const rz = curatedProducts.find((p) => p.id === 'roasted-zest');
        matched = rz || cacaoCitrine;
        rationale = rz
          ? `For your preference for smoky roasted cocoa nibs and dark woods, Roasted Zest will be your quintessential match upon release. In the meantime, Cacao Citrine shares this rich cocoa DNA with fresh citrus vitality.`
          : `For your evening elegance and bold presence, Cacao Citrine settles into a magnetic roasted cacao and cashmere musk base.`;
      } else {
        const ss = curatedProducts.find((p) => p.id === 'silken-sambac');
        matched = ss || cacaoCitrine;
        rationale = ss
          ? `Your affinity for dewy white florals and cocooning tranquility aligns with Silken Sambac. You can explore Cacao Citrine today for an equally tactile, comforting hazelnut skin scent.`
          : `Cacao Citrine softens into a velvety skin-scent that envelops you in personal serenity.`;
      }

      setRecommendedProduct(matched);
      setAiRationale(rationale);
      setStep('result');
    }, 900);
  };

  const handleReset = () => {
    setStep('initial');
    setQ1Answer(null);
    setQ2Answer(null);
    setRecommendedProduct(null);
  };

  return (
    <div className="w-full bg-[#FAF6EE] border border-[#E8DFD3] p-6 sm:p-10 shadow-sm transition-all duration-500">
      {/* Curator Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E8DFD3]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#110D09] flex items-center justify-center text-[#FAF7F2]">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div>
            <span className="text-[10px] tracking-luxury uppercase font-mono font-bold text-[#8C6D42] block">
              VALCURA Atelier • Fragrance Sommelier
            </span>
            <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wide text-[#110D09]">
              Curator for {mood.title}
            </h3>
          </div>
        </div>

        {step !== 'initial' && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-mono text-[#8C6D42] hover:text-[#110D09] flex items-center space-x-1.5 transition-colors uppercase tracking-wider"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Start Over</span>
          </button>
        )}
      </div>

      {/* STEP 1: INITIAL AI GREETING & CHOICE */}
      {step === 'initial' && (
        <div className="pt-8 space-y-6 max-w-2xl mx-auto text-center animate-fade-in">
          <p className="text-sm sm:text-base font-serif italic text-[#110D09]/90 leading-relaxed">
            &ldquo;I see you are drawn to <span className="font-bold not-italic">{mood.title}</span>. I have curated the fragrances that capture this distinct atmosphere. Would you like to explore all the curated fragrances, or shall I help you choose the best one for you?&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              type="button"
              onClick={handleStartConsultation}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#110D09] text-[#FAF7F2] text-xs font-serif font-bold uppercase tracking-[0.2em] hover:bg-[#2A1F16] transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Help Me Choose The Best</span>
            </button>

            <button
              type="button"
              onClick={handleShowAll}
              className="w-full sm:w-auto px-6 py-3.5 border border-[#110D09]/40 text-[#110D09] text-xs font-serif font-bold uppercase tracking-[0.2em] hover:bg-[#110D09]/5 hover:border-[#110D09] transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore All Curated Fragrances</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: QUESTION 1 */}
      {step === 'q1' && (
        <div className="pt-8 space-y-6 max-w-2xl mx-auto animate-fade-in">
          <div className="text-center space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-[#8C6D42] font-semibold tracking-widest">
              Question 1 of 2 • Olfactory Energy
            </span>
            <h4 className="text-lg sm:text-xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
              What sensory energy speaks to you most right now?
            </h4>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                id: 'citrus-cream',
                title: 'Solar Citrus Sparkle & Hazelnut Cream',
                desc: 'Vibrant, crystalline morning freshness softening into creamy, tactile praline comfort.',
              },
              {
                id: 'smoky-cacao',
                title: 'Smoked Woods & Bitter Roasted Cacao',
                desc: 'Deep, mysterious cocoa rinds and sun-warmed cedarwood with a quiet magnetic presence.',
              },
              {
                id: 'dewy-floral',
                title: 'Dewy Sambac Petals & Soft Cocoa Butter',
                desc: 'Delicate, ethereal white florals draped in velvet silk musk for personal serenity.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleAnswerQ1(opt.id)}
                className="w-full text-left p-4 sm:p-5 bg-white border border-[#E8DFD3] hover:border-[#110D09] transition-all group hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm sm:text-base text-[#110D09] group-hover:text-[#8C6D42] transition-colors">
                    {opt.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8C6D42] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-[#110D09]/65 font-light mt-1">
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: QUESTION 2 */}
      {step === 'q2' && (
        <div className="pt-8 space-y-6 max-w-2xl mx-auto animate-fade-in">
          <div className="text-center space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-[#8C6D42] font-semibold tracking-widest">
              Question 2 of 2 • Occasion & Setting
            </span>
            <h4 className="text-lg sm:text-xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
              When and how do you envision wearing this fragrance?
            </h4>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                id: 'daily-ritual',
                title: 'Daytime Rituals & Café Mornings',
                desc: 'Effortless signature presence that elevates everyday conversations and sunlit hours.',
              },
              {
                id: 'evening-intimate',
                title: 'Intimate Evenings & Low-Lit Dinners',
                desc: 'A magnetic, warm skin-close aura that commands sophisticated attention as night falls.',
              },
              {
                id: 'quiet-comfort',
                title: 'Unhurried Leisure & Personal Sanctuary',
                desc: 'A gentle cocoon of luxury for reading, relaxing, and quiet personal moments.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleAnswerQ2(opt.id)}
                className="w-full text-left p-4 sm:p-5 bg-white border border-[#E8DFD3] hover:border-[#110D09] transition-all group hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm sm:text-base text-[#110D09] group-hover:text-[#8C6D42] transition-colors">
                    {opt.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8C6D42] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-xs text-[#110D09]/65 font-light mt-1">
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: THINKING STATE */}
      {step === 'thinking' && (
        <div className="py-14 text-center space-y-4 animate-fade-in">
          <div className="inline-block animate-spin text-[#8C6D42]">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-sm font-serif italic text-[#110D09]/80">
            Atelier Sommelier is synthesizing your preferences with our olfactory library...
          </p>
        </div>
      )}

      {/* STEP 5: FINAL RECOMMENDATION RESULT WITH DIRECT LINK TO ORIGINAL PRODUCT PAGE */}
      {step === 'result' && recommendedProduct && (
        <div className="pt-8 space-y-6 max-w-3xl mx-auto animate-fade-in">
          <div className="text-center space-y-2">
            <span className="text-[10px] tracking-luxury uppercase font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 border border-emerald-200 inline-block">
              ✦ Your Bespoke Atelier Match
            </span>
            <h4 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
              {recommendedProduct.name}
            </h4>
            <p className="text-xs sm:text-sm text-[#110D09]/75 font-serif italic max-w-xl mx-auto">
              &ldquo;{aiRationale}&rdquo;
            </p>
          </div>

          {/* Winning Fragrance Card */}
          <div className="bg-white border border-[#110D09] p-5 sm:p-6 shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 relative aspect-square max-h-56 bg-[#F8F5F0] overflow-hidden">
              <Image
                src={recommendedProduct.images[0]}
                alt={recommendedProduct.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#110D09] text-white font-bold">
                  {recommendedProduct.isAvailable ? 'Available Now • 50 ML' : 'Coming Soon'}
                </span>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-[#8C6D42] uppercase tracking-wider font-semibold block">
                  {recommendedProduct.collection} • {recommendedProduct.category}
                </span>
                <h5 className="text-xl sm:text-2xl font-serif font-bold uppercase text-[#110D09]">
                  {recommendedProduct.name}
                </h5>
                <p className="text-xs text-[#110D09]/70 font-light mt-1">
                  {recommendedProduct.shortDescription || 'An authentic high-concentration formulation crafted with pure botanical extracts.'}
                </p>
              </div>

              {recommendedProduct.isAvailable && (
                <div className="flex items-baseline space-x-3 pt-1">
                  <span className="text-2xl font-serif font-bold text-[#110D09]">₹{recommendedProduct.fullPrice || 499}</span>
                  <span className="text-xs font-mono text-[#110D09]/40 line-through">₹{recommendedProduct.standardPrice || 599}</span>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    Save ₹100
                  </span>
                </div>
              )}

              {/* Direct Landing Link onto Original Product Page */}
              <div className="pt-2">
                <Link
                  href={`/product/${recommendedProduct.slug}`}
                  className="w-full btn-luxury-primary py-3.5 text-xs font-serif font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 shadow-md"
                >
                  <span>View Original Product Details & Purchase</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleShowAll}
              className="text-xs font-serif uppercase tracking-[0.18em] text-[#8C6D42] hover:text-[#110D09] font-bold border-b border-[#8C6D42] pb-0.5 transition-colors"
            >
              Or Browse All Curated Fragrances for this Mood ↓
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: ALL CURATED FRAGRANCES DISPLAY */}
      {step === 'all' && (
        <div className="pt-8 space-y-6 animate-fade-in">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#8C6D42] tracking-widest font-semibold block">
              Curated Selection
            </span>
            <h4 className="text-lg sm:text-xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
              All Fragrances Harmonizing with {mood.title}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {curatedProducts.map((product) => {
              const isAvailable = product.isAvailable;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#E8DFD3] flex flex-col justify-between overflow-hidden shadow-sm hover:border-[#110D09] transition-all"
                >
                  <Link href={`/product/${product.slug}`} className="relative aspect-[4/3] max-h-52 bg-[#F8F5F0] overflow-hidden block group">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#110D09] text-white font-bold">
                        {isAvailable ? 'Available Now • 50 ML' : 'Coming Soon'}
                      </span>
                    </div>
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4 text-center">
                    <div>
                      <span className="text-[10px] font-mono text-[#8C6D42] uppercase tracking-wider block font-semibold">
                        {product.collection}
                      </span>
                      <Link href={`/product/${product.slug}`}>
                        <h5 className="text-lg font-serif font-bold uppercase text-[#110D09] hover:text-[#8C6D42] transition-colors mt-0.5">
                          {product.name}
                        </h5>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-[#E8DFD3]">
                      <Link
                        href={`/product/${product.slug}`}
                        className={`w-full text-center block text-xs font-serif font-bold py-2.5 uppercase tracking-[0.18em] ${
                          isAvailable
                            ? 'btn-luxury-primary'
                            : 'bg-[#FAF7F2] border border-[#D5CDC2] text-[#110D09] hover:bg-[#FAF6EE]'
                        }`}
                      >
                        {isAvailable ? 'View & Purchase →' : 'View Coming Soon'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-3">
            <button
              type="button"
              onClick={handleStartConsultation}
              className="text-xs font-serif uppercase tracking-[0.18em] text-[#8C6D42] hover:text-[#110D09] font-bold border-b border-[#8C6D42] pb-0.5 transition-colors"
            >
              Need help deciding? Ask the Sommelier to choose the best match ↑
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
