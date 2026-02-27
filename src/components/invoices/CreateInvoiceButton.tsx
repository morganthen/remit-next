'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import InvoiceForm from './InvoiceForm';
import { createInvoice } from '@/lib/actions';
import { InvoiceFormData } from '@/lib/schemas';

type Client = {
  id: string;
  name: string;
  email: string;
};

type CreateInvoiceButtonProps = {
  clients: Client[];
  nextInvoiceNumber: number;
};

export default function CreateInvoiceButton({
  clients,
  nextInvoiceNumber,
}: CreateInvoiceButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleCreate(data: InvoiceFormData) {
    const result = await createInvoice(data);

    if (result.success) {
      toast.success('Invoice created successfully', { position: 'top-center' });
      setOpen(false);
      router.refresh();
    } else {
      toast.error(`Failed to create invoice: ${result.error}`, {
        position: 'top-center',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon-sm"
          className="fixed right-5 bottom-20 rounded-full shadow-lg md:right-8 md:bottom-10 md:h-12 md:w-12"
        >
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>
        <InvoiceForm
          clients={clients}
          nextInvoiceNumber={nextInvoiceNumber}
          onSubmit={handleCreate}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
