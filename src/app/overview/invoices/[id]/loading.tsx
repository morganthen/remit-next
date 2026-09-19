export default function Loading() {
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 dark:bg-stone-950">
      <div className="mb-6 flex items-center justify-between">
        <div className="h-4 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-8 w-20 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      </div>
      <div className="mx-auto max-w-2xl rounded-xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <div className="mb-8 flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
            <div className="h-3 w-40 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
            <div className="h-3 w-32 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
          </div>
          <div className="space-y-2 text-right">
            <div className="ml-auto h-5 w-24 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
            <div className="ml-auto h-5 w-16 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800" />
          </div>
        </div>
        <div className="mb-8 space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
          <div className="h-4 w-40 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
          <div className="h-3 w-48 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
        </div>
        <div className="mb-8 flex gap-12">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
              <div className="h-4 w-24 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
            </div>
          ))}
        </div>
        <div className="mb-8 h-20 animate-pulse rounded-lg bg-stone-50 dark:bg-stone-800" />
        <div className="border-t border-stone-100 pt-6 dark:border-stone-700">
          <div className="mb-3 h-3 w-32 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-stone-100 dark:bg-stone-800"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
