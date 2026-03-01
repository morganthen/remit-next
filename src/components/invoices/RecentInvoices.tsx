import InvoiceRow from './InvoiceRow';
import { Invoice } from '@/lib/types';

type RecentInvoicesProps = {
  recentInvoices: Invoice[];
};

export default async function RecentInvoices({
  recentInvoices,
}: RecentInvoicesProps) {
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
