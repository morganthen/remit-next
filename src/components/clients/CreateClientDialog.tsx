'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, ClientFormData } from '@/lib/schemas';
import { createNewClient } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

type CreateClientDialogProps = {
  onClientCreated?: (client: {
    id: string;
    name: string;
    email: string;
  }) => void;
};

export default function CreateClientDialog({
  onClientCreated,
}: CreateClientDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  async function onSubmit(data: ClientFormData) {
    const result = await createNewClient(data);

    if (result.success && result.client) {
      toast.success('Client created successfully', { position: 'top-center' });
      onClientCreated?.(result.client);
      reset();
      setOpen(false);
      router.refresh();
    } else {
      toast.error(`Failed to create client: ${result.error}`, {
        position: 'top-center',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <PlusIcon className="h-4 w-4" />
          <span className="ml-1">New</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
