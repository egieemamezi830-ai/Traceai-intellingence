export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'high':
      return 'text-red-400';
    case 'medium':
      return 'text-amber-400';
    case 'low':
      return 'text-emerald-400';
    default:
      return 'text-slate-400';
  }
}

export function getRiskBgColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'high':
      return 'bg-red-900/30 border-red-700';
    case 'medium':
      return 'bg-amber-900/30 border-amber-700';
    case 'low':
      return 'bg-emerald-900/30 border-emerald-700';
    default:
      return 'bg-slate-700/30 border-slate-600';
  }
}
