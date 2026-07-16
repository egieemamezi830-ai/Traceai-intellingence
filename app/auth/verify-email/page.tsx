'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleContinue = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-slate-400">
              We've sent a verification link to {email || 'your email address'}
            </p>
          </div>

          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-slate-300 mb-2">
              <span className="font-semibold">What to do:</span>
            </p>
            <ol className="text-sm text-slate-400 space-y-2 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the verification link</li>
              <li>Return here to continue</li>
            </ol>
          </div>

          <button
            onClick={handleContinue}
            className="w-full btn-primary"
          >
            Continue to Sign In
          </button>

          <p className="text-center text-slate-400 mt-4">
            Didn't receive the email?{' '}
            <a href="/auth/signup" className="text-emerald-400 hover:text-emerald-300">
              Try again
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
