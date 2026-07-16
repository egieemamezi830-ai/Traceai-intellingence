'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Up to 1 connected account',
      'Basic transaction analysis',
      'Limited AI explanations',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: [
      'Up to 5 connected accounts',
      'Advanced risk analysis',
      'Unlimited AI explanations',
      'Priority support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    price: 99,
    features: [
      'Unlimited connected accounts',
      'Enterprise risk analysis',
      'Dedicated account manager',
      'API access',
    ],
  },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('user_id');
      const response = await apiClient.post('/billing/subscribe', {
        user_id: userId,
        plan_tier: planId,
      });
      alert('Subscription updated successfully!');
      setCurrentPlan(planId);
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Billing Plans</h1>
          <p className="text-slate-400">Choose the perfect plan for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`card flex flex-col ${
                currentPlan === plan.id ? 'border-emerald-500 bg-emerald-900/10' : ''
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-slate-400">/month</span>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading || currentPlan === plan.id}
                className={`${
                  currentPlan === plan.id
                    ? 'btn-secondary'
                    : 'btn-primary'
                } disabled:opacity-50 w-full`}
              >
                {currentPlan === plan.id ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
