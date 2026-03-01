import InvoiceRow from './InvoiceRow';
import { getInvoices } from '@/lib/data';

export default async function InvoicesList({
  showVoid,
  status,
  search,
}: {
  showVoid: boolean;
  status: string;
  search: string;
}) {
  const invoices = await getInvoices({ showVoid, status, search });

  return (
    <ul>
      {invoices.map((invoice) => (
        <li key={invoice.id}>
          <InvoiceRow invoice={invoice} />
        </li>
      ))}
    </ul>
  );
}
