import { supabase } from './supabase';
import { Invoice, newInvoice as newInvoiceType } from './types';

export async function getInvoices(): Promise<Invoice[]> {
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
    throw new Error("There's an error getting invoices");
  }
  return (data ?? []) as unknown as Invoice[];
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

// ...existing code...

export async function getTotalCollected() {
  const { data, error } = await supabase
    .from('invoices')
    .select('amount')
    .eq('status', 'paid');

  if (error) {
    console.error(error);
    throw new Error("There's an error getting total collected");
  }

  return data.reduce((sum, invoice) => sum + invoice.amount, 0);
}

export async function getTotalOwed() {
  const { data, error } = await supabase
    .from('invoices')
    .select('amount')
    .in('status', ['unpaid', 'overdue']);

  if (error) {
    console.error(error);
    throw new Error("There's an error getting total owed");
  }

  return data.reduce((sum, invoice) => sum + invoice.amount, 0);
}

// export async function createInvoice({ newInvoice }: newInvoiceType) {
//   const { data, error } = await supabase
//     .from('invoices')
//     .insert([{ some_column: 'someValue', other_column: 'otherValue' }])
//     .select();

//   if (error) {
//     console.error(error);
//     throw new Error('Invoice could not be created');
//   }
// }

// ...existing code...
export async function deleteInvoice(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // request deleted row back so we can inspect response
    const { data, error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .select();

    console.log('supabase.delete response:', { id, data, error });

    if (error) {
      console.error(error);
      throw new Error('Invoice could not be deleted');
    }
    // if no rows returned, log that too
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.warn('Delete returned no rows for id:', id);
    }

    return { success: true };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred';
    console.error('Delete invoice failed', errorMessage);
    return { success: false, error: errorMessage };
  }
}
