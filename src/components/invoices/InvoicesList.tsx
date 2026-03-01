import InvoiceRow from './InvoiceRow';
import { getInvoices } from '@/lib/data';

export default async function InvoicesList({
  showVoid,
}: {
  showVoid: boolean;
}) {
  const invoices = await getInvoices(showVoid);

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
