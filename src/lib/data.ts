import { supabase } from './supabase';

export async function getInvoices() {
  const { data, error } = await supabase.from('invoices').select('*');

  if (error) {
    console.error(error);
  }

  return data;
}

export async function getLastFiveInvoices() {
  return null;
}
