'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import dynamic from 'next/dynamic';
import { ClientFormData } from '@/lib/schemas';
import { createNewClient } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

const ClientForm = dynamic(() => import('./ClientForm'), { ssr: false });

type CreateClientDialogProps = {
  onClientCreated?: (client: {
    id: string;
    name: string;
    email: string;
  }) => void;
  className: string;
  onNestedOpen?: Dispatch<SetStateAction<boolean>>;
  variant?:
    | 'outline'
    | 'default'
    | 'link'
    | 'destructive'
    | 'secondary'
    | 'ghost';
};

export default function CreateClientDialog({
  onNestedOpen,
  onClientCreated,
  className,
  variant,
}: CreateClientDialogProps) {
  const [open, setOpen] = useState(false);

  async function onSubmit(data: ClientFormData) {
    if (onClientCreated) {
      // Inline mode (used inside InvoiceForm) — wait for the server so we can
      // hand the real client (with its server-assigned id) back to the caller.
      const result = await createNewClient(data);
      if (result.success && result.client) {
        toast.success('Client created successfully', {
          position: 'top-center',
        });
        onClientCreated(result.client);
        setOpen(false);
      } else {
        toast.error(`Failed to create client: ${result.error}`, {
          position: 'top-center',
        });
      }
      return;
    }

    // Standalone mode — close immediately, run the server in the background.
    setOpen(false);
    const result = await createNewClient(data);
    if (result.success) {
      toast.success('Client created successfully', { position: 'top-center' });
    } else {
      toast.error(`Failed to create client: ${result.error}`, {
        position: 'top-center',
      });
    }
  }

  function openChange(value: boolean) {
    setOpen(value);
    onNestedOpen?.(value);
  }

  return (
    <div className="z-10">
      <Dialog open={open} onOpenChange={openChange}>
        <DialogTrigger asChild>
          <Button
            type="button"
            size="icon-sm"
            className={className}
            variant={variant}
          >
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <ClientForm
            onSubmit={onSubmit}
            onCancel={() => setOpen(false)}
            submitLabel="Save Client"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
