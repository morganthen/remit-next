'use client';

import { useTransition } from 'react';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { updateInvoice } from '@/lib/actions';
import { Client, Invoice } from '@/lib/types';
import { InvoiceFormData } from '@/lib/schemas';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Pencil } from 'lucide-react';

const InvoiceForm = dynamic(() => import('./InvoiceForm'), { ssr: false });

type EditInvoiceDialogProps = {
  invoice: Invoice;
  clients: Client[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOptimisticEdit: (data: {
    client_name: string;
    client_email: string;
    amount: number;
    due_date: string;
    status: Invoice['status'];
  }) => void;
};

export default function EditInvoiceDialog({
  invoice,
  clients,
  open,
  onOpenChange,
  onOptimisticEdit,
}: EditInvoiceDialogProps) {
  const [, startTransition] = useTransition();

  async function handleSubmit(data: InvoiceFormData) {
    onOpenChange(false);
    startTransition(async () => {
      onOptimisticEdit({
        client_name: data.client_name,
        client_email: data.client_email,
        amount: data.amount,
        due_date: data.due_date,
        status: data.status,
      });
      const result = await updateInvoice(invoice.id, data);
      if (result.success) {
        toast.success('Invoice updated');
      } else {
        toast.error(result.error ?? 'Failed to update invoice');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full border-stone-300 text-sm hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
        >
          <Pencil></Pencil>
          Edit
        </Button>
      </DialogTrigger>
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
