'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function ShowVoidToggle({ showVoid }: { showVoid: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
          ? 'bg-stone-800 text-white'
          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
      }`}
    >
      {showVoid ? 'Hide Void' : 'Show Void'}
    </button>
  );
}
