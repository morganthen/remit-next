import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Invoice } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function averageInvoiceAmount(invoices: { amount: number }[]): number {
  if (!invoices.length) return 0;
  const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  return total / invoices.length;
}

export function rollingAverageIncome(invoices: Invoice[]): number {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recent = invoices.filter((inv) => {
    const dateStr = inv.paid_at ?? inv.created_at;
    const date = new Date(dateStr);
    return (
      inv.status === 'paid' &&
      !isNaN(date.getTime()) &&
      date >= sevenDaysAgo &&
      date <= now
    );
  });

  if (!recent.length) return 0;

  const total = recent.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  return total / 7;
}
