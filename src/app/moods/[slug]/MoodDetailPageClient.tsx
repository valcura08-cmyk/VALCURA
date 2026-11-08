'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Check,
  RefreshCw,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Mood, Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';

interface Props {
  mood: Mood;
  recommendedProducts: Product[];
}

type QuizStage = 'q1' | 'q2' | 'q3' | 'analyzing' | 'result';

export default function MoodDetailPageClient({ mood, recommendedProducts }: Props) {
  const { addToCart, setIsCartOpen } = useCart();

  // Entry Discovery Modal: "Explore on your own" vs "Let us help"
  const [showEntryModal, setShowEntryModal] = useState(true);

  const handleLetUsHelp = () => {
    setShowEntryModal(false);
    setIsQuizOpen(true);
    setTimeout(() => {
      document.getElementById('mood-quiz-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleExploreOnYourOwn = () => {
    setShowEntryModal(false);
  };

  // Primary available product (Cacao Citrine or first)
  const primaryProduct =
    recommendedProducts.find((p) => p.isAvailable) || recommendedProducts[0];

  // Per-product quantities and add-to-cart confirmation states
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedStates, setAddedStates] = useState<Record<string, boolean>>({});

  const handleUpdateQty = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 1;
    addToCart(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0],
        category: product.category,
        volume: product.volume,
        quantity: qty,
        paymentPlan: 'standard_full',
      },
      'standard_full'
    );
    setAddedStates((prev) => ({ ...prev, [product.id]: true }));
    setIsCartOpen(true);
    setTimeout(() => {
      setAddedStates((prev) => ({ ...prev, [product.id]: false }));
    }, 2500);
  };

  // 3-Question Quiz State (No mention of AI!)
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStage, setQuizStage] = useState<QuizStage>('q1');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizResultProduct, setQuizResultProduct] = useState<Product>(primaryProduct);
  const [quizRationale, setQuizRationale] = useState<string>('');
  const [quizAddedSuccess, setQuizAddedSuccess] = useState(false);

  // Direct Add to Cart from Quiz Result
  const handleAddQuizResultToCart = () => {
    if (!quizResultProduct) return;
    addToCart(
      {
        productId: quizResultProduct.id,
        name: quizResultProduct.name,
        slug: quizResultProduct.slug,
        image: quizResultProduct.images[0],
        category: quizResultProduct.category,
        volume: quizResultProduct.volume,
        quantity: 1,
        paymentPlan: 'standard_full',
      },
      'standard_full'
    );
    setQuizAddedSuccess(true);
    setIsCartOpen(true);
    setTimeout(() => setQuizAddedSuccess(false), 2500);
  };

  // Record an answer and advance to the next question
  const handleAnswer = (questionKey: string, choiceKey: string, nextStage: QuizStage) => {
    const updatedAnswers = { ...answers, [questionKey]: choiceKey };
    setAnswers(updatedAnswers);

    if (nextStage === 'analyzing') {
      setQuizStage('analyzing');
      setTimeout(() => {
        // Calculate the best match from the 3 answers
        let scoreCitrine = 0;
        let scoreZest = 0;
        let scoreSambac = 0;

        Object.values(updatedAnswers).forEach((val) => {
          if (val === 'a') scoreCitrine += 1;
          else if (val === 'b') scoreZest += 1;
          else if (val === 'c') scoreSambac += 1;
        });

        let matched = primaryProduct;
        let reason = '';

        if (scoreZest > scoreCitrine && scoreZest >= scoreSambac) {
          const rz = recommendedProducts.find((p) => p.id === 'roasted-zest');
          matched = rz || primaryProduct;
          reason = `Based on your preference for smoked roasted cacao, evening allure, and magnetic presence, ${matched.name} is your bespoke signature. Its roasted cocoa nibs and charred cedarwood notes offer irresistible depth.`;
        } else if (scoreSambac > scoreCitrine && scoreSambac >= scoreZest) {
          const ss = recommendedProducts.find((p) => p.id === 'silken-sambac');
          matched = ss || primaryProduct;
          reason = `Your taste for delicate white jasmine petals, personal tranquility, and soft silk musks perfectly aligns with ${matched.name}. Its airy, cocooning trail wraps you in timeless serenity.`;
        } else {
          matched = recommendedProducts.find((p) => p.id === 'cacao-citrine') || primaryProduct;
          reason = `With your affinity for sun-drenched bergamot, creamy hazelnut praline, and luminous daytime warmth, ${matched.name} is your ideal fragrance match for ${mood.title}.`;
        }

        setQuizResultProduct(matched);
        setQuizRationale(reason);
        setQuizStage('result');
      }, 950);
    } else {
      setQuizStage(nextStage);
    }
  };

  const handleResetQuiz = () => {
    setQuizStage('q1');
    setAnswers({});
  };

  return (
    <div className="bg-[#FAF7F2] text-[#110D09] min-h-screen pb-24 relative">
      {/* ENTRY DISCOVERY POP-UP: "EXPLORE ON YOUR OWN" vs "LET US HELP" */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF7F2] border-2 border-[#110D09] rounded-2xl sm:rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleExploreOnYourOwn}
              className="absolute top-4 right-4 p-2 text-[#110D09]/60 hover:text-[#110D09] hover:bg-[#E8DFD3]/50 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Atmosphere Badge & Heading */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-luxury uppercase px-3 py-1 bg-[#110D09] text-[#FAF7F2] font-bold rounded-full inline-block shadow-sm">
                Atmosphere Curations • {mood.title}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
                Find Your Signature Scent
              </h2>
              <p className="text-xs sm:text-sm text-[#110D09]/75 font-light leading-relaxed pt-1">
                Would you like us to help you find your best perfume with a quick 3-question quiz, or would you prefer to explore this collection on your own?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleLetUsHelp}
                className="w-full py-3.5 px-6 bg-[#110D09] text-[#FAF7F2] hover:bg-[#8C6D42] text-xs font-serif font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center space-x-2.5 transition-all shadow-md group"
              >
                <Sparkles className="w-4 h-4 text-[#C5A880] group-hover:scale-110 transition-transform" />
                <span>Let Us Help (Start Quiz)</span>
              </button>

              <button
                type="button"
                onClick={handleExploreOnYourOwn}
                className="w-full py-3 px-6 bg-transparent hover:bg-white text-[#110D09] border border-[#110D09] text-xs font-serif font-bold uppercase tracking-[0.15em] rounded-xl transition-all"
              >
                Explore On Your Own
              </button>
            </div>

            <p className="text-[11px] font-mono text-[#8C6D42]">
              All creations formulated in 50ml Eau de Parfum
            </p>
          </div>
        </div>
      )}

      {/* Editorial Navigation Breadcrumb */}
      <div className="border-b border-[#E8DFD3] bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs">
          <Link
            href="/moods"
            className="inline-flex items-center space-x-2 text-[#8C6D42] hover:text-[#110D09] font-mono uppercase tracking-wider font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to All Moods</span>
          </Link>
          <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-[#110D09]/60">
            <span>Atmosphere Curations</span>
            <span>/</span>
            <span className="text-[#110D09] font-bold uppercase">{mood.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12">
        {/* 1. ATMOSPHERE PROFILE HEADER (COMPACT & CURVED) */}
        <section className="bg-white border border-[#E8DFD3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Mood Atmosphere Photography */}
            <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto lg:h-full min-h-[240px] bg-[#F4ECE1] overflow-hidden">
              <Image
                src={mood.image}
                alt={mood.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 bg-[#110D09] text-[#FAF7F2] font-bold rounded-full shadow-sm">
                  Atmospheric Moment
                </span>
              </div>
            </div>

            {/* Atmosphere Narrative */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold block">
                  Olfactory Lifestyle Match
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
                  {mood.title}
                </h1>
                <p className="text-sm font-serif italic text-[#8C6D42]">
                  {mood.description}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#110D09]/75 font-light leading-relaxed">
                {mood.visualDirection}
              </p>

              <div className="bg-[#FAF6EE] border-l-2 border-[#110D09] p-3.5 text-xs text-[#110D09]/85 font-light leading-relaxed rounded-r-lg">
                &ldquo;{mood.storySnippet}&rdquo;
              </div>
            </div>
          </div>
        </section>

        {/* 2. DIRECT LIST OF ALL FRAGRANCES LINKED TO THIS MOOD (JUST LIKE IN EXPLORE BY SCENTS) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-[#110D09] pb-3 gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold block">
                Paired Perfumes
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wide text-[#110D09] mt-0.5">
                Fragrances Paired For {mood.title}
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8C6D42] font-semibold">
              {recommendedProducts.length} Olfactory Creation{recommendedProducts.length > 1 ? 's' : ''} Linked
            </span>
          </div>

          {/* Fragrances Grid - Compact in one view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 max-w-4xl mx-auto items-stretch">
            {recommendedProducts.map((product) => {
              const isAvailable = product.isAvailable;
              const prodQty = quantities[product.id] || 1;
              const isAdded = !!addedStates[product.id];
              const price = product.fullPrice || 499;
              const mrp = product.standardPrice || 599;

              if (isAvailable) {
                return (
                  <div
                    key={product.id}
                    className="bg-[#FAF6EE] border border-[#110D09] rounded-xl max-w-[270px] sm:max-w-[280px] w-full mx-auto flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300"
                  >
                    {/* Compact Flacon Image with Status Tag */}
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
                        <span className="text-[8px] font-mono tracking-widest uppercase px-2 py-0.5 bg-[#110D09] text-[#FAF7F2] font-bold rounded-full shadow-xs">
                          Available Now • 50 ML
                        </span>
                      </div>
                    </Link>

                    {/* Fragrance Details & Immediate Add to Cart */}
                    <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                      <div className="space-y-1 text-center">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C6D42] font-semibold block">
                          {product.category} • Eau de Parfum
                        </span>
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="text-base sm:text-lg font-serif font-bold tracking-wide uppercase text-[#110D09] hover:text-[#8C6D42] transition-colors leading-tight">
                            {product.name}
                          </h3>
                        </Link>
                        {product.notes && product.notes.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1 pt-0.5">
                            {product.notes.map((note) => (
                              <span
                                key={note}
                                className="text-[9px] font-serif bg-white text-[#110D09] px-1.5 py-0.5 border border-[#E8DFD3] rounded font-medium"
                              >
                                {note}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pricing, Quantity Selector & Add to Cart Button */}
                      <div className="pt-2 border-t border-[#E8DFD3] space-y-2">
                        <div className="flex items-baseline justify-center space-x-2">
                          <span className="text-lg sm:text-xl font-serif font-bold text-[#110D09]">
                            ₹{price}
                          </span>
                          <span className="text-[10px] text-[#110D09]/40 line-through font-mono">
                            ₹{mrp}
                          </span>
                          <span className="text-[9px] font-mono font-bold uppercase text-emerald-800 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200 rounded">
                            Save ₹100
                          </span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between text-xs px-1">
                          <span className="font-mono text-[#110D09]/70 font-semibold uppercase text-[9px]">
                            Quantity:
                          </span>
                          <div className="inline-flex items-center border border-[#D5CDC2] bg-[#FAF7F2] rounded overflow-hidden h-7">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(product.id, -1)}
                              className="px-2 py-0.5 text-xs hover:text-[#8C6D42] transition-colors font-mono font-bold"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-0.5 font-mono font-bold text-xs text-[#110D09]">
                              {prodQty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(product.id, 1)}
                              className="px-2 py-0.5 text-xs hover:text-[#8C6D42] transition-colors font-mono font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="w-full btn-luxury-primary py-2 px-3 text-[11px] font-bold tracking-luxury uppercase flex items-center justify-center space-x-1.5 rounded-lg shadow-2xs cursor-pointer"
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Added to Bag!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add to Cart • ₹{price * prodQty}</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/product/${product.slug}`}
                          className="w-full text-center block text-[9px] tracking-luxury uppercase text-[#110D09]/70 hover:text-[#110D09] pt-0.5 transition-colors font-bold font-mono"
                        >
                          Discover {product.name} →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              // COMING SOON PERFUMES (Silken Sambac, Roasted Zest)
              return (
                <div
                  key={product.id}
                  className="bg-[#FAF6EE] border border-[#E8DFD3] rounded-xl max-w-[270px] sm:max-w-[280px] w-full mx-auto flex flex-col justify-between overflow-hidden shadow-2xs hover:border-[#110D09]/40 transition-all duration-300"
                >
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

                  <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between items-center text-center space-y-3">
                    <div className="space-y-1 pt-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#8C6D42] font-semibold block">
                        {product.collection || 'Cacaoveil'}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-bold tracking-wide uppercase text-[#110D09] leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-[#110D09]/65 italic font-serif">
                        In Atelier Formulation
                      </p>
                    </div>

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
        </section>

        {/* 3. OPTION: "HELP TO FIND BEST ONE" (NO AI MENTION) 3-QUESTION QUIZ */}
        <section
          id="mood-quiz-section"
          className="bg-[#FAF6EE] border-2 border-[#110D09] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFD3]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#110D09] flex items-center justify-center text-[#FAF7F2] flex-shrink-0">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <span className="text-[10px] tracking-luxury uppercase font-mono font-bold text-[#8C6D42] block">
                  VALCURA Atelier • Bespoke Fragrance Advisor
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wide text-[#110D09]">
                  Help To Find Best One
                </h3>
              </div>
            </div>

            {!isQuizOpen ? (
              <button
                type="button"
                onClick={() => setIsQuizOpen(true)}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#110D09] text-[#FAF7F2] hover:bg-[#8C6D42] text-xs font-serif font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Start The Quiz</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetQuiz}
                className="inline-flex items-center space-x-1 text-xs font-mono text-[#8C6D42] hover:text-[#110D09] uppercase tracking-wider transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restart Quiz</span>
              </button>
            )}
          </div>

          {/* QUIZ COLLAPSED TEASER VIEW */}
          {!isQuizOpen ? (
            <div className="pt-6 space-y-4 max-w-2xl">
              <p className="text-sm font-serif italic text-[#110D09]/80 leading-relaxed">
                &ldquo;Not sure which fragrance fits your routine best? Take our short 3-question fragrance quiz to discover your ideal match for {mood.title}.&rdquo;
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8C6D42]">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>3 Quick Questions</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Personalized Match</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Instant Cart Addition</span>
                </span>
              </div>
            </div>
          ) : (
            /* ACTIVE 3-QUESTION INTERACTIVE QUIZ */
            <div className="pt-6">
              {/* Progress Indicator */}
              {quizStage !== 'analyzing' && quizStage !== 'result' && (
                <div className="flex items-center justify-between pb-6 border-b border-[#E8DFD3] text-[11px] font-mono text-[#8C6D42]">
                  <span>
                    Question{' '}
                    {quizStage === 'q1'
                      ? '01'
                      : quizStage === 'q2'
                      ? '02'
                      : '03'}{' '}
                    of 03
                  </span>
                  <div className="flex space-x-1.5">
                    {['q1', 'q2', 'q3'].map((q, idx) => {
                      const stages: QuizStage[] = ['q1', 'q2', 'q3'];
                      const currentIdx = stages.indexOf(quizStage);
                      const isComplete = idx < currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={q}
                          className={`w-6 h-1.5 rounded-full transition-all ${
                            isComplete
                              ? 'bg-emerald-700'
                              : isCurrent
                              ? 'bg-[#110D09]'
                              : 'bg-[#D5CDC2]'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUESTION 1: SMELL PREFERENCE */}
              {quizStage === 'q1' && (
                <div className="space-y-6 max-w-2xl mx-auto text-center animate-fade-in pt-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold">
                      Aroma Preference
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif font-bold uppercase text-[#110D09]">
                      Which Scent Notes Attract You Most?
                    </h4>
                    <p className="text-xs text-[#110D09]/70 font-light">
                      Choose the primary aroma that captivates your senses.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      {
                        key: 'a',
                        title: 'Sun-Drenched Citrus & Hazelnut Cream',
                        desc: 'Crisp bergamot sparkling into warm, roasted hazelnut praline.',
                      },
                      {
                        key: 'b',
                        title: 'Smoked Cacao & Roasted Woods',
                        desc: 'Rich bitter cocoa beans, spices, and velvety smoked cedarwood.',
                      },
                      {
                        key: 'c',
                        title: 'Dewy White Jasmine & Silk Musks',
                        desc: 'Delicate sambac petals draped in soft, cocooning white musks.',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleAnswer('q1', opt.key, 'q2')}
                        className="p-4 text-left bg-white border border-[#E8DFD3] hover:border-[#110D09] hover:shadow-md rounded-xl transition-all flex flex-col justify-between space-y-2 group"
                      >
                        <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#110D09] group-hover:text-[#8C6D42]">
                          {opt.title}
                        </span>
                        <p className="text-[11px] text-[#110D09]/70 font-light leading-snug">
                          {opt.desc}
                        </p>
                        <span className="text-[10px] font-mono text-[#8C6D42] uppercase tracking-widest pt-1 block">
                          Select Option →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QUESTION 2: OCCASION / WHERE TO WEAR */}
              {quizStage === 'q2' && (
                <div className="space-y-6 max-w-2xl mx-auto text-center animate-fade-in pt-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold">
                      Wearing Environment
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif font-bold uppercase text-[#110D09]">
                      Where Do You Want To Wear This Fragrance Most?
                    </h4>
                    <p className="text-xs text-[#110D09]/70 font-light">
                      Select your primary setting and wearing atmosphere.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      {
                        key: 'a',
                        title: 'Daily Life & Café Encounters',
                        desc: 'Unhurried mornings, coffee dates, workspaces, and easy daytime chic.',
                      },
                      {
                        key: 'b',
                        title: 'Evenings & Candlelit Dinners',
                        desc: 'Nocturnal gatherings, intimate dinners, and evening presence.',
                      },
                      {
                        key: 'c',
                        title: 'Quiet Personal Moments',
                        desc: 'Slow weekends, cocooning reading hours, and personal tranquility.',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleAnswer('q2', opt.key, 'q3')}
                        className="p-4 text-left bg-white border border-[#E8DFD3] hover:border-[#110D09] hover:shadow-md rounded-xl transition-all flex flex-col justify-between space-y-2 group"
                      >
                        <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#110D09] group-hover:text-[#8C6D42]">
                          {opt.title}
                        </span>
                        <p className="text-[11px] text-[#110D09]/70 font-light leading-snug">
                          {opt.desc}
                        </p>
                        <span className="text-[10px] font-mono text-[#8C6D42] uppercase tracking-widest pt-1 block">
                          Select Option →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QUESTION 3: SCENT TRAIL & FEEL ON SKIN */}
              {quizStage === 'q3' && (
                <div className="space-y-6 max-w-2xl mx-auto text-center animate-fade-in pt-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold">
                      Scent Trail & Feel On Skin
                    </span>
                    <h4 className="text-xl sm:text-2xl font-serif font-bold uppercase text-[#110D09]">
                      How Do You Want Your Fragrance Trail To Feel?
                    </h4>
                    <p className="text-xs text-[#110D09]/70 font-light">
                      Choose the sensory aura you wish to radiate.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      {
                        key: 'a',
                        title: 'Luminous Warmth & Inviting Aura',
                        desc: 'Bright solar warmth and effortless charm noticed gently by those around you.',
                      },
                      {
                        key: 'b',
                        title: 'Deep, Smoky & Magnetic Presence',
                        desc: 'Rich roasted cacao and dark woods creating an unforgettable signature impression.',
                      },
                      {
                        key: 'c',
                        title: 'Soft, Intimate & Second-Skin Veil',
                        desc: 'Whisper-soft white musks and delicate blossoms resting close on pulse points.',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleAnswer('q3', opt.key, 'analyzing')}
                        className="p-4 text-left bg-white border border-[#E8DFD3] hover:border-[#110D09] hover:shadow-md rounded-xl transition-all flex flex-col justify-between space-y-2 group"
                      >
                        <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#110D09] group-hover:text-[#8C6D42]">
                          {opt.title}
                        </span>
                        <p className="text-[11px] text-[#110D09]/70 font-light leading-snug">
                          {opt.desc}
                        </p>
                        <span className="text-[10px] font-mono text-[#8C6D42] uppercase tracking-widest pt-1 block">
                          Select & Reveal Best Match →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ANALYZING ANIMATION (NO AI MENTION) */}
              {quizStage === 'analyzing' && (
                <div className="py-12 text-center space-y-4 animate-fade-in">
                  <div className="w-10 h-10 border-2 border-[#110D09] border-t-transparent rounded-full animate-spin mx-auto" />
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#8C6D42] font-bold block">
                    Analyzing Your Olfactory Responses...
                  </span>
                  <p className="text-xs text-[#110D09]/60 font-light">
                    Harmonizing your answers with the {mood.title} mood profile.
                  </p>
                </div>
              )}

              {/* QUIZ RESULT SHOWCASE */}
              {quizStage === 'result' && (
                <div className="space-y-6 max-w-2xl mx-auto animate-fade-in pt-2">
                  <div className="text-center space-y-1 pb-4 border-b border-[#E8DFD3]">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-700 font-bold block">
                      ✓ Best Match Determined For You • 99% Olfactory Resonance
                    </span>
                    <h4 className="text-2xl font-serif font-bold uppercase text-[#110D09]">
                      Your Recommended Signature: {quizResultProduct.name}
                    </h4>
                    <p className="text-xs text-[#110D09]/75 font-light max-w-xl mx-auto pt-1 leading-relaxed">
                      {quizRationale}
                    </p>
                  </div>

                  {/* Showcase Product Result Card */}
                  <div className="bg-white border border-[#E8DFD3] rounded-2xl p-5 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                      <div className="sm:col-span-4 relative aspect-[4/3] bg-[#FAF8F5] border border-[#E8DFD3] rounded-xl overflow-hidden">
                        <Image
                          src={quizResultProduct.images[0]}
                          alt={quizResultProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="sm:col-span-8 space-y-3">
                        <span className="text-[10px] font-mono uppercase text-[#8C6D42] font-semibold">
                          {quizResultProduct.category} • 50 ML Eau de Parfum
                        </span>
                        <h5 className="text-xl font-serif font-bold uppercase text-[#110D09]">
                          {quizResultProduct.name}
                        </h5>
                        <div className="flex items-baseline space-x-3">
                          <span className="text-2xl font-serif font-bold text-[#110D09]">
                            ₹{quizResultProduct.fullPrice || 499}
                          </span>
                          <span className="text-xs font-mono text-[#110D09]/40 line-through">
                            ₹{quizResultProduct.standardPrice || 599}
                          </span>
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-md font-mono font-bold">
                            Save ₹100
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                          {quizResultProduct.isAvailable ? (
                            <button
                              type="button"
                              onClick={handleAddQuizResultToCart}
                              className={`flex-1 py-3 px-5 text-xs font-serif font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center space-x-2 transition-all ${
                                quizAddedSuccess
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-[#110D09] text-white hover:bg-[#8C6D42]'
                              }`}
                            >
                              {quizAddedSuccess ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Added to Bag!</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Add Recommended Scent • ₹{quizResultProduct.fullPrice || 499}</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <Link
                              href="/collections/cacaoveil"
                              className="flex-1 py-3 px-5 bg-[#110D09] text-white text-xs font-serif font-bold uppercase tracking-[0.2em] rounded-xl text-center"
                            >
                              Preview in Cacaoveil
                            </Link>
                          )}

                          <Link
                            href={`/product/${quizResultProduct.slug}`}
                            className="btn-luxury-outline py-3 px-5 text-xs font-serif font-bold uppercase tracking-wider rounded-xl text-center"
                          >
                            Product Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={handleResetQuiz}
                      className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#8C6D42] hover:text-[#110D09] uppercase tracking-wider transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake Quiz With Different Answers</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
