'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { NavLinkWithIcon } from '@/components/NavLinkWithIcon'; // ✅

const links = [
  { name: 'Overview', href: '/overview', icon: HomeIcon },
  { name: 'Clients', href: '/overview/clients', icon: UserGroupIcon },
  {
    name: 'Invoices',
    href: '/overview/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Settings', href: '/overview/settings', icon: Cog8ToothIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => (
        <NavLinkWithIcon
          key={link.name}
          href={link.href}
          icon={link.icon}
          isActive={pathname === link.href}
          className=""
        >
          {link.name}
        </NavLinkWithIcon>
      ))}
    </>
  );
}
