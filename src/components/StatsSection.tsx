import { getTotalCollected, getTotalOwed, getInvoices } from '@/lib/data';
import StatCard from './StatCard';
import {
  formatCurrency,
  averageInvoiceAmount,
  rollingAverageIncome,
} from '@/lib/utils';

export default async function StatsSection() {
  const [invoices, totalCollected, totalOwed] = await Promise.all([
    getInvoices(),
    getTotalCollected(),
    getTotalOwed(),
  ]);
  const avg = averageInvoiceAmount(invoices);

  return (
    <div className="grid w-full max-w-3xl grid-cols-2 gap-3 md:gap-6">
      <StatCard
        title="Amount Collected"
        stat={formatCurrency(totalCollected)}
      />
      <StatCard title="Amount Owing" stat={formatCurrency(totalOwed)} />
      <StatCard title="Average Invoice Amount" stat={formatCurrency(avg)} />
      <StatCard
        title="7-day rolling Average"
        stat={formatCurrency(rollingAverageIncome(invoices))}
      />
    </div>
  );
}
