import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const { email, password, first_name, last_name, country, timezone } = await request.json();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
        },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert([
      {
        id: authData.user!.id,
        email,
        first_name,
        last_name,
        country,
        timezone,
        preferred_currency: 'USD',
        email_verified: false,
      },
    ]);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // Create user settings
    await supabase.from('user_settings').insert([
      {
        user_id: authData.user!.id,
        email_alerts_enabled: true,
        theme: 'dark',
      },
    ]);

    return NextResponse.json(
      {
        message: 'Signup successful. Check your email to verify.',
        user_id: authData.user!.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
