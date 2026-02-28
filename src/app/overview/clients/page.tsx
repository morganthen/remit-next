import ClientsList from '@/components/clients/ClientList';
import CreateClientDialog from '@/components/clients/CreateClientDialog';

export default async function Page() {
  return (
    <div className="mb-12 flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
          Clients
        </h1>
        <CreateClientDialog variant="ghost" />
      </div>
      <ClientsList />
    </div>
  );
}
