import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
const SESSION_SECRET_TOKEN = 'valcura_auth_session_token_verified_2026';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (sessionCookie && sessionCookie.value === SESSION_SECRET_TOKEN) {
      return NextResponse.json({
        authenticated: true,
        user: {
          username: 'valcura08@gmail.com',
          role: 'Owner & Atelier Administrator',
        },
      });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err: any) {
    console.error('Admin auth check error:', err);
    return NextResponse.json({ authenticated: false, error: 'Auth check failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Please enter both username and password.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    const isUsernameValid = VALID_USERNAMES.some(
      (u) => u.toLowerCase() === cleanUsername
    );
    const isPasswordValid = ACCEPTED_PASSWORDS.includes(cleanPassword);

    if (!isUsernameValid || !isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Atelier credentials. Please check your username and password.',
        },
        { status: 401 }
      );
    }

    // Set HTTP-only secure cookie for 30 days
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
      value: SESSION_SECRET_TOKEN,
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
