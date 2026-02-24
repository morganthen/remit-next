import { ComponentType, SVGProps } from 'react';

type ButtonProps = {
  children: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export default function Button({ icon: Icon, children }: ButtonProps) {
  return (
    <button className="flex h-12 grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-slate-300 hover:text-slate-700 md:flex-none md:justify-start md:p-2 md:px-3">
      {Icon ? <Icon className="w-6" /> : null}
      <span className="hidden md:block">{children}</span>
    </button>
  );
}
