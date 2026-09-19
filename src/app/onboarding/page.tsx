import { redirect } from 'next/navigation';
import OnboardingForm from '@/components/OnboardingForm';
import { getSettings } from '@/lib/data';
import type { Settings } from '@/lib/types';

export default async function OnboardingPage() {
  let settings: Settings | null;
  try {
    settings = await getSettings();
  } catch {
    // Supabase unreachable or not authenticated
    redirect('/login');
  }

  // Already onboarded -> dashboard
  if (settings) redirect('/overview');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-stone-100">
            Welcome to Remit
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            Let us get your business set up. You can always update these later
            in Settings.
          </p>
        </div>

        {/* Form */}
        <OnboardingForm />
      </div>
    </main>
  );
}
