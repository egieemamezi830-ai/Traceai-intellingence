import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Trace AI - Transaction Intelligence',
  description: 'Understand, verify, monitor, and respond to financial transactions with AI-powered intelligence.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}
