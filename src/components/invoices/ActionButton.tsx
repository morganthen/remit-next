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
import { Invoice } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EditInvoiceDialog from './EditInvoiceDialog';
import { Client } from '@/lib/types';

type ActionButtonProps = {
  onVoid: () => Promise<void>;
  onEdit: () => void;
  invoiceId: string;
  status: string;
  invoice: Invoice;
  clients: Client[];
};

export default function ActionButton({
  onVoid,
  onEdit,
  invoiceId,
  status,
  invoice,
  clients,
}: ActionButtonProps) {
  const [open, setOpen] = useState(false);
  const [isVoiding, setIsVoiding] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isUnpaying, setIsUnpaying] = useState(false);
  const router = useRouter();

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

      {invoice.client_email && invoice.status !== 'paid' && (
        <a
          href={`mailto:${invoice.client_email}?subject=Invoice %23${invoice.inv_num}&body=Please find your invoice here: ${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.id}%0A%0AIt was a pleasure doing business with you.`}
          className="w-full border-b border-stone-300 px-4 py-2 text-center text-sm hover:bg-stone-50"
        >
          Email Client
        </a>
      )}

      {invoice.client_email && invoice.status === 'overdue' && (
        <a
          href={`mailto:${invoice.client_email}?subject=Reminder: Invoice %23${invoice.inv_num}&body=This is a friendly reminder that invoice %23${invoice.inv_num} is overdue.%0A%0AYou can view it here: ${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.id}`}
          className="w-full border-b border-stone-300 px-4 py-2 text-center text-sm hover:bg-stone-50"
        >
          Send Reminder
        </a>
      )}

      {invoice.client_email && invoice.status === 'paid' && (
        <a
          href={`mailto:${invoice.client_email}?subject=Receipt: Invoice %23${invoice.inv_num}&body=This email acknowledges receipt of invoice %23${invoice.inv_num}. Thank you!%0A%0AYou can view it here: ${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoice.id}`}
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
