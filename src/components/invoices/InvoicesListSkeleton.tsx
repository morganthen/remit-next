export function InvoicesListSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-stone-100" />
      ))}
    </div>
  );
}
