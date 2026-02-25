import { supabase } from './supabase';

export async function getInvoices() {
  const { data, error } = await supabase.from('invoices').select(`
    id,
    amount,
    due_date,
    status,
    created_at,
    inv_num,
    client_name,
    clients (
      email
    )
  `);

  if (error) {
    console.error(error);
  }

  return data;
}
//make sure to work on RLS policies
export async function getClients() {
  const { data, error } = await supabase.from('invoices').select(`
    *,
    clients (*)
`);

  if (error) {
    console.error(error);
  }

  return data;
}

export async function getLastFiveInvoices() {
  return null;
}
