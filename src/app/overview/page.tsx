import RecentInvoices from '@/components/invoices/RecentInvoices';
import Link from 'next/link';
import CreateInvoiceButton from '@/components/invoices/CreateInvoiceButton';
import StatsSection from '@/components/StatsSection';
import {
  getNextInvoiceNumber,
  getClients,
  getInvoices,
  getRecentInvoices,
} from '@/lib/data';

export default async function Page() {
  const [clients, nextInvoiceNumber, invoices, recentInvoices] =
    await Promise.all([
      getClients(),
      getNextInvoiceNumber(),
      getInvoices(),
      getRecentInvoices(),
    ]);

  return (
    <div className="flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <h1 className="my-4 w-full max-w-full border-b border-stone-200 pb-2 text-2xl font-semibold tracking-tight text-stone-800">
        Overview
      </h1>
      <StatsSection invoices={invoices} />
      {/*invoice overview*/}
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
          Recent Invoices
        </h1>
        {invoices.length > 0 && (
          <Link
            href="/overview/invoices"
            className="text-sm text-stone-500 transition-colors hover:text-stone-800"
          >
            See all →
          </Link>
        )}
      </div>
      <div className="mb-10 flex w-full flex-col gap-3">
        <RecentInvoices recentInvoices={recentInvoices} />
      </div>
      <CreateInvoiceButton
        clients={clients}
        nextInvoiceNumber={nextInvoiceNumber}
        className="fixed right-5 bottom-20 rounded-full shadow-lg md:right-8 md:bottom-10 md:h-12 md:w-12"
      />
    </div>
  );
}
