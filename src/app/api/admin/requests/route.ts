import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb, saveDb } from '@/lib/db';
import { verifyAdminSessionToken, sanitizeString } from '@/lib/security';

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('valcura_admin_session');
    const auth = verifyAdminSessionToken(sessionCookie?.value);
    if (!auth.valid) {
      return NextResponse.json({ error: 'Unauthorized: Atelier session required' }, { status: 401 });
    }

    const db = getDb();
    const requests = Array.isArray(db.settings?.contactInquiries)
      ? db.settings.contactInquiries
      : [];
    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    console.error('Fetch requests error:', err);
    return NextResponse.json({ error: 'Failed to fetch customer requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('valcura_admin_session');
    const auth = verifyAdminSessionToken(sessionCookie?.value);
    if (!auth.valid) {
      return NextResponse.json({ error: 'Unauthorized: Atelier session required' }, { status: 401 });
    }

    const body = await req.json();
    const { requestId, status, adminNote, resolved } = body;

    const cleanRequestId = sanitizeString(requestId);
    if (!cleanRequestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    const db = getDb();
    if (!db.settings) db.settings = {};
    if (!Array.isArray(db.settings.contactInquiries)) {
      db.settings.contactInquiries = [];
    }

    const index = db.settings.contactInquiries.findIndex(
      (r: any) => r.id === requestId
    );

    if (index === -1) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    const currentReq = db.settings.contactInquiries[index];

    // Determine new status
    let newStatus = status || currentReq.status || 'New';
    if (resolved === true) {
      newStatus = 'Resolved';
    } else if (resolved === false) {
      newStatus = 'In Progress';
    }

    const updated = {
      ...currentReq,
      status: newStatus,
      adminNote: adminNote !== undefined ? adminNote : (currentReq.adminNote || ''),
      updatedAt: new Date().toISOString(),
      resolvedAt: newStatus === 'Resolved' ? (currentReq.resolvedAt || new Date().toISOString()) : null,
    };

    db.settings.contactInquiries[index] = updated;
    saveDb(db);

    return NextResponse.json({ success: true, request: updated });
  } catch (err: any) {
    console.error('Update request error:', err);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
