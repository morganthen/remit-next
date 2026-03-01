'use server';
import { revalidatePath } from 'next/cache';
import { ClientFormData, InvoiceFormData, SettingsFormData } from './schemas';
import { createClient } from './supabase/server';

export async function voidInvoice(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('invoices')
      .update({ status: 'void' })
      .eq('id', id)
      .eq('user_id', user.id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: false, error: 'Invoice not found or not owned by you' };
    }

    return { success: true };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred';
    console.error('Void invoice exception:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function createNewClient(clientData: ClientFormData): Promise<{
  success: boolean;
  error?: string;
  client?: { id: string; name: string; email: string };
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: clientData.name,
      email: clientData.email,
      user_id: user.id,
    })
    .select('id, name, email')
    .single();

  if (error) {
    console.error('Create client failed:', error);
    return { success: false, error: error.message };
  }

  return { success: true, client: data };
}

export async function createInvoice(
  invoiceData: InvoiceFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  // Get next invoice number
  const { data: lastInvoice } = await supabase
    .from('invoices')
    .select('inv_num')
    .eq('user_id', user.id)
    .order('inv_num', { ascending: false })
    .limit(1);

  const nextInvNum =
    lastInvoice && lastInvoice.length > 0 ? lastInvoice[0].inv_num + 1 : 1;

  const { error } = await supabase.from('invoices').insert({
    client_name: invoiceData.client_name,
    client_email: invoiceData.client_email,
    amount: invoiceData.amount,
    due_date: invoiceData.due_date,
    status: 'draft',
    user_id: user.id,
    inv_num: nextInvNum,
  });

  if (error) {
    console.error('Create invoice failed:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateInvoice(
  invoiceId: string,
  invoiceData: InvoiceFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  // Determine paid_at: preserve existing if already paid, set now if newly paid, clear if unpaid
  let paid_at: string | null | undefined = undefined;
  if (invoiceData.status === 'paid') {
    const { data: existing } = await supabase
      .from('invoices')
      .select('status, paid_at')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single();
    paid_at =
      existing?.status === 'paid' && existing?.paid_at
        ? existing.paid_at
        : new Date().toISOString();
  } else {
    paid_at = null;
  }

  const { error } = await supabase
    .from('invoices')
    .update({
      client_name: invoiceData.client_name,
      client_email: invoiceData.client_email,
      amount: invoiceData.amount,
      due_date: invoiceData.due_date,
      status: invoiceData.status,
      paid_at,
    })
    .eq('id', invoiceId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Update invoice failed:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateClient(
  clientId: string,
  clientData: ClientFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('clients')
    .update({
      name: clientData.name,
      email: clientData.email,
    })
    .eq('id', clientId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Update client failed:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteClient(
  clientId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function markInvoicePaid(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('invoices')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'Invoice not found or not owned by you' };
  }

  return { success: true };
}

export async function markInvoiceUnpaid(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('invoices')
    .update({ status: 'unpaid', paid_at: null })
    .eq('id', id)
    .eq('user_id', user.id)
    .select();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'Invoice not found or not owned by you' };
  }

  return { success: true };
}

export async function markInvoiceOverdue(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from('invoices')
    .update({ status: 'overdue' })
    .eq('id', id)
    .eq('user_id', user.id);
}

export async function upsertSettings(
  data: SettingsFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase.from('settings').upsert(
    {
      user_id: user.id,
      ...data,
    },
    {
      onConflict: 'user_id',
      ignoreDuplicates: false, // ← always update if exists
    }
  );

  if (error) {
    console.error('Upsert settings failed:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/overview/settings');
  return { success: true };
}
