'use client';

import { useOptimistic } from 'react';
import { Client } from '@/lib/types';
import ClientRow from './ClientRow';

type OptimisticAction =
  | { type: 'delete'; id: string }
  | { type: 'edit'; id: string; data: { name: string; email: string } };

export default function ClientsList({ clients }: { clients: Client[] }) {
  const [optimisticClients, dispatch] = useOptimistic<Client[], OptimisticAction>(
    clients,
    (state, action) => {
      switch (action.type) {
        case 'delete':
          return state.filter((c) => c.id !== action.id);
        case 'edit':
          return state.map((c) =>
            c.id === action.id ? { ...c, ...action.data } : c
          );
      }
    }
  );

  return (
    <div className="max-h-[70vh] overflow-y-auto px-4">
      <ul className="w-full">
        {optimisticClients.map((client) => (
          <li key={client.id}>
            <ClientRow
              client={client}
              onOptimisticDelete={(id) => dispatch({ type: 'delete', id })}
              onOptimisticEdit={(id, data) =>
                dispatch({ type: 'edit', id, data })
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
