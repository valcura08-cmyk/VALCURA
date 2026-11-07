import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { upsertCustomerProfile } from '@/lib/cloudDb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'login', email, fullName, phone, provider = 'email' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName?.trim() || cleanEmail.split('@')[0];
    const timestamp = new Date().toISOString();

    const db = getDb();
    if (!db.settings) db.settings = {};
    if (!Array.isArray(db.settings.registeredUsers)) {
      db.settings.registeredUsers = [];
    }

    const existingIndex = db.settings.registeredUsers.findIndex(
      (u: any) => u.email?.toLowerCase() === cleanEmail
    );

    let userRecord: any;

    if (existingIndex !== -1) {
      // Existing user: Update last active
      userRecord = db.settings.registeredUsers[existingIndex];
      userRecord.lastLoginAt = timestamp;
      if (fullName && fullName.trim()) userRecord.fullName = cleanName;
      if (phone && phone.trim()) userRecord.phone = phone.trim();
      db.settings.registeredUsers[existingIndex] = userRecord;
    } else {
      // New registration
      userRecord = {
        id: `usr_${Math.floor(100000 + Math.random() * 900000)}`,
        email: cleanEmail,
        fullName: cleanName,
        phone: phone?.trim() || '',
        provider: provider || 'email',
        registeredAt: timestamp,
        lastLoginAt: timestamp,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      };
      db.settings.registeredUsers.unshift(userRecord);
    }

    saveDb(db);

    // Persist to Cloud Database (Supabase)
    await upsertCustomerProfile({
      fullName: userRecord.fullName,
      email: userRecord.email,
      phone: userRecord.phone,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        fullName: userRecord.fullName,
        phone: userRecord.phone || '',
        provider: userRecord.provider || 'email',
        memberSince: userRecord.memberSince || 'November 2026',
      },
    });
  } catch (err: any) {
    console.error('Auth processing error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
