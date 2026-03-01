import { Suspense } from 'react';
import InvoicesList from '@/components/invoices/InvoicesList';
import CreateInvoiceButtonWrapper from '@/components/invoices/CreateInvoiceButtonWrapper';
import ShowVoidToggle from '@/components/invoices/ShowVoidToggle';
import { InvoicesListSkeleton } from '@/components/invoices/InvoicesListSkeleton';

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ showVoid?: string }>;
}) {
  const params = await searchParams;
  const showVoid = params.showVoid === 'true';

  return (
    <div className="mb-12 flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
          Invoices
        </h1>
        <div className="flex items-center justify-between px-4 py-2">
          <ShowVoidToggle />
        </div>
      </div>
      <Suspense key={String(showVoid)} fallback={<InvoicesListSkeleton />}>
        <InvoicesList showVoid={showVoid} />
      </Suspense>
      <Suspense fallback={null}>
        <CreateInvoiceButtonWrapper className="fixed right-5 bottom-20 rounded-full shadow-lg md:right-8 md:bottom-10 md:h-12 md:w-12" />
      </Suspense>
    </div>
  );
}
