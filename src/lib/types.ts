export type Invoice = {
  id: string; // changed from number to string (UUID)
  amount: number;
  due_date: string;
  status: 'draft' | 'unpaid' | 'paid' | 'overdue' | 'void';
  created_at: string;
  inv_num: number; // changed from string to number
  client_name: string;
  client_email: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
};
