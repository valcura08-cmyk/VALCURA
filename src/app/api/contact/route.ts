import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { recordContactInquiry } from '@/lib/cloudDb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please provide your name, email, and message.' },
        { status: 400 }
      );
    }

    const inquiry = {
      id: `inq_${Math.floor(100000 + Math.random() * 900000)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'New',
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
    });
  } catch (err: any) {
    console.error('Contact form submission error:', err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
