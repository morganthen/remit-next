import { InvoicesListSkeleton } from './InvoicesListSkeleton';

export function FilterBarSkeleton() {
  return (
    <div className="mb-4 flex w-full flex-col gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-14 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800"
          />
        ))}
      </div>
      <div className="h-9 w-full animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
    </div>
  );
}

export function InvoicesPageBodySkeleton() {
  return (
    <>
      <FilterBarSkeleton />
      <InvoicesListSkeleton />
    </>
  );
}
