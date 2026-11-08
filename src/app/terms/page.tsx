import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-b border-[#E8E2D8] text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs tracking-luxury uppercase text-[#8C6D3F] font-mono">
            Legal Terms
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-[#110D09]">
            Terms and Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#554D45] font-light">
            Last Updated: November 2026 • VALCURA Terms of Service
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white border border-[#E8E2D8] p-8 sm:p-12 space-y-8 text-xs text-[#554D45] leading-relaxed font-light shadow-sm">
          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and purchasing from VALCURA, you agree to abide by these Terms and
              Conditions.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              2. Pre-Order &amp; Reservation Terms
            </h2>
            <p>
              Pre-orders for Cacao Citrine grant priority batch allocation at the exclusive promotional
              rate of ₹399 per flacon. Reservations can be cancelled free of charge within 24 hours of
              booking by emailing valcura08@gmail.com. Due to strict cosmetic hygiene regulations,
              opened or unsealed bottles cannot be returned. Damaged flacons reported within 24 hours of
              delivery are covered under our 100% money-back guarantee.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              3. Intellectual Property
            </h2>
            <p>
              The VALCURA name, distinctive V logo emblem, wordmark, formulations, and visual media are
              the exclusive intellectual property of VALCURA. Unauthorized reproduction or commercial
              exploitation is prohibited.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
