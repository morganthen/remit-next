import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { markInvoicePaid, markInvoiceUnpaid } from '@/lib/actions';
import { Invoice, Settings } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ActionButtonProps = {
  onVoid: () => Promise<void>;
  onEdit: () => void;
  invoiceId: string;
  status: string;
  invoice: Invoice;
  settings: Settings | null;
};

export default function ActionButton({
  onVoid,
  onEdit,
  invoiceId,
  status,
  invoice,
  settings,
}: ActionButtonProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const invoiceUrl = `${appUrl}/invoice/${invoice.id}`;

  function buildMailBody(
    template: string | null | undefined,
    fallback: string
  ): string {
    const greeting = `Hi ${invoice.client_name},\n\n`;
    const body = `${greeting}${template || fallback}\n\nYou can view the invoice here: ${invoiceUrl}`;
    return encodeURIComponent(body);
  }
  const [open, setOpen] = useState(false);
  const [isVoiding, setIsVoiding] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isUnpaying, setIsUnpaying] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const router = useRouter();

  async function handleEmailClient(mailtoUrl: string) {
    if (invoice.status === 'draft') {
      setIsEmailing(true);
      const result = await markInvoiceUnpaid(invoiceId);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to update invoice status');
        setIsEmailing(false);
        return; // don't open mailto if update failed
      }
      setIsEmailing(false);
    }
    window.location.href = mailtoUrl;
  }

  async function handleMarkUnpaid() {
    setIsUnpaying(true);
    const result = await markInvoiceUnpaid(invoiceId);
    if (result.success) {
      toast.success('Invoice marked as unpaid');
      router.refresh();
    } else {
      toast.error(result.error ?? 'Failed to mark as unpaid');
    }
    setIsUnpaying(false);
  }

  async function handleMarkPaid() {
    setIsPaying(true);
    const result = await markInvoicePaid(invoiceId);
    if (result.success) {
      toast.success('Invoice marked as paid');
      router.refresh();
    } else {
      toast.error(result.error ?? 'Failed to mark as paid');
    }
    setIsPaying(false);
  }
  async function handleConfirmVoid() {
    setIsVoiding(true);
    try {
      await onVoid();
    } finally {
      setIsVoiding(false);
      setOpen(false);
    }
  }

  return (
    <div className="absolute top-full right-0 z-10 mt-1 flex w-36 flex-col items-center justify-center rounded-md border border-stone-200 bg-white shadow-md">
      <Link
        href={`/overview/invoices/${invoice.id}`}
        className="w-full border-b border-stone-300 px-4 py-2 text-center text-sm hover:bg-stone-50"
      >
        View Invoice
      </Link>
      <button
        className="w-full border-b border-stone-300 px-4 py-2 text-sm hover:bg-stone-50"
        onClick={onEdit} // ← just call onEdit
      >
        Edit
      </button>

      {invoice.client_email &&
        invoice.status !== 'paid' &&
        invoice.status !== 'overdue' && (
          <button
            onClick={() =>
              handleEmailClient(
                `mailto:${invoice.client_email}?subject=Invoice %23${invoice.inv_num}&body=${buildMailBody(settings?.email_new_invoice, 'Please find your invoice attached. Do not hesitate to reach out if you have any questions.')}`
              )
            }
            disabled={isEmailing}
            className="w-full border-b border-stone-300 px-4 py-2 text-center text-sm hover:bg-stone-50 disabled:opacity-50"
          >
            {isEmailing ? 'Sending...' : 'Email Client'}
          </button>
        )}

      {invoice.client_email && invoice.status === 'overdue' && (
        <a
          href={`mailto:${invoice.client_email}?subject=Reminder: Invoice %23${invoice.inv_num}&body=${buildMailBody(settings?.email_overdue_reminder, 'This is a friendly reminder that your invoice is now overdue. Please arrange payment at your earliest convenience.')}`}
          className="w-full border-b border-stone-300 px-4 py-2 text-center text-sm hover:bg-stone-50"
        >
          Send Reminder
        </a>
      )}

      {invoice.client_email && invoice.status === 'paid' && (
        <a
          href={`mailto:${invoice.client_email}?subject=Receipt: Invoice %23${invoice.inv_num}&body=${buildMailBody(settings?.email_receipt, 'Thank you for your payment. This email confirms receipt of your payment in full.')}`}
          className="w-full border-b border-stone-300 px-4 py-2 text-center text-sm hover:bg-stone-50"
        >
          Send Receipt
        </a>
      )}

      {status !== 'paid' && status !== 'draft' && (
        <button
          className="w-full border-b border-stone-300 px-4 py-2 text-sm text-green-600 hover:bg-stone-50"
          disabled={isPaying}
          onClick={handleMarkPaid}
        >
          {isPaying ? 'Marking...' : 'Mark as Paid'}
        </button>
      )}
      {status === 'paid' && (
        <button
          className="w-full border-b border-stone-300 px-4 py-2 text-sm text-amber-600 hover:bg-stone-50"
          disabled={isUnpaying}
          onClick={handleMarkUnpaid}
        >
          {isUnpaying ? 'Marking...' : 'Mark as Unpaid'}
        </button>
      )}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button className="w-full border-b border-stone-300 px-4 py-2 text-sm text-red-600 hover:bg-stone-50">
            Void
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Void this invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the invoice as void. It will no longer appear in
              your invoice list but will be kept in records for auditing
              purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isVoiding}
              onClick={handleConfirmVoid}
            >
              {isVoiding ? 'Voiding...' : 'Void Invoice'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
