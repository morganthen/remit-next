'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ClientFormData } from '@/lib/schemas';
import { updateClient } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';

const ClientForm = dynamic(() => import('./ClientForm'), { ssr: false });

type EditClientDialogProps = {
  client: {
    id: string;
    name: string;
    email: string;
  };
  isDeleting: boolean;
};

export default function EditClientDialog({
  isDeleting,
  client,
}: EditClientDialogProps) {
  const [open, setOpen] = useState(false);

  async function onSubmit(data: ClientFormData) {
    const result = await updateClient(client.id, data);

    if (result.success) {
      toast.success('Client updated successfully', { position: 'top-center' });
      setOpen(false);
    } else {
      toast.error(`Failed to update client: ${result.error}`, {
        position: 'top-center',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full border-stone-300 text-sm hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
          disabled={isDeleting}
        >
          <Pencil></Pencil>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <ClientForm
          defaultValues={{ name: client.name, email: client.email }}
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
}
