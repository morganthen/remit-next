import { Invoice } from '@/lib/types';

const statusStyles: Record<Invoice['status'], string> = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  unpaid:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  overdue: 'bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  draft: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  void: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

export default function InvoiceStatusBadge({
  status,
}: {
  status: Invoice['status'];
}) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
