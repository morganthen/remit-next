import Link from 'next/link';
import InvoiceRow from './InvoiceRow';
import { getInvoices, getClients, getSettings } from '@/lib/data';

export default async function InvoicesList({
  showVoid,
  status,
  search,
}: {
  showVoid: boolean;
  status: string;
  search: string;
}) {
  const [invoices, clients, settings] = await Promise.all([
    getInvoices({ showVoid, status, search }),
    getClients(),
    getSettings(),
  ]);

  return (
    <div className="max-h-[70vh] overflow-y-auto px-4">
      <ul>
        {invoices.map((invoice) => (
          <li key={invoice.id}>
            <Link href={`/overview/invoices/${invoice.id}`}>
              <InvoiceRow
                invoice={invoice}
                clients={clients}
                settings={settings}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
