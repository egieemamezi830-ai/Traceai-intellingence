'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { Transaction, TransactionAnalysis } from '@/lib/types';
import { formatCurrency, formatDate, getRiskBgColor } from '@/lib/utils';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analysis, setAnalysis] = useState<Record<string, TransactionAnalysis>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await apiClient.get('/transactions?limit=50');
      setTransactions(response.data.transactions);
      
      // Fetch analysis for each transaction
      response.data.transactions.forEach(async (txn: Transaction) => {
        const analysisRes = await apiClient.get(`/transactions/${txn.id}`);
        setAnalysis(prev => ({
          ...prev,
          [txn.id]: analysisRes.data.analysis,
        }));
      });
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    if (filter === 'high') {
      const txnAnalysis = analysis[txn.id];
      return txnAnalysis?.risk_level === 'high';
    }
    if (filter === 'medium') {
      const txnAnalysis = analysis[txn.id];
      return txnAnalysis?.risk_level === 'medium';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-slate-400">View and analyze your financial transactions</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'all', label: 'All' },
            { value: 'high', label: 'High Risk' },
            { value: 'medium', label: 'Medium Risk' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === option.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-slate-400">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map(txn => {
              const txnAnalysis = analysis[txn.id];
              const riskColor = txnAnalysis ? getRiskBgColor(txnAnalysis.risk_level) : '';
              
              return (
                <a
                  key={txn.id}
                  href={`/transactions/${txn.id}`}
                  className="card hover:border-emerald-600 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{txn.merchant_name}</p>
                      <p className="text-sm text-slate-400">
                        {txn.merchant_category} • {formatDate(txn.transaction_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {txnAnalysis && (
                        <div className={`px-3 py-1 rounded-full border ${riskColor}`}>
                          <p className="text-sm font-semibold">
                            {txnAnalysis.risk_level.charAt(0).toUpperCase() + txnAnalysis.risk_level.slice(1)}
                          </p>
                        </div>
                      )}
                      <p className={`font-semibold ${
                        txn.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount, txn.currency)}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
