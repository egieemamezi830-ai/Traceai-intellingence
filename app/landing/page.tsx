'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full backdrop-blur-sm bg-slate-900/80 border-b border-slate-700 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">Trace AI</div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="text-slate-400 hover:text-white">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Know Your Money. Trust Every Transaction.
          </h1>
          <p className="text-2xl text-slate-400 mb-8">
            AI-powered transaction intelligence that explains what happened, why it happened, and whether you should worry.
          </p>
          <Link href="/auth/signup" className="btn-primary text-lg py-3 px-8 inline-block">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Universal Connection',
                description: 'Connect your bank accounts, credit cards, and digital wallets from anywhere in the world.',
              },
              {
                title: 'AI Analysis',
                description: 'Every transaction gets intelligent analysis with real-time risk scoring and fraud detection.',
              },
              {
                title: 'Actionable Intelligence',
                description: 'Get clear recommendations on whether to approve, monitor, or dispute any transaction.',
              },
              {
                title: 'Fraud Protection',
                description: 'Advanced fraud detection that learns your spending patterns and detects anomalies.',
              },
              {
                title: 'Dispute Management',
                description: 'Generate professional dispute letters with a single click. Get your money back faster.',
              },
              {
                title: 'AI Assistant',
                description: 'Ask natural language questions about your transactions and get instant insights.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="card">
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to take control?</h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of users who understand and trust their transactions with Trace AI.
          </p>
          <Link href="/auth/signup" className="btn-primary text-lg py-3 px-8 inline-block">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <p>&copy; 2024 Trace AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
