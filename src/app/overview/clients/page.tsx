import CreateClientDialog from '@/components/clients/CreateClientDialog';
import { getClients } from '@/lib/data';

export default async function Page() {
  const clients = await getClients();
  console.log(clients);

  return (
    <div className="flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <h1 className="my-4 w-full max-w-full border-b border-stone-200 pb-2 text-2xl font-semibold tracking-tight text-stone-800">
        Clients
      </h1>
      <CreateClientDialog />

      {/*stats*/}
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2">
        <p>Maybe a stat section</p>
      </div>

      <div className="mb-10 flex w-full flex-col gap-3">
        {clients.map((client) => (
          <li key={client.id}>
            <p>{client.name}</p>
            <p>{client.email}</p>
          </li>
        ))}
        <p>some kind of pagination feature at the bottom</p>
      </div>
    </div>
  );
}
