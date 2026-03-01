export type Invoice = {
  id: string;
  user_id: string;
  amount: number;
  due_date: string;
  status: 'draft' | 'unpaid' | 'paid' | 'overdue' | 'void';
  created_at: string;
  inv_num: number;
  client_name: string;
  client_email: string;
};

export type Settings = {
  user_id: string;
  business_name: string | null;
  business_email: string | null;
  business_phone: string | null;
  business_address: string | null;
  payment_bank_name: string | null;
  payment_account_name: string | null;
  payment_account_number: string | null;
  payment_bsb: string | null;
  payment_notes: string | null;
  email_new_invoice: string | null;
  email_overdue_reminder: string | null;
  email_receipt: string | null;
  created_at: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
};
