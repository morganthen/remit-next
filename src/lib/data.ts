import { createClient } from './supabase/server';
import { Invoice, Client } from './types';

// creates client and gets user once (attempting to f)
async function getSupabaseWithUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  return { supabase, user };
}

export async function getInvoices(
  showVoid: boolean = false
): Promise<Invoice[]> {
  const { supabase, user } = await getSupabaseWithUser();

  let query = supabase
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
      client_email
    `
    )
    .eq('user_id', user.id)
    .order('inv_num', { ascending: false });

  if (!showVoid) {
    query = query.neq('status', 'void');
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("There's an error getting invoices");
  }
  return (data ?? []) as unknown as Invoice[];
}

export async function getRecentInvoices(): Promise<Invoice[]> {
  const { supabase, user } = await getSupabaseWithUser();

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
      client_email
    `
    )
    .eq('user_id', user.id)
    .neq('status', 'void')
    .order('inv_num', { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
    throw new Error("There's an error getting recent invoices");
  }
  return (data ?? []) as unknown as Invoice[];
}

export async function getClients(): Promise<Client[]> {
  const { supabase, user } = await getSupabaseWithUser();

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
  const { supabase, user } = await getSupabaseWithUser();

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
  const { supabase, user } = await getSupabaseWithUser();

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
  const { supabase, user } = await getSupabaseWithUser();

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

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const { supabase, user } = await getSupabaseWithUser();
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) return null;
  return data as Invoice;
}
