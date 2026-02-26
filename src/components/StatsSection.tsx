import { getTotalCollected, getTotalOwed } from '@/lib/data';
import InvoiceCard from './StatCard';
import { formatCurrency } from '@/lib/utils';

export default async function StatsSection() {
  const totalCollected = await getTotalCollected();
  const totalOwed = await getTotalOwed();

  return (
    <div className="grid w-full max-w-3xl grid-cols-2 gap-3 md:gap-6">
      <InvoiceCard
        title="Amount Collected"
        invoice={formatCurrency(totalCollected)}
      />
      <InvoiceCard title="Amount Owing" invoice={formatCurrency(totalOwed)} />
    </div>
  );
}
