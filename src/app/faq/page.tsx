'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the VALCURA pre-order and reservation system work?',
      a: 'We offer two transparent purchasing avenues: Option 1 (Pay in full today at ₹450 per bottle, saving ₹50 off the standard ₹500 price) and Option 2 (Reserve with a 70% payment today at ₹329 per bottle, with the remaining balance of ₹141 payable when the batch is bottled and ready for dispatch. Total reservation plan is ₹470).',
    },
    {
      q: 'Will my card or account be automatically charged for the remaining ₹141 balance?',
      a: 'No. VALCURA never stores card credentials or initiates automatic recurring charges. When your fragrance becomes available, we send you an official availability notification containing a secure, personalized payment link (/pay-balance/[orderId]) where you actively finalize the remaining balance.',
    },
    {
      q: 'What fragrance notes make up Cacao Citrine?',
      a: 'Cacao Citrine is an exquisite unisex composition verified with three distinct accords: Citrus, Creamy Hazelnut, and Fresh. The coffee and chocolate lifestyle imagery represents the intimate mood and occasions associated with the experience, rather than synthetic food ingredients.',
    },
    {
      q: 'When will Silken Sambac and Roasted Zest become available?',
      a: 'Silken Sambac (For Her) and Roasted Zest (For Him) are currently in private atelier formulation. We show blurred teaser previews to provide a glimpse into the evolving Cacao Collection. As soon as formulation is finalized, pricing, verified notes, and pre-orders will be unlocked.',
    },
    {
      q: 'Are shipping charges included in my pre-order?',
      a: 'Yes. VALCURA provides complimentary insured delivery across India for all pre-orders. No hidden handling or shipping fees will be added at checkout.',
    },
    {
      q: 'Can I cancel or refund my 70% reservation deposit?',
      a: 'Yes. Reservation deposits are 100% refundable at any point prior to dispatch authorization. If your plans change before the balance payment request, simply contact our concierge team at care@valcurafragrance.com.',
    },
  ];

  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-b border-[#E8E2D8] text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs tracking-luxury uppercase text-[#8C6D3F] font-mono">
            Support & Inquiries
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-[#110D09]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#554D45] font-light">
            Answers to common questions regarding our pre-order protocol, reservation balances, and
            fragrance profiles.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E8E2D8] p-5 transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-serif tracking-wide text-[#110D09] hover:text-[#8C6D3F]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#8C6D3F] flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8C6D3F] flex-shrink-0 ml-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-[#E8E2D8] text-xs text-[#554D45] font-light leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
