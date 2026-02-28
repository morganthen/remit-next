import CreateInvoiceButton from '@/components/invoices/CreateInvoiceButton';
import RecentInvoices from '@/components/invoices/RecentInvoices';
import { getClients, getNextInvoiceNumber, getInvoices } from '@/lib/data';
import ShowVoidToggle from '@/components/invoices/ShowVoidToggle';

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ showVoid?: string }>;
}) {
  const params = await searchParams;
  const showVoid = params.showVoid === 'true';

  const [invoices, clients, nextInvoiceNumber] = await Promise.all([
    getInvoices(showVoid),
    getClients(),
    getNextInvoiceNumber(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2">
        <ShowVoidToggle showVoid={showVoid} />
      </div>
      <RecentInvoices invoices={invoices} />
      <CreateInvoiceButton
        clients={clients}
        nextInvoiceNumber={nextInvoiceNumber}
        className="fixed right-5 bottom-20 rounded-full shadow-lg md:right-8 md:bottom-10 md:h-12 md:w-12"
      />
    </div>
  );
}
