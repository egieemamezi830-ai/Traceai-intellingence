'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient_ } from '@/lib/supabase';
import { z } from 'zod';

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  country: z.string().length(2),
  timezone: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SignupSchema.parse(body);

    const supabase = createServerClient_();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user!.id,
          email: validatedData.email,
          first_name: validatedData.first_name,
          last_name: validatedData.last_name,
          country: validatedData.country,
          timezone: validatedData.timezone,
          preferred_currency: 'USD',
        },
      ])
      .select();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: 'Signup successful. Please verify your email.',
        user_id: authData.user!.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
