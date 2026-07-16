'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export default function RiskCenterPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    high_risk: 0,
    medium_risk: 0,
    low_risk: 0,
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await apiClient.get('/analysis/alerts');
      setAlerts(response.data.alerts);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Risk Center</h1>
          <p className="text-slate-400">Monitor fraud alerts and suspicious activity</p>
        </div>

        {/* Risk Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">High Risk</p>
            <p className="text-3xl font-bold text-red-400">{stats.high_risk}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Medium Risk</p>
            <p className="text-3xl font-bold text-amber-400">{stats.medium_risk}</p>
          </div>
          <div className="card">
            <p className="text-slate-400 text-sm mb-1">Low Risk</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.low_risk}</p>
          </div>
        </div>

        {/* Alerts Timeline */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-6">Alert Timeline</h2>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No alerts. Your account looks good!</p>
            ) : (
              alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    alert.risk_level === 'high'
                      ? 'bg-red-900/20 border-red-700'
                      : alert.risk_level === 'medium'
                      ? 'bg-amber-900/20 border-amber-700'
                      : 'bg-emerald-900/20 border-emerald-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{alert.title}</p>
                      <p className="text-sm text-slate-400 mt-1">{alert.description}</p>
                    </div>
                    <span className="text-xs text-slate-400">{alert.date}</span>
                  </div>
                  {alert.action && (
                    <button className="mt-2 text-sm text-emerald-400 hover:text-emerald-300">
                      {alert.action}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
