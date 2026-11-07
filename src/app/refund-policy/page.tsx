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
              1. 100% Refundable Pre-Order Deposits
            </h2>
            <p>
              We honor your trust. Any 70% reservation deposit (₹329 per bottle) paid towards Cacao
              Citrine is 100% refundable at any time prior to the final balance payment and dispatch
              authorization.
            </p>
            <p>
              If you decide not to proceed with your reservation when the fragrance becomes available,
              simply contact concierge at care@valcurafragrance.com and we will issue a full refund to
              your original payment method within 5–7 business days.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              2. Full Payment Cancellations
            </h2>
            <p>
              Orders paid in full (₹450 per bottle) can be modified or cancelled free of charge at any
              point before dispatch begins. Once dispatched with a live tracking number, returns are
              accepted for unopened, factory-sealed boxes in the event of transit damage.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              3. Transit Damaged or Defective Items
            </h2>
            <p>
              In the unlikely event of bottle leakage or damaged packaging during courier handling,
              please share photographs with concierge within 48 hours of delivery for an immediate
              replacement flacon or 100% full refund.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
