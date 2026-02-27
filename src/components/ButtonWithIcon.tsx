import { Button } from '@/components/ui/button';
import { ComponentType, SVGProps } from 'react';

type ButtonWithIconProps = {
  variant?:
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'link'
    | 'default';
  children?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

export function ButtonWithIcon({
  variant,
  children,
  icon: Icon,
  className,
  onClick,
  type = 'button',
}: ButtonWithIconProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size="sm"
      className={className}
      type={type}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="hidden md:inline">{children}</span>
    </Button>
  );
}
