import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-b border-[#E8E2D8] text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs tracking-luxury uppercase text-[#8C6D3F] font-mono">
            Client Assurance
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-[#110D09]">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#554D45] font-light">
            Last Updated: November 2026 • Transparent Reservation Protections
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white border border-[#E8E2D8] p-8 sm:p-12 space-y-8 text-xs text-[#554D45] leading-relaxed font-light shadow-sm">
          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              1. 24-Hour Complimentary Cancellation
            </h2>
            <p>
              We provide free, zero-fee cancellation within 24 hours of placing your pre-order.
              If you wish to cancel or modify your reservation for any reason, simply send an email
              to our concierge at{' '}
              <a
                href="mailto:care@valcurafragrance.com"
                className="text-[#110D09] font-medium underline hover:text-[#8C6D3F]"
              >
                care@valcurafragrance.com
              </a>{' '}
              within 24 hours mentioning your Order ID and the reason for cancellation. We will
              promptly cancel your order and initiate a 100% full refund back to your original
              payment method.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              2. Opened Bottle &amp; Hygiene Policy
            </h2>
            <p>
              As a luxury personal fragrance house, we uphold the strictest hygiene, health, and
              cosmetic safety protocols. Because perfume is an intimate personal-care product,{' '}
              <strong className="text-[#110D09] font-medium">
                we cannot take the bottle back or accept returns once the bottle has been opened, unsealed, or sprayed.
              </strong>
            </p>
            <p>
              We recommend reviewing our detailed olfactory breakdown (Top: Citrus, Heart: Creamy
              Hazelnut &amp; Vanilla, Base: Rose &amp; Fresh) on the product page before unsealing
              your flacon.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              3. 100% Money-Back Guarantee for Transit Damage (Report Within 24 Hours)
            </h2>
            <p>
              Every VALCURA flacon is packaged in reinforced luxury protective housing. In the
              unfortunate event that your bottle arrives damaged, cracked, or leaking due to courier
              mishandling, we offer a{' '}
              <strong className="text-[#110D09] font-medium">100% full money-back refund</strong> or
              an immediate priority replacement flacon at no additional cost.
            </p>
            <p>
              To claim transit damage protection, simply contact us at{' '}
              <a
                href="mailto:care@valcurafragrance.com"
                className="text-[#110D09] font-medium underline hover:text-[#8C6D3F]"
              >
                care@valcurafragrance.com
              </a>{' '}
              within <strong className="text-[#110D09] font-medium">24 hours of delivery</strong> with
              your Order ID and clear photographs of the damaged bottle and outer carton packaging.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#E8E2D8]">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              4. Refund Processing Timeframe
            </h2>
            <p>
              Once your 24-hour cancellation request or damaged shipment report is verified by our
              concierge team, your 100% refund will be issued directly to your original payment
              source (UPI / Bank Account) within 3–5 business days.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
