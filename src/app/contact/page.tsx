'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Instagram } from 'lucide-react';

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', category: 'General Inquiry', subject: '', message: '' });
      } else {
        setErrorMsg(data.error || 'Failed to submit message. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-[#110D09] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-b border-[#E8E2D8] text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs tracking-luxury uppercase text-[#8C6D3F] font-mono">
            Client Concierge
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-wide uppercase text-[#110D09]">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-[#554D45] font-light">
            Our customer concierge is dedicated to assisting you with order inquiries, pre-order
            reservations, and bespoke scent recommendations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="md:col-span-5 space-y-8">
            <div className="bg-[#FAF8F5] border border-[#E8E2D8] p-6 space-y-6 shadow-sm">
              <span className="text-xs tracking-luxury uppercase text-[#8C6D3F] font-mono block">
                Official Channels
              </span>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-[#8C6D3F] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#888075] block font-mono">Concierge Email:</span>
                    <a
                      href="mailto:valcura08@gmail.com"
                      className="text-[#110D09] hover:text-[#8C6D3F] font-medium"
                    >
                      valcura08@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Instagram className="w-4 h-4 text-[#8C6D3F] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#888075] block font-mono">Official Instagram:</span>
                    <a
                      href="https://www.instagram.com/valcura__?cplk=MWdscXZoN3BqY3Q3NQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#110D09] hover:text-[#8C6D3F] font-medium"
                    >
                      @valcura__
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-[#8C6D3F] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#888075] block font-mono">Client Helpline:</span>
                    <a
                      href="tel:+916378582047"
                      className="text-[#110D09] hover:text-[#8C6D3F] font-medium transition-colors"
                    >
                      +91 63785 82047
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-[#8C6D3F] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#888075] block font-mono">VALCURA Headquarters:</span>
                    <span className="text-[#110D09] font-medium">Jaipur, Rajasthan, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="md:col-span-7">
            <div className="bg-white border border-[#E8E2D8] p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#8C6D3F] mx-auto" />
                  <h3 className="text-2xl font-serif text-[#110D09]">Message Received</h3>
                  <p className="text-xs text-[#554D45] font-light max-w-sm mx-auto">
                    Thank you for contacting VALCURA. Our client concierge will review your inquiry
                    and respond within 24 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn-luxury-outline text-xs mt-4"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-serif uppercase tracking-wide text-[#110D09]">
                    Send A Message
                  </h3>
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#554D45] font-light mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-3 text-[#110D09] focus:outline-none focus:border-[#8C6D3F]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#554D45] font-light mb-1">Mobile Number (with WhatsApp)</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-3 text-[#110D09] focus:outline-none focus:border-[#8C6D3F]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#554D45] font-light mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-3 text-[#110D09] focus:outline-none focus:border-[#8C6D3F]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#554D45] font-light mb-1">Inquiry Purpose</label>
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-3 text-[#110D09] focus:outline-none focus:border-[#8C6D3F]"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Pre-Order Status">Pre-Order & Delivery Status</option>
                          <option value="24-Hour Cancellation">24-Hour Free Cancellation Request</option>
                          <option value="Damaged Bottle Guarantee">Damaged Bottle (100% Money Back Claim)</option>
                          <option value="Address Update">Delivery Address / Landmark Update</option>
                          <option value="Fragrance Consultation">Bespoke Fragrance Consultation</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#554D45] font-light mb-1">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="e.g. Cacao Citrine Pre-order inquiry"
                        className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-3 text-[#110D09] focus:outline-none focus:border-[#8C6D3F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#554D45] font-light mb-1">Message *</label>
                      <textarea
                        rows={4}
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-[#FAF8F5] border border-[#D5CDC2] p-3 text-[#110D09] focus:outline-none focus:border-[#8C6D3F]"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="bg-red-50 border border-red-300 p-3 text-xs text-red-700">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-luxury-primary py-3.5 text-xs tracking-luxury uppercase flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{loading ? 'Transmitting...' : 'Transmit Message'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
