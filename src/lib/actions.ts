import { ClientFormData, InvoiceFormData } from './schemas';
import { createClient } from './supabase/client';

export async function deleteInvoice(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
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

export async function createNewClient(clientData: ClientFormData): Promise<{
  success: boolean;
  error?: string;
  client?: { id: string; name: string; email: string };
}> {
  const supabase = createClient();

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
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  // Look up client name from client_id
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('name')
    .eq('id', invoiceData.client_id)
    .single();

  if (clientError || !client) {
    return { success: false, error: 'Client not found' };
  }

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
    client_id: invoiceData.client_id,
    client_name: client.name,
    amount: invoiceData.amount,
    due_date: invoiceData.due_date,
    status: invoiceData.status,
    user_id: user.id,
    inv_num: nextInvNum,
  });

  if (error) {
    console.error('Create invoice failed:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
