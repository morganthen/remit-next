import { z } from 'zod';

export const invoiceSchema = z.object({
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

export const settingsSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  business_email: z.string().email('Invalid email').or(z.literal('')),
  business_phone: z.string().optional(),
  business_address: z.string().optional(),
  payment_bank_name: z.string().optional(),
  payment_account_name: z.string().optional(),
  payment_account_number: z.string().optional(),
  payment_bsb: z.string().optional(),
  payment_notes: z.string().optional(),
  email_new_invoice: z.string().optional(),
  email_overdue_reminder: z.string().optional(),
  email_receipt: z.string().optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
