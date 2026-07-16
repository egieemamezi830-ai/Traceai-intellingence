import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sig = request.headers.get('stripe-signature')!;

    // Verify webhook signature (simplified - add proper verification)
    // const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    // Handle subscription events
    if (body.type === 'customer.subscription.updated') {
      const subscription = body.data.object;
      const userId = subscription.metadata?.user_id;

      if (userId) {
        await supabase
          .from('users')
          .update({
            subscription_status: subscription.status,
          })
          .eq('id', userId);
      }
    }

    if (body.type === 'customer.subscription.deleted') {
      const subscription = body.data.object;
      const userId = subscription.metadata?.user_id;

      if (userId) {
        await supabase
          .from('users')
          .update({
            subscription_tier: 'free',
            subscription_status: 'cancelled',
          })
          .eq('id', userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
