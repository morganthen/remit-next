'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function ShowVoidToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const showVoid = searchParams.get('showVoid') === 'true';

  function handleToggle() {
    const params = new URLSearchParams(searchParams.toString());

    if (showVoid) {
      params.delete('showVoid');
    } else {
      params.set('showVoid', 'true');
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <button
      onClick={handleToggle}
      className={`rounded-md px-3 py-1 text-xs transition-colors ${
        showVoid
          ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
          : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
      }`}
    >
      {showVoid ? 'Hide Void' : 'Show Void'}
    </button>
  );
}
