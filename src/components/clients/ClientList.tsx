import { getClients } from '@/lib/data';
import ClientRow from './ClientRow';

export default async function ClientsList() {
  const clients = await getClients();
  return (
    <ul className="w-full">
      {clients?.map((client) => (
        <li key={client.id}>
          <ClientRow client={client} />
        </li>
      ))}
    </ul>
  );
}
