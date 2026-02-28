import { z } from 'zod';

export const invoiceSchema = z.object({
  client_id: z.string().min(1, 'Client is required'),
  client_name: z.string().min(1, 'Client name is required'),
  client_email: z.string().email('Invalid email'),
  amount: z.number().positive('Amount must be greater than 0'),
  due_date: z.string().min(1, 'Due date is required'),
  status: z.enum(['draft', 'unpaid', 'paid', 'overdue', 'void']),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email'),
});

export type ClientFormData = z.infer<typeof clientSchema>;
