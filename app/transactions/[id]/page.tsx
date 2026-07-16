'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { Transaction, TransactionAnalysis } from '@/lib/types';
import { formatCurrency, formatDate, getRiskColor } from '@/lib/utils';

export default function TransactionDetailPage() {
  const params = useParams();
  const transactionId = params.id as string;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [analysis, setAnalysis] = useState<TransactionAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await apiClient.get(`/transactions/${transactionId}`);
        setTransaction(response.data);
        setAnalysis(response.data.analysis);
      } catch (error) {
        console.error('Failed to fetch transaction:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!transaction || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-slate-400">Transaction not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a href="/transactions" className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block">
          ← Back to Transactions
        </a>

        {/* Merchant Info */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{transaction.merchant_name}</h1>
              <p className="text-slate-400">{transaction.merchant_category}</p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${
                transaction.amount > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount, transaction.currency)}
              </p>
              <p className="text-slate-400">{formatDate(transaction.transaction_date)}</p>
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Risk Analysis</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm">Risk Score</p>
              <p className={`text-3xl font-bold ${getRiskColor(analysis.risk_level)}`}>
                {analysis.risk_score}/100
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Risk Level</p>
              <p className={`text-2xl font-bold ${getRiskColor(analysis.risk_level)}`}>
                {analysis.risk_level.charAt(0).toUpperCase() + analysis.risk_level.slice(1)}
              </p>
            </div>
          </div>

          {analysis.risk_factors.length > 0 && (
            <div className="mt-6">
              <p className="text-slate-300 font-semibold mb-3">Risk Factors:</p>
              <div className="space-y-2">
                {analysis.risk_factors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 bg-slate-700/30 rounded">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white font-medium">{factor.factor}</p>
                      <p className="text-slate-400 text-sm">{factor.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Explanation */}
        {analysis.ai_explanation && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-white mb-4">AI Analysis</h2>
            <p className="text-slate-300 leading-relaxed">{analysis.ai_explanation}</p>
          </div>
        )}

        {/* Recommendation */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Recommended Action</h2>
          <p className="text-emerald-400 font-semibold text-lg">
            {analysis.ai_recommendation.charAt(0).toUpperCase() + analysis.ai_recommendation.slice(1).replace(/_/g, ' ')}
          </p>
          <div className="flex gap-3 mt-4">
            <button className="btn-primary">
              Approve
            </button>
            <button className="btn-secondary">
              Dispute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
