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

// This will only work on single word strings
// This might be fine for your use case
// Point of study: YAGNI (You Aren't Gonna Need It) - don't over-engineer solutions for problems you don't have yet. In this case, if we wanted to support multi-word strings, we could use a library like lodash which has a capitalize function that handles this case, or we could implement it ourselves by splitting the string into words, capitalizing each word, and then joining them back together. But for our current use case, this simple implementation is sufficient.
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// This function is solving a general problem, but you've tied it to a particular domain
// This makes it less reusable, if I want to average something other than invoice amounts, I can't use this function.
export function averageInvoiceAmount(invoices: { amount: number }[]): number {
  if (!invoices.length) return 0;
  const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  return total / invoices.length;
}
// a more re-usable example:
// const averageAmount = average_simple(invoices, inv => inv.amount);
export function average_simple<T>(items: T[], valueFn: (item: T) => number): number {
  if (!items.length) return 0;
  const total = items.reduce((sum, item) => sum + valueFn(item), 0);
  return total / items.length;
}
// or just:
// const averageAmount = average_simpler(invoices.map(inv => inv.amount));
export function average_simpler(items: number[]): number {
  return items.reduce((sum, item) => sum + item, 0) / items.length || 0;
}

export function rollingAverageIncome(invoices: Invoice[]): number {
  // Point of study:
  // Temporal API
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal

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
  // point of study:
  // floating point division and precision issues in JavaScript
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#number_encoding
  // https://www.xjavascript.com/blog/how-can-i-deal-with-floating-point-number-precision-in-javascript/
  // https://medium.com/@chris.p.hughes10/how-computers-store-numbers-foundations-of-floating-point-for-ai-engineers-1259f39f9f1b
  return total / 7;
}
