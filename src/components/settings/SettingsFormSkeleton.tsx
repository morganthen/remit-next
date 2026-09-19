export function SettingsFormSkeleton() {
  return (
    <div className="w-full space-y-10 py-4">
      {Array.from({ length: 4 }).map((_, sectionIdx) => (
        <section key={sectionIdx}>
          <div className="mb-4 border-b border-stone-100 pb-2 dark:border-stone-700">
            <div className="mb-2 h-4 w-40 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
            <div className="h-3 w-64 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, fieldIdx) => (
              <div key={fieldIdx}>
                <div className="mb-2 h-3 w-24 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
                <div className="h-9 w-full animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
