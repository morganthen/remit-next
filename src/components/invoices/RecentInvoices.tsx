import { getInvoices } from '@/lib/data';
import InvoiceRow from './InvoiceRow';

export default async function RecentInvoices() {
  const invoices = await getInvoices();

  return (
    <ul>
      {invoices?.map((invoice) => (
        <li key={invoice.id}>
          <InvoiceRow invoice={invoice} />
        </li>
      ))}
    </ul>
  );
}
