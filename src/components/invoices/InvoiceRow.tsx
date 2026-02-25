import { formatCurrency, formatDate } from '@/lib/utils';
import { Invoice } from '@/lib/types';
import { Button } from '../ui/button';

type InvoiceRowProps = {
  invoice: Invoice;
};

export default function InvoiceRow({ invoice }: InvoiceRowProps) {
  const statusStyles: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex max-w-full items-center justify-between rounded-lg border border-stone-100 bg-white px-5 py-5 shadow-sm transition-all hover:border-stone-300 hover:shadow-md">
      {/*Invoice Number*/}
      <div>
        <p>{invoice.inv_num}</p>
      </div>
      {/*Client name and email*/}
      <div>
        <p>{invoice.client_name}</p>
        <p>{invoice.clients.email}</p>
      </div>
      {/*amount and date*/}
      <div>
        <p>{formatCurrency(invoice.amount)}</p>
        <p>{formatDate(invoice.due_date)}</p>
      </div>
      {/*action button*/}
      <div>
        <Button variant="outline">Edit</Button>
      </div>
    </div>
  );
}
