import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_id, user_id, transaction_id } = await request.json();

    let actualConversationId = conversation_id;

    // Create conversation if needed
    if (!actualConversationId) {
      const { data: conv, error: convError } = await supabase
        .from('chat_conversations')
        .insert([
          {
            user_id,
            topic: 'transaction_inquiry',
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (convError) throw convError;
      actualConversationId = conv.id;
    }

    // Fetch recent transactions for context
    const { data: transactions } = await supabase
      .from('transactions')
      .select('merchant_name, amount, transaction_date')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Build context for AI
    const transactionContext = transactions
      ?.map(t => `- ${t.merchant_name}: $${t.amount} on ${t.transaction_date}`)
      .join('\n');

    // Get AI response
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a helpful financial assistant for Trace AI. Help users understand their transactions and manage their finances. 
Recent transactions:\n${transactionContext}`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 300,
    });

    const aiContent = response.choices[0].message.content || '';

    // Store chat messages
    await supabase.from('chat_messages').insert([
      {
        conversation_id: actualConversationId,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      },
      {
        conversation_id: actualConversationId,
        role: 'assistant',
        content: aiContent,
        tokens_used: response.usage?.total_tokens || 0,
        created_at: new Date().toISOString(),
      },
    ]);

    return NextResponse.json(
      {
        conversation_id: actualConversationId,
        role: 'assistant',
        content: aiContent,
        tokens_used: response.usage?.total_tokens || 0,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
