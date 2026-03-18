import { Suspense } from 'react';
import InvoicesList from '@/components/invoices/InvoicesList';
import CreateInvoiceButtonWrapper from '@/components/invoices/CreateInvoiceButtonWrapper';
import ShowVoidToggle from '@/components/invoices/ShowVoidToggle';
import { InvoicesListSkeleton } from '@/components/invoices/InvoicesListSkeleton';
import FilterBar from '@/components/FilterBar';
import { getInvoiceCount, getInvoices } from '@/lib/data';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    showVoid?: string;
    status?: string;
    search?: string;
  }>;
}) {
  const invoiceCount = await getInvoiceCount();
  const hasInvoice = invoiceCount > 0;
  const params = await searchParams;
  const showVoid = params.showVoid === 'true';
  const status = params.status ?? 'all';
  const search = params.search ?? '';

  return (
    <div className="mb-12 flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2 dark:border-stone-700">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800 dark:text-stone-100">
          Invoices
        </h1>
        <div className="flex items-center justify-between px-4 py-2">
          {hasInvoice && <ShowVoidToggle />}
        </div>
      </div>
      {hasInvoice && <FilterBar status={status} search={search} />}
      <Suspense
        key={`${showVoid}-${status}-${search}`}
        fallback={<InvoicesListSkeleton />}
      >
        {!hasInvoice && (
          <div className="mt-24 flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-stone-100 p-4 dark:bg-stone-800">
              <DocumentPlusIcon className="h-8 w-8 text-stone-400 dark:text-stone-500" />
            </div>
            <div>
              <p className="font-medium text-stone-800 dark:text-stone-100">
                No invoices yet
              </p>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Create your first invoice to get started
              </p>
            </div>
          </div>
        )}

        {hasInvoice && (
          <InvoicesList showVoid={showVoid} status={status} search={search} />
        )}
      </Suspense>
      <Suspense fallback={null}>
        <CreateInvoiceButtonWrapper className="fixed right-5 bottom-20 rounded-full shadow-lg md:right-8 md:bottom-10 md:h-12 md:w-12" />
      </Suspense>
    </div>
  );
}
