import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { recordContactInquiry, recordNewsletterLead } from '@/lib/cloudDb';
import { sendRestockNotification } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, name, product = 'Cacao Citrine' } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address so we can notify you.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = (phone || '').toString().trim();
    const cleanName = (name || '').toString().trim();
    const timestamp = new Date().toISOString();

    // 1. Save in local database
    const db = getDb();
    if (!db.settings) db.settings = {};
    if (!Array.isArray(db.settings.restockWaitlist)) {
      db.settings.restockWaitlist = [];
    }

    const existingIndex = db.settings.restockWaitlist.findIndex(
      (item: any) => item.email?.toLowerCase() === cleanEmail && item.product === product
    );

    const leadEntry = {
      id: `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      email: cleanEmail,
      phone: cleanPhone,
      name: cleanName,
      product,
      createdAt: timestamp,
      notified: false,
    };

    if (existingIndex >= 0) {
      db.settings.restockWaitlist[existingIndex] = {
        ...db.settings.restockWaitlist[existingIndex],
        phone: cleanPhone || db.settings.restockWaitlist[existingIndex].phone,
        updatedAt: timestamp,
      };
    } else {
      db.settings.restockWaitlist.unshift(leadEntry);
    }

    // Also register in newsletter list
    if (!Array.isArray(db.settings.newsletterSubscribers)) {
      db.settings.newsletterSubscribers = [];
    }
    if (!db.settings.newsletterSubscribers.some((s: any) => s.email?.toLowerCase() === cleanEmail)) {
      db.settings.newsletterSubscribers.push({
        email: cleanEmail,
        source: `waitlist-${product.toLowerCase().replace(/\s+/g, '-')}`,
        createdAt: timestamp,
      });
    }

    saveDb(db);

    // 2. Cloud DB Sync (Supabase)
    try {
      await recordContactInquiry({
        id: leadEntry.id,
        name: cleanName || 'Waitlist Customer',
        email: cleanEmail,
        subject: `🔔 Restock Slot Request: ${product}`,
        message: `Customer joined next slot priority waitlist for ${product}. Phone/WhatsApp: ${cleanPhone || 'None'}. Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST.`,
        createdAt: timestamp,
      });
      await recordNewsletterLead(cleanEmail, `waitlist:${product}`);
    } catch (cloudErr) {
      console.error('Cloud DB sync notice:', cloudErr);
    }

    // 3. Dispatch Email Alert to valcura08@gmail.com
    await sendRestockNotification({
      email: cleanEmail,
      phone: cleanPhone,
      name: cleanName,
      product,
      source: 'Next Slot Notify Form',
    });

    return NextResponse.json({
      success: true,
      message: `Thank you! You are on our VIP priority list. We will email you at ${cleanEmail} the moment our new batch slot opens.`,
      email: cleanEmail,
    });
  } catch (err: any) {
    console.error('Error in notify-restock API:', err);
    return NextResponse.json(
      { error: 'Could not record notification request. Please try again or WhatsApp us directly.' },
      { status: 500 }
    );
  }
}
