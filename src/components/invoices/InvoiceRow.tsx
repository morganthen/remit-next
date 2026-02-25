import { Invoice } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';

type InvoiceRowProps = {
  invoice: Invoice;
};

export default function InvoiceRow({ invoice }: InvoiceRowProps) {
  return (
    <div className="flex max-w-2xl flex-row items-center justify-between space-x-3 border-b border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50">
      {/* Client & Metadata */}
      <div className="flex w-1/4 flex-col">
        <span className="font-semibold text-slate-900">
          {invoice.client_name}
        </span>
        <span className="text-xs text-slate-500">#{invoice.number}</span>
      </div>

      {/* Dates */}
      <div className="hidden w-1/4 flex-col text-sm text-slate-600 md:flex">
        <span>Created: {formatDate(invoice.created_at)}</span>
        <span className="text-xs">Due: {invoice.due_date}</span>
      </div>

      {/* Amount & Status */}
      <div className="flex w-1/3 items-center justify-end gap-6">
        <span className="font-bold text-slate-900">
          {formatCurrency(invoice.amount)}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-medium`}>
          {invoice.status}
        </span>

        {/* Burger/Action Menu */}
        <button className="p-2 text-slate-400 hover:text-slate-600">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
