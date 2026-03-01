import { Invoice } from '@/lib/types';

const statusStyles: Record<Invoice['status'], string> = {
  draft: 'bg-stone-100 text-stone-600',
  unpaid: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  void: 'bg-stone-100 text-stone-400',
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
