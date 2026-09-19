import { redirect } from 'next/navigation';
import SideNav from '@/components/SideNav';
import Header from '@/components/Header';
import { getSettings } from '@/lib/data';
import type { Settings } from '@/lib/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: Settings | null;
  try {
    settings = await getSettings();
  } catch {
    // Supabase unreachable or not authenticated
    redirect('/login');
  }

  // No settings row means onboarding was never completed
  if (!settings) redirect('/onboarding');

  return (
    <div className="bg-stone-0 h-screen text-stone-700 md:grid md:grid-cols-[10rem_1fr] md:grid-rows-[auto_1fr] lg:grid-cols-[16rem_1fr] dark:bg-stone-950 dark:text-stone-300">
      <aside className="fixed inset-x-0 bottom-0 z-30 h-18 md:static md:row-span-2 md:h-full md:border-r md:border-stone-200 dark:border-stone-700">
        <SideNav />
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 h-14 md:sticky md:top-0 md:z-10 md:col-start-2 md:h-20 md:backdrop-blur">
        <Header />
      </header>

      <main className="mt-14 h-[calc(100vh-3.5rem)] overflow-y-auto pb-14 md:col-start-2 md:mt-0 md:h-full md:p-8 md:pb-0">
        {children}
      </main>
    </div>
  );
}
