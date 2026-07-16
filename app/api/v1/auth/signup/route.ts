import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const cookieStore = cookies();

  // Replace the old supabase initialization with this:
  const supabase = createServerClient(
    'https://hutpmvjocklspplywxke.supabase.co',
    'YOUR_ACTUAL_ANON_KEY_HERE', // <-- PASTE YOUR LONG eyJ... KEY HERE
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
