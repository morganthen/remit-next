import { getTotalCollected, getTotalOwed } from '@/lib/data';
import StatCard from './StatCard';
import {
  formatCurrency,
  averageInvoiceAmount,
  rollingAverageIncome,
} from '@/lib/utils';
import { Invoice } from '@/lib/types';

export default async function StatsSection({
  invoices,
}: {
  invoices: Invoice[];
}) {
  const totalCollected = await getTotalCollected();
  const totalOwed = await getTotalOwed();
  const avg = averageInvoiceAmount(invoices);
  console.log('Average Invoice:', avg);

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
