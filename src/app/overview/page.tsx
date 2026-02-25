import InvoiceCard from '@/components/StatCard';
import RecentInvoices from '@/components/invoices/RecentInvoices';
import Link from 'next/link';
import CreateInvoiceButton from '@/components/invoices/CreateInvoiceButton';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <h1 className="my-4 w-full max-w-full border-b border-stone-200 pb-2 text-2xl font-semibold tracking-tight text-stone-800">
        Overview
      </h1>
      <div className="grid w-full max-w-3xl grid-cols-2 gap-3 md:gap-6">
        <InvoiceCard title="Amount Collected" invoice="$4321.00" />
        <InvoiceCard title="Amount Owing" invoice="$1234.00" />
      </div>
      {/*invoice overview*/}
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
          Recent Invoices
        </h1>
        <Link
          href="/overview/invoices"
          className="text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          See all →
        </Link>
      </div>

      <div className="flex w-full flex-col gap-3">
        <RecentInvoices />
      </div>
      <CreateInvoiceButton />
    </div>
  );
}
