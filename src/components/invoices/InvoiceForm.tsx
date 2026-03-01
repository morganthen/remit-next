'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceSchema, InvoiceFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CreateClientDialog from '@/components/clients/CreateClientDialog';
import { Client, Invoice } from '@/lib/types';

const STATUSES = ['draft', 'unpaid', 'paid', 'overdue', 'void'] as const;

type InvoiceFormProps = {
  clients: Client[];
  nextInvoiceNumber: number;
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  onCancel: () => void;
  defaultInvoice?: Invoice; // ← new, optional
};

export default function InvoiceForm({
  clients: initialClients,
  nextInvoiceNumber,
  onSubmit,
  onCancel,
  defaultInvoice,
}: InvoiceFormProps) {
  const isEditing = !!defaultInvoice;
  const [clients, setClients] = useState<Client[]>(initialClients);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: isEditing
      ? {
          client_name: defaultInvoice.client_name,
          client_email: defaultInvoice.client_email,
          amount: defaultInvoice.amount,
          due_date: defaultInvoice.due_date.split('T')[0], //strip time if present
          status: defaultInvoice.status,
        }
      : {
          status: 'draft',
        },
  });

  function handleClientSelected(clientId: string) {
    const selected = clients.find((c) => c.id === clientId);
    if (selected) {
      setValue('client_name', selected.name);
      setValue('client_email', selected.email);
    }
  }

  function handleClientCreated(client: Client) {
    setClients((prev) =>
      [...prev, client].sort((a, b) => a.name.localeCompare(b.name))
    );
    setValue('client_name', client.name);
    setValue('client_email', client.email);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Invoice number — read only */}
      <div>
        <Label>Invoice Number</Label>
        <p className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-500">
          #
          {isEditing
            ? String(defaultInvoice.inv_num).padStart(4, '0')
            : String(nextInvoiceNumber).padStart(4, '0')}
        </p>
      </div>

      {/* Client selection */}
      <div>
        <Label>Client</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Select
              onValueChange={handleClientSelected}
              defaultValue={
                isEditing
                  ? clients.find((c) => c.name === defaultInvoice.client_name)
                      ?.id
                  : undefined
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CreateClientDialog onClientCreated={handleClientCreated} />
        </div>
        {errors.client_name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.client_name.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          min="0"
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>
        )}
      </div>

      {/* Due date */}
      <div>
        <Label htmlFor="due_date">Due Date</Label>
        <Input id="due_date" type="date" {...register('due_date')} />
        {errors.due_date && (
          <p className="mt-1 text-xs text-red-500">{errors.due_date.message}</p>
        )}
      </div>

      {/* Status — only shown when editing */}
      {isEditing && (
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            onValueChange={(value) =>
              setValue('status', value as InvoiceFormData['status'])
            }
            defaultValue={defaultInvoice.status}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? 'Saving...'
              : 'Creating...'
            : isEditing
              ? 'Save Changes'
              : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}
