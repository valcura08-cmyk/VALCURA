import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { recordNewsletterLead } from '@/lib/cloudDb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source = 'footer' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const timestamp = new Date().toISOString();

    // 1. Store in local database
    const db = getDb();
    if (!db.settings) db.settings = {};
    if (!Array.isArray(db.settings.newsletterSubscribers)) {
      db.settings.newsletterSubscribers = [];
    }

    const existing = db.settings.newsletterSubscribers.find(
      (s: any) => s.email?.toLowerCase() === cleanEmail
    );

    if (!existing) {
      db.settings.newsletterSubscribers.push({
        email: cleanEmail,
        source,
        createdAt: timestamp,
      });
      saveDb(db);
    }

    // 2. Cloud DB sync (Supabase) if configured
    await recordNewsletterLead(cleanEmail, source);

    return NextResponse.json({
      success: true,
      message: 'Subscribed to VALCURA private journal successfully.',
    });
  } catch (err: any) {
    console.error('Newsletter subscription error:', err);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
