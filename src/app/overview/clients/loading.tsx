import { ClientListSkeleton } from '@/components/clients/ClientListSkeleton';

export default function Loading() {
  return (
    <div className="mb-12 flex flex-col items-stretch justify-start px-8 md:mx-auto md:max-w-3xl">
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2 dark:border-stone-700">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800 dark:text-stone-100">
          Clients
        </h1>
      </div>
      <ClientListSkeleton />
    </div>
  );
}
