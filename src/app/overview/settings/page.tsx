import { getSettings } from '@/lib/data';
import SettingsForm from '@/components/settings/SettingsForm';
import { createClient } from '@/lib/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const settings = await getSettings();

  console.log(settings);

  return (
    <div className="mb-12 flex flex-col items-center justify-center px-8 md:mx-auto md:max-w-3xl">
      <div className="my-4 flex w-full max-w-full items-center justify-between border-b border-stone-200 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
          Settings
        </h1>
      </div>
      <SettingsForm settings={settings} userEmail={user?.email ?? ''} />
    </div>
  );
}
