import { Invoice } from '@/lib/types';

const statusStyles: Record<Invoice['status'], string> = {
  draft: 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300',
  unpaid: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  void: 'bg-stone-100 text-stone-400 dark:bg-stone-700 dark:text-stone-500',
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
