import React from 'react';

export default function PaymentInfoPage() {
  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-b border-[#E8E2D8] text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs tracking-luxury uppercase text-[#8C6D3F] font-mono">
            Transaction Architecture
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-[#110D09]">
            Payment Information
          </h1>
          <p className="text-xs sm:text-sm text-[#554D45] font-light">
            Verified Indian Payment Gateway & Pre-order Pricing Breakdown
          </p>
        </div>
      </section>

      {/* Main Content Card */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white border border-[#E8E2D8] p-8 sm:p-12 space-y-8 text-xs text-[#554D45] leading-relaxed font-light shadow-sm">
          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              Supported Payment Methods
            </h2>
            <p>
              VALCURA accepts all major payment instruments supported by licensed Indian payment
              gateways (UPI, Cards, NetBanking):
            </p>
            <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-[#554D45]">
              <li>Unified Payments Interface (UPI) — Google Pay, PhonePe, Paytm, BHIM, Cred</li>
              <li>Credit & Debit Cards — Visa, MasterCard, RuPay, American Express</li>
              <li>NetBanking across 50+ major Indian scheduled banks</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              Pre-Order Pricing Breakdown
            </h2>
            <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] space-y-2 font-mono text-[11px] text-[#110D09]">
              <p className="font-sans text-xs text-[#8C6D3F] font-semibold">Standard Retail Price: ₹500 / flacon</p>
              <p>• Promotional Pre-Order Rate: ₹399 / flacon (Save ₹101 instantly)</p>
              <p>• Direct UPI Payment to Merchant: Raghav Sindhwani (raghavsindhwanial@okicici)</p>
              <p>• Free cancellation within 24 hours via email with 100% full refund</p>
              <p>• 100% money back for transit damage reported within 24 hours</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-serif uppercase tracking-wide text-[#8C6D3F]">
              Security & PCI-DSS Compliance
            </h2>
            <p>
              All transactions are encrypted with 256-bit SSL encryption. VALCURA never stores or has
              access to customer credit or debit card numbers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
