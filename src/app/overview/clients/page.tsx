import ClientsList from '@/components/clients/ClientList';
import { ClientListSkeleton } from '@/components/clients/ClientListSkeleton';
import CreateClientDialog from '@/components/clients/CreateClientDialog';
import { Suspense } from 'react';

export default async function Page() {
  return (
    <div className="mb-12 flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2 dark:border-stone-700">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800 dark:text-stone-100">
          Clients
        </h1>
        <CreateClientDialog variant="ghost" />
      </div>
      <Suspense fallback={<ClientListSkeleton />}>
        <ClientsList />
      </Suspense>
    </div>
  );
}
