import { notFound } from 'next/navigation';
import { getInvoiceById, getSettings } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import InvoiceStatusBadge from '@/components/invoices/InvoiceStatusBadge';
import PrintButton from '@/components/invoices/PrintButton';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [invoice, settings] = await Promise.all([
    getInvoiceById(id),
    getSettings(),
  ]);

  if (!invoice) notFound();

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/overview/invoices"
          className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-800"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Invoices
        </Link>
        <PrintButton />
      </div>

      <div
        id="invoice-card"
        className="mx-auto max-w-2xl rounded-xl border border-stone-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              {settings?.business_name ?? 'Invoice'}
            </h1>
            {settings?.business_email && (
              <p className="text-sm text-stone-500">
                {settings.business_email}
              </p>
            )}
            {settings?.business_phone && (
              <p className="text-sm text-stone-500">
                {settings.business_phone}
              </p>
            )}
            {settings?.business_address && (
              <p className="text-sm whitespace-pre-line text-stone-500">
                {settings.business_address}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-stone-800">
              Invoice #{invoice.inv_num}
            </p>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold tracking-widest text-stone-400 uppercase">
            Bill To
          </p>
          <p className="font-medium text-stone-800">{invoice.client_name}</p>
          <p className="text-sm text-stone-500">{invoice.client_email}</p>
        </div>

        <div className="mb-8 flex gap-12">
          <div>
            <p className="mb-1 text-xs font-semibold tracking-widest text-stone-400 uppercase">
              Issue Date
            </p>
            <p className="text-sm text-stone-800">
              {new Date(invoice.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold tracking-widest text-stone-400 uppercase">
              Due Date
            </p>
            <p className="text-sm text-stone-800">
              {new Date(invoice.due_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-lg bg-stone-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-600">Amount Due</p>
            <p className="text-2xl font-bold text-stone-800">
              {formatCurrency(invoice.amount)}
            </p>
          </div>
        </div>

        {(settings?.payment_bank_name || settings?.payment_account_number) && (
          <div className="border-t border-stone-100 pt-6">
            <p className="mb-3 text-xs font-semibold tracking-widest text-stone-400 uppercase">
              Payment Details
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {settings.payment_bank_name && (
                <>
                  <p className="text-stone-500">Bank</p>
                  <p className="text-stone-800">{settings.payment_bank_name}</p>
                </>
              )}
              {settings.payment_account_name && (
                <>
                  <p className="text-stone-500">Account Name</p>
                  <p className="text-stone-800">
                    {settings.payment_account_name}
                  </p>
                </>
              )}
              {settings.payment_account_number && (
                <>
                  <p className="text-stone-500">Account Number</p>
                  <p className="text-stone-800">
                    {settings.payment_account_number}
                  </p>
                </>
              )}
              {settings.payment_bsb && (
                <>
                  <p className="text-stone-500">BSB</p>
                  <p className="text-stone-800">{settings.payment_bsb}</p>
                </>
              )}
            </div>
            {settings.payment_notes && (
              <p className="mt-3 text-sm text-stone-500">
                {settings.payment_notes}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
