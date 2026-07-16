import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Plaid webhook events
    if (body.webhook_type === 'TRANSACTIONS') {
      if (body.webhook_code === 'DEFAULT_UPDATE') {
        const itemId = body.item_id;
        const newTransactions = body.new_transactions;

        // Fetch account by Plaid item ID
        const { data: account } = await supabase
          .from('connected_accounts')
          .select('id, user_id')
          .eq('provider_item_id', itemId)
          .single();

        if (account) {
          // Insert new transactions
          await supabase.from('transactions').insert(
            newTransactions.map((txn: any) => ({
              user_id: account.user_id,
              account_id: account.id,
              external_id: txn.transaction_id,
              provider: 'plaid',
              merchant_name: txn.name,
              merchant_category: txn.personal_finance_category?.primary,
              amount: txn.amount,
              currency: txn.iso_currency_code,
              description: txn.name,
              transaction_type: 'purchase',
              status: 'posted',
              transaction_date: txn.date,
            }))
          );
        }
      }
    }

    return NextResponse.json({ processed: true });
  } catch (error: any) {
    console.error('Plaid webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
