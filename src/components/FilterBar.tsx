'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useCallback, useState, useEffect } from 'react';
import { useDebounce } from '@/lib/useDebounce';

const STATUSES = ['all', 'draft', 'unpaid', 'paid', 'overdue', 'void'];

export default function FilterBar({
  status,
  search,
}: {
  status: string;
  search: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search);

  const debouncedSearch = useDebounce(searchInput, 300);
  const activeStatus = isPending ? (optimisticStatus ?? status) : status;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch === '') {
      params.delete('search');
    } else {
      params.set('search', debouncedSearch);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all') {
        params.delete('status');
      } else {
        params.set('status', value);
      }
      setOptimisticStatus(value);
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router]
  );

  return (
    <div
      className={`mb-4 flex w-full flex-col gap-2 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="flex gap-1">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => updateStatus(s)}
            className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
              activeStatus === s
                ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Search by client or invoice number..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-stone-500"
      />
    </div>
  );
}
