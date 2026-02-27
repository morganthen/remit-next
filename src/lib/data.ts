import { createClient } from './supabase/server';
import { Invoice, newInvoice as newInvoiceType, Client } from './types';

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('invoices')
    .select(
      `
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
    `
    )
    .eq('user_id', user.id);

  if (error) {
    console.error(error);
    throw new Error("There's an error getting invoices");
  }
  return (data ?? []) as unknown as Invoice[];
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('clients')
    .select('id, name, email')
    .eq('user_id', user.id)
    .order('name');

  if (error) {
    console.error(error);
    throw new Error("There's an error getting clients");
  }

  return (data ?? []) as Client[];
}

export async function getNextInvoiceNumber(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('invoices')
    .select('inv_num')
    .eq('user_id', user.id)
    .order('inv_num', { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
    throw new Error("There's an error getting next invoice number");
  }

  // if no invoices exist yet, start at one
  if (!data || data.length === 0) return 1;

  return data[0].inv_num + 1;
}

export async function getTotalCollected() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('invoices')
    .select('amount')
    .eq('status', 'paid')
    .eq('user_id', user.id);

  if (error) {
    console.error(error);
    throw new Error("There's an error getting total collected");
  }
  return data?.reduce((acc, inv) => acc + inv.amount, 0) ?? 0;
}

export async function getTotalOwed() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('invoices')
    .select('amount')
    .in('status', ['unpaid', 'overdue'])
    .eq('user_id', user.id);

  if (error) {
    console.error(error);
    throw new Error("There's an error getting total owed");
  }
  return data?.reduce((acc, inv) => acc + inv.amount, 0) ?? 0;
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
