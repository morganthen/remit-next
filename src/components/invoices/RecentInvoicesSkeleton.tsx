export function RecentInvoicesSkeleton() {
  return (
    <>
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2 dark:border-stone-700">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800 dark:text-stone-100">
          Recent Invoices
        </h1>
      </div>
      <div className="mb-10 flex w-full flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800"
          />
        ))}
      </div>
    </>
  );
}
