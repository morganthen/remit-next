import { Client } from '@/lib/types';
import ClientRow from './ClientRow';

export default function ClientsList({ clients }: { clients: Client[] }) {
  return (
    <div className="max-h-[70vh] overflow-y-auto px-4">
      <ul className="w-full">
        {clients.map((client) => (
          <li key={client.id}>
            <ClientRow client={client} />
          </li>
        ))}
      </ul>
    </div>
  );
}
