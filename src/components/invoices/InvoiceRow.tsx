import { formatCurrency, formatDate } from '@/lib/utils';
import { Invoice, Client, Settings } from '@/lib/types';
import Link from 'next/link';
import InvoiceRowActions from './InvoiceRowActions';

type InvoiceRowProps = {
  invoice: Invoice;
  clients: Client[];
  settings: Settings | null;
};

export default function InvoiceRow({
  invoice,
  clients,
  settings,
}: InvoiceRowProps) {
  return (
    <div
      id={`invoice-content-${invoice.id}`}
      className="relative mb-2 grid max-w-full grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center justify-between gap-x-3 rounded-lg border border-stone-100 bg-white px-5 py-5 shadow-sm transition-all hover:border-stone-300 hover:shadow-md dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-500"
    >
      <Link href={`/overview/invoices/${invoice.id}`} className="contents">
        <div className="col-span-1 col-start-1">
          <p className="text-xs text-stone-400 dark:text-stone-500">
            #{invoice.inv_num}
          </p>
        </div>
        <div className="col-span-1 col-start-2 min-w-3">
          <p>{invoice.client_name}</p>
          <p className="hidden text-xs text-stone-400 lg:block dark:text-stone-500">
            {invoice.client_email ?? 'No email'}
          </p>
        </div>
        <div className="col-span-2 col-start-4 flex min-w-8 flex-col items-center justify-center gap-2 pl-4">
          <p className="text-sm">{formatCurrency(invoice.amount)}</p>
          <p className="text-xs text-stone-400 dark:text-stone-500">
            {formatDate(invoice.due_date)}
          </p>
        </div>
      </Link>

      <InvoiceRowActions
        invoice={invoice}
        clients={clients}
        settings={settings}
      />
    </div>
  );
}
