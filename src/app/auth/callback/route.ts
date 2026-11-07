import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { upsertCustomerProfile } from '@/lib/cloudDb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/account';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (code && supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.session?.user) {
      const user = data.session.user;
      const email = user.email || '';
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        email.split('@')[0];

      if (email) {
        await upsertCustomerProfile({
          fullName,
          email,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/`);
}
