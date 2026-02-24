import SideNav from '@/ui/ui/dashboard/SideNav';
import Header from '@/ui/ui/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-100 text-slate-700 md:grid md:h-screen md:grid-cols-[16rem_1fr] md:grid-rows-[auto_1fr]">
      <aside className="fixed inset-x-0 bottom-0 z-30 h-14 md:static md:row-span-2 md:h-full md:border-r md:border-slate-200">
        <SideNav />
      </aside>
      <header className="fixed inset-x-0 top-0 z-30 h-14 md:sticky md:top-0 md:z-10 md:col-start-2 md:h-16 md:backdrop-blur">
        <Header />
      </header>
      <main className="mt-14 overflow-y-auto pb-14 md:col-start-2 md:mt-0 md:p-12 md:pb-0">
        {children}
      </main>
    </div>
  );
}
