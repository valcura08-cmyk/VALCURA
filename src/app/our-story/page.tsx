import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function OurStoryPage() {
  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Editorial Hero Header */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E8E2D8] bg-[#FAF8F5] text-center overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs tracking-luxury uppercase text-[#8C6D42] font-mono font-medium">
            Maison Philosophy
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif tracking-wide uppercase text-[#110D09]">
            Our Story
          </h1>
          <p className="text-base sm:text-lg font-serif italic text-[#8C6D42] max-w-lg mx-auto">
            A journey of passion, craft, and timeless expression.
          </p>
        </div>
      </section>

      {/* Main Narrative Articles */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-24">
        {/* Story Chapter 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-6">
            <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono font-medium">
              Part I • The Meaning of Scent
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-wide uppercase text-[#110D09]">
              Beyond A Finishing Touch
            </h2>
            <div className="w-10 h-px bg-[#110D09]" />
            <p className="text-sm sm:text-base text-[#110D09]/80 font-light leading-relaxed">
              At VALCURA, fragrance is never merely an accessory. It is an intimate language of
              self-expression — a quiet, unspoken presence that speaks before words are exchanged and
              lingers long after moments pass.
            </p>
            <p className="text-sm sm:text-base text-[#110D09]/80 font-light leading-relaxed">
              We reject the notion of a single static signature scent for an entire lifetime. A human
              being is multifaceted: vibrant in the morning, contemplative in the afternoon, bold and
              magnetic after hours.
            </p>
          </div>

          <div className="md:col-span-6 relative aspect-[4/5] bg-[#F8F5F0] border border-[#E8E2D8] overflow-hidden shadow-md">
            <Image
              src="/editorial/our-story-arch.jpg"
              alt="Atelier Sandstone Architecture"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Story Chapter 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 order-2 md:order-1 relative aspect-[4/3] bg-[#F8F5F0] border border-[#E8E2D8] overflow-hidden shadow-md">
            <Image
              src="/moods/coffee-date.jpg"
              alt="Intimate Conversations"
              fill
              className="object-cover"
            />
          </div>

          <div className="md:col-span-6 order-1 md:order-2 space-y-6">
            <span className="text-[11px] tracking-luxury uppercase text-[#8C6D42] font-mono font-medium">
              Part II • Occasions & Emotions
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-wide uppercase text-[#110D09]">
              The Many Sides of Who You Are
            </h2>
            <div className="w-10 h-px bg-[#110D09]" />
            <p className="text-sm sm:text-base text-[#110D09]/80 font-light leading-relaxed">
              Some hours demand the crisp, uplifting clarity of morning light; others ask for the
              reassuring warmth of familiar corners, the indulgence of a shared espresso, or the
              alluring depth of midnight conversations.
            </p>
            <p className="text-sm sm:text-base text-[#110D09]/80 font-light leading-relaxed">
              We design each olfactory profile to accompany an emotional state, allowing you to choose
              a scent that feels authentically personal in that specific breath of time.
            </p>
          </div>
        </div>

        {/* Story Campaign Climax Banner */}
        <div className="pt-6 sm:pt-10 space-y-8 text-center">
          <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-lg bg-[#110D09]">
            <Image
              src="/brand/valcura-mood-campaign-banner.jpg"
              alt="VALCURA - For Every Mood Atelier Campaign"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/collections/cacaoaveil"
              className="btn-luxury-primary text-xs tracking-luxury uppercase px-6 py-3"
            >
              Explore Cacaoaveil Collection
            </Link>
            <Link
              href="/moods"
              className="btn-luxury-secondary text-xs tracking-luxury uppercase px-6 py-3"
            >
              Discover Curated Moods
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}
