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

type ActionButtonProps = {
  onVoid: () => Promise<void>;
  invoiceId: string;
  status: string;
  invoice: Invoice;
};

export default function ActionButton({
  onVoid,
  invoiceId,
  status,
  invoice,
}: ActionButtonProps) {
  const [open, setOpen] = useState(false);
  const [isVoiding, setIsVoiding] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isUnpaying, setIsUnpaying] = useState(false);

  async function handleMarkUnpaid() {
    setIsUnpaying(true);
    const result = await markInvoiceUnpaid(invoiceId);
    if (result.success) {
      toast.success('Invoice marked as unpaid');
      window.location.reload();
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
      window.location.reload();
    } else {
      toast.error(result.error ?? 'Failed to mark as paid');
    }
    setIsPaying(false);
  }
  async function handleConfirmVoid() {
    console.log('handleConfirmVoid called');
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
      <button className="w-full border-b border-stone-300 px-4 py-2 text-sm hover:bg-stone-50">
        View Invoice
      </button>
      <button className="w-full border-b border-stone-300 px-4 py-2 text-sm hover:bg-stone-50">
        Edit
      </button>
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
        <AlertDialogTrigger
          onClick={() => console.log('Delete button pressed')}
          asChild
        >
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
