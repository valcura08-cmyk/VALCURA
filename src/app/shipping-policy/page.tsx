import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-b border-[#E8E2D8] text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs tracking-luxury uppercase text-[#8C6D3F] font-mono">
            Client Logistics
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-[#110D09]">
            Shipping & Dispatch Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#554D45] font-light">
            Last Updated: November 2026 • Official VALCURA Delivery Protocols
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white border border-[#E8E2D8] p-8 sm:p-12 space-y-8 text-xs text-[#554D45] leading-relaxed font-light shadow-sm">
          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              1. Complimentary Delivery Across India
            </h2>
            <p>
              VALCURA provides complimentary insured shipping for all pre-orders within India. There
              are no additional delivery fees or shipping surcharges added at checkout.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              2. Pre-Order Dispatch Timeline
            </h2>
            <p>
              Cacao Citrine is currently in pre-order allocation. Bottles are dispatched sequentially
              based on order confirmation timestamp once bottling is complete. Customers receive
              instant tracking updates via email and SMS when the consignment is handed over to our
              express courier partner.
            </p>
            <p className="text-[#888075] italic">
              [Note for Brand Owner: Estimated production completion and batch release dates can be
              updated directly in the admin settings.]
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              3. Courier Partners & Tracking
            </h2>
            <p>
              All shipments are dispatched through premium air express couriers (BlueDart, Delhivery,
              or equivalent) with tamper-evident protective seals and real-time transit tracking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
