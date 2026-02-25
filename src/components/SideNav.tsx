import Link from 'next/link';
import NavLinks from './NavLinks';
import Image from 'next/image';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-stone-100 bg-none px-3 py-4 md:px-2">
      <div className="flex h-full items-center md:block">
        <Link
          className="hidden items-center justify-center rounded-md p-4 md:mb-2 md:flex md:h-auto"
          href="/"
        >
          <Image
            src="/remit-logo.png"
            width="150"
            height="150"
            alt="Logo of Remit"
          />
        </Link>
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-y-2 md:space-x-0">
          <NavLinks />
        </div>
      </div>
    </div>
  );
}
