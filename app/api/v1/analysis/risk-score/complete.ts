import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

interface RiskFactor {
  factor: string;
  score: number;
  weight: number;
  explanation: string;
}

export async function POST(request: NextRequest) {
  try {
    const { transaction_id, user_id } = await request.json();

    // Fetch transaction
    const { data: transaction, error: txnError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transaction_id)
      .single();

    if (txnError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Fetch user's transaction history
    const { data: userTransactions } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', user_id)
      .eq('merchant_id', transaction.merchant_id);

    // Calculate risk factors
    const riskFactors: RiskFactor[] = [];
    let riskScore = 0;

    // Factor 1: Amount deviation
    if (userTransactions && userTransactions.length > 0) {
      const avgAmount =
        userTransactions.reduce((sum: number, t: any) => sum + t.amount, 0) /
        userTransactions.length;
      const deviation = Math.abs(transaction.amount - avgAmount) / avgAmount;

      if (deviation > 0.5) {
        const factor_score = Math.min(40, deviation * 100);
        riskScore += factor_score * 0.3;
        riskFactors.push({
          factor: 'Amount Deviation',
          score: Math.round(factor_score),
          weight: 0.3,
          explanation: `Transaction amount is ${Math.round(deviation * 100)}% different from your average`,
        });
      }
    }

    // Factor 2: Frequency
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentTransactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user_id)
      .eq('merchant_id', transaction.merchant_id)
      .gt('created_at', oneDayAgo);

    if (recentTransactions && recentTransactions.length > 3) {
      const frequency_score = Math.min(30, recentTransactions.length * 10);
      riskScore += frequency_score * 0.2;
      riskFactors.push({
        factor: 'High Frequency',
        score: frequency_score,
        weight: 0.2,
        explanation: `${recentTransactions.length} transactions in the last 24 hours`,
      });
    }

    // Factor 3: Merchant reputation
    const { data: merchant } = await supabase
      .from('merchants')
      .select('fraud_report_count, reputation_score')
      .eq('id', transaction.merchant_id)
      .single();

    if (merchant && merchant.fraud_report_count > 50) {
      const merchant_score = Math.min(35, merchant.fraud_report_count * 0.5);
      riskScore += merchant_score * 0.25;
      riskFactors.push({
        factor: 'Merchant Risk',
        score: merchant_score,
        weight: 0.25,
        explanation: `Merchant has ${merchant.fraud_report_count} fraud reports`,
      });
    }

    // Generate AI explanation using OpenAI
    let aiExplanation = '';
    let recommendation = 'approve';

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Analyze this transaction and provide a brief explanation:
Merchant: ${transaction.merchant_name}
Amount: $${transaction.amount}
Risk Factors: ${riskFactors.map(f => f.explanation).join(', ')}
Provide a 2-3 sentence explanation of the risk level and whether it's likely fraud.`,
          },
        ],
        max_tokens: 150,
      });

      aiExplanation = response.choices[0].message.content || '';

      // Determine recommendation
      if (riskScore > 70) {
        recommendation = 'contact_bank';
      } else if (riskScore > 50) {
        recommendation = 'monitor';
      }
    } catch (error) {
      console.error('OpenAI error:', error);
      aiExplanation = 'Unable to generate AI analysis at this time.';
    }

    // Store analysis in database
    // Change this:
const { data: analysis, error } = await supabase.from('transaction_analysis').insert([...]);

// To this (renaming 'analysis' to 'result'):
const { data: result, error } = await supabase.from('transaction_analysis').insert([...]);
          transaction_id,
          risk_score: Math.round(riskScore),
          risk_level: riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low',
          fraud_probability: Math.min(100, riskScore),
          risk_factors: riskFactors,
          ai_explanation: aiExplanation,
          ai_recommendation: recommendation,
          analyzed_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (analysisError) {
      console.error('Analysis storage error:', analysisError);
    }

    return NextResponse.json(
      {
        risk_score: Math.round(riskScore),
        risk_level: riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low',
        risk_factors: riskFactors,
        ai_explanation: aiExplanation,
        ai_recommendation: recommendation,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Risk analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
