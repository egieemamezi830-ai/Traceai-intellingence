import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });

export async function POST(request: NextRequest) {
  try {
    const { user_id, plan_tier } = await request.json();

    // Get user email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or get Stripe customer
    let customerId: string;
    const { data: existingUser } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user_id)
      .single();

    if (existingUser?.stripe_customer_id) {
      customerId = existingUser.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await supabase.from('users').update({ stripe_customer_id: customerId }).eq('id', user_id);
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Trace AI ${plan_tier} Plan`,
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: plan_tier === 'pro' ? 2999 : plan_tier === 'business' ? 9999 : 0,
          },
        },
      ],
    });

    // Update user subscription
    await supabase
      .from('users')
      .update({
        subscription_tier: plan_tier,
        subscription_status: 'active',
        stripe_subscription_id: subscription.id,
      })
      .eq('id', user_id);

    return NextResponse.json(
      {
        subscription_id: subscription.id,
        status: subscription.status,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
