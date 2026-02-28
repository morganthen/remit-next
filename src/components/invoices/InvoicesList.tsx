import InvoiceRow from './InvoiceRow';
import { Invoice } from '@/lib/types';

export default function InvoicesList({ invoices }: { invoices: Invoice[] }) {
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
