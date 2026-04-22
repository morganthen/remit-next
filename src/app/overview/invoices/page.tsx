import { Suspense } from 'react';
import InvoicesList from '@/components/invoices/InvoicesList';
import CreateInvoiceButtonWrapper from '@/components/invoices/CreateInvoiceButtonWrapper';
import ShowVoidToggle from '@/components/invoices/ShowVoidToggle';
import { InvoicesListSkeleton } from '@/components/invoices/InvoicesListSkeleton';
import FilterBar from '@/components/FilterBar';
import { getInvoiceCount } from '@/lib/data';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';

type SearchParams = {
  showVoid?: string;
  status?: string;
  search?: string;
};

function EmptyState() {
  return (
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
  );
}

async function ShowVoidToggleSlot() {
  const count = await getInvoiceCount();
  if (count === 0) return null;
  return <ShowVoidToggle />;
}

function FilterBarSkeleton() {
  return (
    <div className="mb-4 flex w-full flex-col gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-14 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800"
          />
        ))}
      </div>
      <div className="h-9 w-full animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
    </div>
  );
}

function InvoicesPageBodySkeleton() {
  return (
    <>
      <FilterBarSkeleton />
      <InvoicesListSkeleton />
    </>
  );
}

async function InvoicesPageBody({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [invoiceCount, params] = await Promise.all([
    getInvoiceCount(),
    searchParams,
  ]);

  if (invoiceCount === 0) return <EmptyState />;

  const showVoid = params.showVoid === 'true';
  const status = params.status ?? 'all';
  const search = params.search ?? '';

  return (
    <>
      <FilterBar status={status} search={search} />
      <Suspense
        key={`${showVoid}-${status}-${search}`}
        fallback={<InvoicesListSkeleton />}
      >
        <InvoicesList showVoid={showVoid} status={status} search={search} />
      </Suspense>
    </>
  );
}

export default function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className="mb-12 flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2 dark:border-stone-700">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800 dark:text-stone-100">
          Invoices
        </h1>
        <div className="flex items-center justify-between px-4 py-2">
          <Suspense fallback={null}>
            <ShowVoidToggleSlot />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<InvoicesPageBodySkeleton />}>
        <InvoicesPageBody searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={null}>
        <CreateInvoiceButtonWrapper className="fixed right-5 bottom-20 rounded-full shadow-lg md:right-8 md:bottom-10 md:h-12 md:w-12" />
      </Suspense>
    </div>
  );
}
