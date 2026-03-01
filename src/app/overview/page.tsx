import { Suspense } from 'react';
import RecentInvoices from '@/components/invoices/RecentInvoices';
import CreateInvoiceButtonWrapper from '@/components/invoices/CreateInvoiceButtonWrapper';
import StatsSection from '@/components/StatsSection';
import { RecentInvoicesSkeleton } from '../../components/invoices/RecentInvoicesSkeleton';
import { StatsSectionSkeleton } from '@/components/StatsSectionSkeleton';

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <h1 className="my-4 w-full max-w-full border-b border-stone-200 pb-2 text-2xl font-semibold tracking-tight text-stone-800">
        Overview
      </h1>
      <Suspense fallback={<StatsSectionSkeleton />}>
        <StatsSection />
      </Suspense>
      {/*invoice overview*/}
      <Suspense fallback={<RecentInvoicesSkeleton />}>
        <RecentInvoices />
      </Suspense>
      <Suspense fallback={null}>
        <CreateInvoiceButtonWrapper className="fixed right-5 bottom-20 rounded-full shadow-lg md:right-8 md:bottom-10 md:h-12 md:w-12" />
      </Suspense>
    </div>
  );
}
