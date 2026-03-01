import InvoiceRow from './InvoiceRow';
import { getInvoices, getClients } from '@/lib/data';

export default async function InvoicesList({
  showVoid,
  status,
  search,
}: {
  showVoid: boolean;
  status: string;
  search: string;
}) {
  const [invoices, clients] = await Promise.all([
    getInvoices({ showVoid, status, search }),
    getClients(), // still needed for the edit form dropdown
  ]);

  return (
    <ul>
      {invoices.map((invoice) => (
        <li key={invoice.id}>
          <InvoiceRow invoice={invoice} clients={clients} />
        </li>
      ))}
    </ul>
  );
}
