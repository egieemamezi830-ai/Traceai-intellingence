'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dashboard initialization
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your financial intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome to Trace AI</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Total Balance</p>
            <p className="text-3xl font-bold text-white">$24,567</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">This Week</p>
            <p className="text-3xl font-bold text-red-400">-$892</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Fraud Risk</p>
            <p className="text-3xl font-bold text-emerald-400">Low ✓</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Pending Alerts</p>
            <p className="text-3xl font-bold text-amber-400">2</p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div>
                <p className="font-semibold text-white">Best Buy</p>
                <p className="text-sm text-slate-400">Electronics</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">-$89.99</p>
                <p className="text-sm text-slate-400">Today</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div>
                <p className="font-semibold text-white">Starbucks</p>
                <p className="text-sm text-slate-400">Coffee Shop</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">-$5.50</p>
                <p className="text-sm text-slate-400">Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
