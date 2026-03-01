export function StatsSectionSkeleton() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-2 gap-3 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800"
        />
      ))}
    </div>
  );
}
