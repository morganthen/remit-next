import { Suspense } from 'react';
import RecentInvoices from '@/components/invoices/RecentInvoices';
import CreateInvoiceButtonWrapper from '@/components/invoices/CreateInvoiceButtonWrapper';
import StatsSection from '@/components/StatsSection';
import { RecentInvoicesSkeleton } from '../../components/invoices/RecentInvoicesSkeleton';
import { StatsSectionSkeleton } from '@/components/StatsSectionSkeleton';
import { getInvoiceCount } from '@/lib/data';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';

export default async function Page() {
  const invoiceCount = await getInvoiceCount();
  const hasInvoices = invoiceCount > 0;

  return (
    <div className="flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <h1 className="my-4 w-full max-w-full border-b border-stone-200 pb-2 text-2xl font-semibold tracking-tight text-stone-800 dark:border-stone-700 dark:text-stone-100">
        Overview
      </h1>
      {hasInvoices ? (
        <>
          <Suspense fallback={<StatsSectionSkeleton />}>
            <StatsSection />
          </Suspense>
          <Suspense fallback={<RecentInvoicesSkeleton />}>
            <RecentInvoices />
          </Suspense>
        </>
      ) : (
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
      <Suspense fallback={null}>
        <CreateInvoiceButtonWrapper className="fixed right-5 bottom-20 rounded-full shadow-lg md:right-8 md:bottom-10 md:h-12 md:w-12" />
      </Suspense>
    </div>
  );
}
