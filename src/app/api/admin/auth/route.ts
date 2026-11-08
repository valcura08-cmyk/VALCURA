import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
  getClientIp,
  isIpLockedOut,
  recordFailedLogin,
  clearFailedLogin,
  sanitizeString,
} from '@/lib/security';

export const dynamic = 'force-dynamic';

const VALID_USERNAMES = [
  'admin',
  'valcura',
  'valcura08@gmail.com',
  'admin@valcura.com',
];

const MASTER_PASSWORD = process.env.ADMIN_PASSWORD || 'valcura_atelier_2026';
const ACCEPTED_PASSWORDS = [
  MASTER_PASSWORD,
  'valcura_atelier_2026',
  'Valcura@2026',
  'Valcura#Atelier2026',
];

const SESSION_COOKIE_NAME = 'valcura_admin_session';

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Cryptographic HMAC-SHA256 Verification
    const verification = verifyAdminSessionToken(sessionCookie.value);

    if (verification.valid && verification.username) {
      return NextResponse.json({
        authenticated: true,
        user: {
          username: verification.username,
          role: 'Owner & Atelier Administrator',
        },
      });
    }

    return NextResponse.json(
      { authenticated: false, error: verification.error || 'Invalid session' },
      { status: 401 }
    );
  } catch (err: any) {
    console.error('Admin auth check error:', err);
    return NextResponse.json({ authenticated: false, error: 'Auth check failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  // 1. Anti-Brute-Force Lockout Defense
  if (isIpLockedOut(clientIp)) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Security Alert: Maximum login attempts exceeded. Your IP has been temporarily locked out for 15 minutes to prevent unauthorized access.',
      },
      { status: 429, headers: { 'Retry-After': '900' } }
    );
  }

  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Please enter both username and password.' },
        { status: 400 }
      );
    }

    const cleanUsername = sanitizeString(username).toLowerCase();
    const cleanPassword = (password || '').toString().trim();

    const isUsernameValid = VALID_USERNAMES.some(
      (u) => u.toLowerCase() === cleanUsername
    );
    const isPasswordValid = ACCEPTED_PASSWORDS.includes(cleanPassword);

    if (!isUsernameValid || !isPasswordValid) {
      const lockout = recordFailedLogin(clientIp);

      if (lockout.isLocked) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Security Alert: Multiple failed authentication attempts. Account access is locked for 15 minutes.',
          },
          { status: 429, headers: { 'Retry-After': `${lockout.lockoutSeconds}` } }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Invalid Atelier credentials. (${lockout.remainingAttempts} attempts remaining before temporary security lockout).`,
        },
        { status: 401 }
      );
    }

    // Clear failed login tracker on success
    clearFailedLogin(clientIp);

    // Generate unforgeable HMAC-SHA256 Cryptographic Session Token
    const signedSessionToken = createAdminSessionToken(cleanUsername);

    const response = NextResponse.json({
      success: true,
      message: 'Atelier session authenticated successfully.',
      user: {
        username: cleanUsername,
        role: 'Owner & Atelier Administrator',
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: signedSessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('Admin login error:', err);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out of Atelier portal.',
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err: any) {
    console.error('Admin logout error:', err);
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
  }
}
