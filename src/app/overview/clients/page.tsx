import ClientsList from '@/components/clients/ClientList';
import { ClientListSkeleton } from '@/components/clients/ClientListSkeleton';
import CreateClientDialog from '@/components/clients/CreateClientDialog';
import { getClients } from '@/lib/data';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import { Suspense } from 'react';

export default async function Page() {
  const clients = await getClients();
  const hasClients = clients.length > 0;
  return (
    <div className="mb-12 flex flex-col items-stretch justify-start px-8 md:mx-auto md:max-w-3xl">
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2 dark:border-stone-700">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800 dark:text-stone-100">
          Clients
        </h1>
        <CreateClientDialog
          variant="default"
          className="fixed right-5 bottom-20 rounded-full shadow-lg md:right-8 md:bottom-10 md:h-12 md:w-12"
        />
      </div>
      <Suspense fallback={<ClientListSkeleton />}>
        {!hasClients && (
          <div className="mt-24 flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-stone-100 p-4 dark:bg-stone-800">
              <DocumentPlusIcon className="h-8 w-8 text-stone-400 dark:text-stone-500" />
            </div>
            <div>
              <p className="font-medium text-stone-800 dark:text-stone-100">
                No clients yet
              </p>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Create your first client to get started
              </p>
            </div>
          </div>
        )}
        {hasClients && <ClientsList />}
      </Suspense>
    </div>
  );
}
