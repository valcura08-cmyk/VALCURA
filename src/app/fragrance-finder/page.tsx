'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { RecommendationResult } from '@/lib/recommendation';

export default function FragranceFinderPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1..4 = Questions, 5 = Result
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);

  // Selected answers
  const [occasion, setOccasion] = useState('Coffee Date or Casual Outing');
  const [mood, setMood] = useState('Soft and Comforting');
  const [notes, setNotes] = useState('Creamy and Nutty');
  const [direction, setDirection] = useState('Balanced and Unisex');

  const questions = [
    {
      id: 1,
      title: 'QUESTION 1 — WHERE WILL YOU WEAR YOUR FRAGRANCE?',
      subtitle: 'Select the primary rhythm or occasion for your scent silhouette.',
      currentValue: occasion,
      setter: setOccasion,
      options: [
        'Everyday',
        'Work or Study',
        'Coffee Date or Casual Outing',
        'Dinner or Date Night',
        'Special Occasions',
      ],
    },
    {
      id: 2,
      title: 'QUESTION 2 — WHAT KIND OF MOOD ARE YOU LOOKING FOR?',
      subtitle: 'Fragrance begins with an emotional state of being.',
      currentValue: mood,
      setter: setMood,
      options: [
        'Fresh and Uplifting',
        'Soft and Comforting',
        'Warm and Indulgent',
        'Confident and Expressive',
      ],
    },
    {
      id: 3,
      title: 'QUESTION 3 — WHICH FRAGRANCE NOTES ATTRACT YOU?',
      subtitle: 'Preference choices help us match your olfactory affinities.',
      currentValue: notes,
      setter: setNotes,
      options: [
        'Citrus and Fresh',
        'Creamy and Nutty',
        'Sweet and Gourmand',
        'Woody and Warm',
        'Floral and Soft',
        'I Am Open to Anything',
      ],
    },
    {
      id: 4,
      title: 'QUESTION 4 — WHICH FRAGRANCE DIRECTION DO YOU PREFER?',
      subtitle: 'We craft without boundaries — pick the contour you gravitate toward.',
      currentValue: direction,
      setter: setDirection,
      options: [
        'Balanced and Unisex',
        'Traditionally Masculine-Leaning',
        'Traditionally Feminine-Leaning',
        'No Particular Preference',
      ],
    },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    setCurrentStep(5);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion, mood, notes, direction }),
      });
      const data: RecommendationResult = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const restartQuiz = () => {
    setCurrentStep(1);
    setResult(null);
  };

  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Quiz Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-[#E8E2D8] bg-[#FAF8F5] text-center">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs tracking-luxury uppercase text-[#8C6D42] font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atelier Recommendation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-wide uppercase text-[#110D09]">
            Find Your Fragrance
          </h1>
          <p className="text-xs sm:text-sm text-[#110D09]/65 font-light">
            A guided four-step exploration designed around your personality, occasions, and mood.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* STEP 0: INTRO SCREEN */}
        {currentStep === 0 && (
          <div className="bg-white border border-[#E8E2D8] p-8 sm:p-12 text-center space-y-6 shadow-lg">
            <div className="w-16 h-16 rounded-full border border-[#D5CDC2] mx-auto flex items-center justify-center">
              <span className="font-serif text-2xl text-[#110D09]">V</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-wide text-[#110D09]">
              A Fragrance That Feels Like You
            </h2>
            <p className="text-sm text-[#110D09]/75 font-light max-w-lg mx-auto leading-relaxed">
              We believe perfume discovery should not require navigating technical chemistry or
              opaque jargon. In 4 quick questions, discover which scent from our atelier aligns with
              your current side.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn-luxury-primary"
              >
                Start Discovery Quiz
              </button>
            </div>
          </div>
        )}

        {/* STEPS 1 to 4: QUESTIONS */}
        {currentStep >= 1 && currentStep <= 4 && (
          <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10 shadow-lg space-y-8 animate-fade-in">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C6D42] font-mono mb-2">
                <span>Step 0{currentStep} of 04</span>
                <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
              </div>
              <div className="w-full h-1 bg-[#E8E2D8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#110D09] transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Details */}
            {(() => {
              const q = questions[currentStep - 1];
              return (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-serif uppercase tracking-wide text-[#110D09]">
                      {q.title}
                    </h2>
                    <p className="text-xs text-[#110D09]/60 font-light mt-1">
                      {q.subtitle}
                    </p>
                  </div>

                  {/* Radio / Option Select List */}
                  <div className="space-y-3">
                    {q.options.map((opt) => {
                      const isSelected = q.currentValue === opt;
                      return (
                        <div
                          key={opt}
                          onClick={() => q.setter(opt)}
                          className={`cursor-pointer p-4 border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#110D09] bg-[#FAF8F5] text-[#110D09] shadow-sm font-medium'
                              : 'border-[#E8E2D8] bg-white text-[#110D09]/75 hover:border-[#110D09]/40'
                          }`}
                        >
                          <span className="text-xs sm:text-sm tracking-wide font-light">
                            {opt}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-[#110D09] bg-[#110D09]'
                                : 'border-[#D5CDC2]'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center space-x-1.5 text-xs tracking-luxury uppercase text-[#110D09]/60 hover:text-[#110D09] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn-luxury-primary py-3 px-6 text-xs"
              >
                <span>{currentStep === 4 ? 'Reveal Recommendation' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RECOMMENDATION RESULT / LOADING */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-fade-in">
            {loading ? (
              <div className="bg-white border border-[#E8E2D8] p-16 text-center space-y-4 shadow-lg">
                <div className="w-12 h-12 border-2 border-[#110D09] border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="text-lg font-serif tracking-luxury uppercase text-[#110D09]">
                  Consulting VALCURA Atelier
                </h3>
                <p className="text-xs text-[#110D09]/60 font-light">
                  Analyzing preferred occasion, mood affinity, verified accords, and availability...
                </p>
              </div>
            ) : result && result.hasMatch && result.product ? (
              <div className="bg-white border border-[#E8E2D8] p-8 sm:p-12 shadow-xl space-y-8">
                {/* Result Tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D8] gap-4">
                  <div className="flex items-center space-x-2 text-xs tracking-luxury uppercase text-[#110D09] font-mono font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your Recommended Scent Match</span>
                  </div>
                  <button
                    type="button"
                    onClick={restartQuiz}
                    className="inline-flex items-center space-x-1 text-xs text-[#110D09]/50 hover:text-[#110D09] transition-colors font-mono"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                </div>

                {/* Main Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-5 relative aspect-[4/5] bg-[#F8F5F0] border border-[#E8E2D8] overflow-hidden shadow-md">
                    <Image
                      src={result.product.images[0]}
                      alt={result.product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#110D09] text-white text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5">
                      Pre-order Available
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-5">
                    <div>
                      <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono font-medium">
                        {result.product.category} • {result.product.volume}
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-serif tracking-wide uppercase text-[#110D09] mt-1">
                        {result.product.name}
                      </h2>
                    </div>

                    {/* Rationale explanation */}
                    <div className="bg-[#FAF8F5] border-l-2 border-[#110D09] p-4 text-xs sm:text-sm text-[#110D09]/85 font-light leading-relaxed">
                      {result.explanation}
                    </div>

                    {/* Verified Notes */}
                    <div>
                      <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono block mb-2 font-medium">
                        Available Verified Notes
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {result.product.notes.map((note) => (
                          <span
                            key={note}
                            className="text-xs tracking-wider bg-[#FAF8F5] text-[#110D09] px-3.5 py-1.5 border border-[#E8E2D8] font-serif"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pre-order Pricing */}
                    <div className="pt-2 border-t border-[#E8E2D8] flex items-baseline justify-between text-xs font-mono">
                      <span className="text-[#110D09]/60">Full Pre-Order: ₹{result.product.fullPrice}</span>
                      <span className="text-[#110D09] font-bold">
                        Or 70% Reserve: ₹{result.product.depositToday}
                      </span>
                    </div>

                    {/* CTAs */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/product/${result.product.slug}`}
                        className="btn-luxury-primary text-center flex-1"
                      >
                        View Fragrance & Pre-Order
                      </Link>
                      <Link
                        href="/collections/cacaoaveil"
                        className="btn-luxury-outline text-center flex-1"
                      >
                        Browse Full Collection
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Transparency Footnote */}
                <div className="text-[11px] text-[#110D09]/50 border-t border-[#E8E2D8] pt-4 flex items-center justify-between font-mono">
                  <span>
                    Recommendation calculated using verified product metadata & atelier scoring engine.
                  </span>
                  <span>Match Confidence: {result.matchScore}%</span>
                </div>
              </div>
            ) : (
              /* Honest Fallback */
              <div className="bg-white border border-[#E8E2D8] p-8 sm:p-12 text-center space-y-6 shadow-lg">
                <ShieldAlert className="w-12 h-12 text-[#110D09] mx-auto opacity-70" />
                <h3 className="text-2xl font-serif tracking-wide uppercase text-[#110D09]">
                  No Immediate Match In Current Launch
                </h3>
                <p className="text-sm text-[#110D09]/70 font-light max-w-lg mx-auto leading-relaxed">
                  {result?.explanation ||
                    'Your selections lean towards fragrance families currently in private atelier formulation (such as upcoming Silken Sambac and Roasted Zest). We invite you to explore our debut Cacaoaveil Collection.'}
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={restartQuiz}
                    className="btn-luxury-outline text-xs"
                  >
                    Adjust Quiz Answers
                  </button>
                  <Link href="/collections/cacaoaveil" className="btn-luxury-primary text-xs">
                    Browse Cacaoaveil
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
