import Link from 'next/link';
import InvoiceRow from './InvoiceRow';
import { getClients, getRecentInvoices, getSettings } from '@/lib/data';

export default async function RecentInvoices() {
  const [recentInvoices, clients, settings] = await Promise.all([
    getRecentInvoices(),
    getClients(),
    getSettings(),
  ]);

  return (
    <>
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2 dark:border-stone-700">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800 dark:text-stone-100">
          Recent Invoices
        </h1>
        {recentInvoices.length > 0 && (
          <Link
            href="/overview/invoices"
            className="text-sm text-stone-500 transition-colors hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
          >
            See all →
          </Link>
        )}
      </div>
      <div className="mb-10 flex w-full flex-col gap-3">
        <ul>
          {recentInvoices.map((invoice) => (
            <li key={invoice.id}>
              <InvoiceRow
                invoice={invoice}
                clients={clients}
                settings={settings}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
