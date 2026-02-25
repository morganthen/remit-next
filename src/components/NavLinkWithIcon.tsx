import { Button } from '@/components/ui/button';
import { ComponentType, SVGProps } from 'react';
import Link from 'next/link';

type NavLinkWithIconProps = {
  href: string;
  children: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  isActive?: boolean;
  className?: string;
};

// ✅ Used for navigation: sidebar links
export function NavLinkWithIcon({
  href,
  children,
  icon: Icon,
  isActive,
  className,
}: NavLinkWithIconProps) {
  return (
    <Button
      asChild
      variant="outline"
      size="responsive"
      className={`${isActive ? 'bg-stone-200 text-stone-800' : ''} ${className}`}
    >
      <Link href={href}>
        {/* Fixed width icon container so all icons line up */}
        <div className="flex md:w-24 md:justify-between">
          <span className="shrink-0 md:flex md:w-4 md:items-center md:justify-center">
            {Icon && <Icon className="h-4 w-4" />}
          </span>
          {/* Text truncates at the same point regardless of length */}
          <div className="flex items-center justify-center md:w-36">
            <span className="hidden truncate md:inline">{children}</span>
          </div>
        </div>
      </Link>
    </Button>
  );
}
