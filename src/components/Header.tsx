import { Suspense } from 'react';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { ButtonWithIcon } from './ButtonWithIcon';
import { logout } from '@/lib/auth/actions';
import { getSettings } from '@/lib/data';
import ThemeToggle from './ThemeToggle';

async function HeaderGreetingName() {
  const settings = await getSettings();
  return settings?.business_name ? ` ${settings.business_name}` : '';
}

export default function Header() {
  return (
    <div className="flex h-full items-center justify-between bg-stone-50 px-4 py-2 md:justify-end dark:bg-stone-900">
      {/* Left: Logo */}
      <div className="-ml-6 md:hidden">
        <Image
          src="/remit-logo.png"
          width={80}
          height={80}
          alt="Logo of Remit"
          className="object-contain dark:invert"
        />
      </div>

      {/* Right: Username, Theme, Sign Out */}
      <div className="flex items-center gap-4">
        <p className="text-sm">
          <span className="hidden md:inline">Welcome,</span>
          <Suspense fallback={null}>
            <HeaderGreetingName />
          </Suspense>
        </p>
        <ThemeToggle />
        <form action={logout}>
          <ButtonWithIcon
            icon={ArrowLeftEndOnRectangleIcon}
            variant="outline"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
}
