import { getRecentInvoices } from '@/lib/data';
import InvoiceRow from './InvoiceRow';

export default async function RecentInvoices() {
  const recentInvoices = await getRecentInvoices();
  return (
    <ul>
      {recentInvoices?.map((invoice) => (
        <li key={invoice.id}>
          <InvoiceRow invoice={invoice} />
        </li>
      ))}
    </ul>
  );
}
