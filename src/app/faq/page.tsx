'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the VALCURA pre-order system work?',
      a: 'Secure your handcrafted 50 ML bottle of Cacao Citrine at an exclusive introductory pre-order price of ₹399 (MRP ₹599). Your booking is confirmed immediately with free insured courier delivery across all Indian pin codes and zero hidden charges.',
    },
    {
      q: 'When will fresh stock / the next batch slot open for Cacao Citrine?',
      a: 'Because Cacao Citrine is handcrafted in limited batches in India, slots fill very quickly! When a batch is sold out, simply enter your email on the product page. You will receive a direct notification the second our new slot arrives. You can also chat with Raghav on WhatsApp (+91 6378582047) for priority VIP reservation.',
    },
    {
      q: 'What is your cancellation and return policy?',
      a: 'We offer 100% free cancellation within 24 hours of placing your order—simply email valcura08@gmail.com or WhatsApp Raghav at +91 6378582047. If your perfume bottle arrives damaged during courier transit, we offer 100% money back or an immediate free replacement when notified within 24 hours of delivery.',
    },
    {
      q: 'What fragrance notes make up Cacao Citrine?',
      a: 'Cacao Citrine is a long-lasting unisex Eau de Parfum crafted for Indian weather with three distinct accords: Sparkling Citrus (Top Note), Creamy Chocolate & Vanilla (Heart Note), and Warm Amber Rose (Base Note).',
    },
    {
      q: 'When will Silken Sambac and Roasted Zest become available?',
      a: 'Silken Sambac (For Her) and Roasted Zest (For Him) are currently in private atelier formulation. We show blurred teaser previews to provide a glimpse into the evolving Cacaoaveil Collection. As soon as formulation is finalized, pricing, verified notes, and pre-orders will be unlocked.',
    },
    {
      q: 'Are shipping charges included in my pre-order?',
      a: 'Yes. VALCURA provides complimentary insured delivery across India for all pre-orders. No hidden handling or shipping fees will be added at checkout.',
    },
    {
      q: 'How long does an approved refund take to reach my account?',
      a: 'Once your 24-hour cancellation or verified transit claim is processed by our concierge, your 100% refund is credited back to your original payment method (UPI / Bank Account) within 3–5 business days.',
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
