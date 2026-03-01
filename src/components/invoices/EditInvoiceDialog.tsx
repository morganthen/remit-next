'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import InvoiceForm from './InvoiceForm';
import { updateInvoice } from '@/lib/actions';
import { Client, Invoice } from '@/lib/types';
import { InvoiceFormData } from '@/lib/schemas';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type EditInvoiceDialogProps = {
  invoice: Invoice;
  clients: Client[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditInvoiceDialog({
  invoice,
  clients,
  open,
  onOpenChange,
}: EditInvoiceDialogProps) {
  const router = useRouter();

  async function handleSubmit(data: InvoiceFormData) {
    const result = await updateInvoice(invoice.id, data);
    if (result.success) {
      toast.success('Invoice updated');
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(result.error ?? 'Failed to update invoice');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Edit Invoice #{String(invoice.inv_num).padStart(4, '0')}
          </DialogTitle>
        </DialogHeader>
        <InvoiceForm
          clients={clients}
          nextInvoiceNumber={invoice.inv_num}
          defaultInvoice={invoice}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
