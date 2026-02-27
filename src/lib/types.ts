export type Invoice = {
  id: string; // changed from number to string (UUID)
  amount: number;
  due_date: string;
  status: string;
  created_at: string;
  inv_num: number; // changed from string to number
  client_name: string;
  clients: { email: string };
};

export type Client = {
  id: string;
  name: string;
  email: string;
};

export type newInvoice = {};
