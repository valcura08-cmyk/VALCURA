import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-b border-[#E8E2D8] text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs tracking-luxury uppercase text-[#8C6D3F] font-mono">
            Privacy & Trust
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-[#110D09]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#554D45] font-light">
            Last Updated: November 2026 • House of VALCURA
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white border border-[#E8E2D8] p-8 sm:p-12 space-y-8 text-xs text-[#554D45] leading-relaxed font-light shadow-sm">
          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              1. Information We Collect
            </h2>
            <p>
              When you reserve or purchase a fragrance on the VALCURA website, we collect your name,
              email address, contact telephone number, and postal delivery address solely to process
              your order, provide tracking updates, and dispatch your reservation.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              2. Fragrance Finder Privacy
            </h2>
            <p>
              Selections made in our interactive Fragrance Finder quiz (occasions, moods, notes,
              scent direction) are processed on our secure server to generate your personal
              recommendation and are never linked to sensitive personal profiling.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              3. Data Retention & Third Parties
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third-party advertisers. Data
              is shared strictly with logistics and courier carriers to execute physical delivery.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
