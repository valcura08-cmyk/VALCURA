import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { recordContactInquiry } from '@/lib/cloudDb';

// Helper to generate consistent Account ID
function generateAccountId(email: string, phone: string = ''): string {
  const seed = (email + phone).toLowerCase();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const code = Math.abs(hash % 90000) + 10000;
  return `VAL-CUST-${code}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, category } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please provide your name, email, and message.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = (phone || '').toString().trim();
    const accountId = generateAccountId(cleanEmail, cleanPhone);

    const inquiry = {
      id: `inq_${Math.floor(100000 + Math.random() * 900000)}`,
      accountId,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      subject: (subject || 'General Inquiry').trim(),
      category: (category || (subject?.toLowerCase().includes('cancel') ? '24-Hour Cancellation' : subject?.toLowerCase().includes('damage') ? 'Damaged Bottle Guarantee' : 'Concierge Inquiry')).trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'New',
      adminNote: '',
    };

    // 1. Store locally in db.settings.contactInquiries
    const db = getDb();
    if (!db.settings) db.settings = {};
    if (!Array.isArray(db.settings.contactInquiries)) {
      db.settings.contactInquiries = [];
    }
    db.settings.contactInquiries.unshift(inquiry);
    saveDb(db);

    // 2. Cloud DB sync (Supabase) if configured
    await recordContactInquiry(inquiry);

    return NextResponse.json({
      success: true,
      message: 'Inquiry received. Our concierge will get back to you within 24 hours.',
      inquiryId: inquiry.id,
      accountId,
    });
  } catch (err: any) {
    console.error('Contact form submission error:', err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
