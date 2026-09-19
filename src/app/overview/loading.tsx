import { StatsSectionSkeleton } from '@/components/StatsSectionSkeleton';
import { RecentInvoicesSkeleton } from '@/components/invoices/RecentInvoicesSkeleton';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <h1 className="my-4 w-full max-w-full border-b border-stone-200 pb-2 text-2xl font-semibold tracking-tight text-stone-800 dark:border-stone-700 dark:text-stone-100">
        Overview
      </h1>
      <StatsSectionSkeleton />
      <RecentInvoicesSkeleton />
    </div>
  );
}
