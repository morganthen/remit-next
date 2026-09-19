'use client';

import { useEffect, useOptimistic, useState, useTransition } from 'react';
import { Invoice, Client, Settings } from '@/lib/types';
import { Button } from '../ui/button';
import { capitalize, formatDate } from '@/lib/utils';
import {
  markInvoiceOverdue,
  markInvoicePaid,
  markInvoiceUnpaid,
  voidInvoice,
} from '@/lib/actions';
import { toast } from 'sonner';

import {
  BanknoteArrowDown,
  BanknoteX,
  Bell,
  EllipsisVerticalIcon,
  MessageSquareWarning,
  Receipt,
  Send,
  TicketX,
  View,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import EditInvoiceDialog from './EditInvoiceDialog';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

type InvoiceRowActionsProps = {
  invoice: Invoice;
  clients: Client[];
  settings: Settings | null;
};

type OptimisticAction =
  | { type: 'paid' }
  | { type: 'unpaid' }
  | { type: 'void' }
  | {
      type: 'edit';
      data: {
        client_name: string;
        client_email: string;
        amount: number;
        due_date: string;
        status: Invoice['status'];
      };
    };

function optimisticReducer(
  state: Invoice,
  action: OptimisticAction
): Invoice {
  switch (action.type) {
    case 'paid':
      return { ...state, status: 'paid', paid_at: new Date().toISOString() };
    case 'unpaid':
      return { ...state, status: 'unpaid', paid_at: null };
    case 'void':
      return { ...state, status: 'void' };
    case 'edit': {
      // Mirror server-side paid_at logic from updateInvoice
      const paid_at =
        action.data.status === 'paid'
          ? state.status === 'paid' && state.paid_at
            ? state.paid_at
            : new Date().toISOString()
          : null;
      return { ...state, ...action.data, paid_at };
    }
  }
}

function isOverdue(invoice: Invoice): boolean {
  const today = new Date();
  const due = new Date(invoice.due_date);
  return invoice.status !== 'paid' && invoice.status !== 'void' && due < today;
}

const statusStyles: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  unpaid:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  overdue: 'bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  draft: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  void: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

export default function InvoiceRowActions({
  invoice,
  clients,
  settings,
}: InvoiceRowActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [optInvoice, addOptimistic] = useOptimistic(invoice, optimisticReducer);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const invoiceUrl = `${appUrl}/invoice/${optInvoice.id}`;

  function buildMailBody(
    template: string | null | undefined,
    fallback: string
  ): string {
    const greeting = `Hi ${optInvoice.client_name},\n\n`;
    const body = `${greeting}${template || fallback}\n\nYou can view the invoice here:\nhttp://${invoiceUrl}`;
    return encodeURIComponent(body);
  }

  // Auto-mark overdue on mount; server revalidation will reflect the change
  useEffect(() => {
    if (isOverdue(invoice) && invoice.status !== 'overdue') {
      markInvoiceOverdue(invoice.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice.id, invoice.status, invoice.due_date]);

  function handleEmailClient(mailtoUrl: string) {
    if (optInvoice.status === 'draft') {
      startTransition(async () => {
        addOptimistic({ type: 'unpaid' });
        const result = await markInvoiceUnpaid(optInvoice.id);
        if (!result.success) {
          toast.error(result.error ?? 'Failed to update invoice status');
          return;
        }
        window.location.href = mailtoUrl;
      });
    } else {
      window.location.href = mailtoUrl;
    }
  }

  function handleMarkPaid() {
    startTransition(async () => {
      addOptimistic({ type: 'paid' });
      const result = await markInvoicePaid(optInvoice.id);
      if (result.success) {
        toast.success('Invoice marked as paid');
      } else {
        toast.error(result.error ?? 'Failed to mark as paid');
      }
    });
  }

  function handleMarkUnpaid() {
    startTransition(async () => {
      addOptimistic({ type: 'unpaid' });
      const result = await markInvoiceUnpaid(optInvoice.id);
      if (result.success) {
        toast.success('Invoice marked as unpaid');
      } else {
        toast.error(result.error ?? 'Failed to mark as unpaid');
      }
    });
  }

  function handleVoid() {
    startTransition(async () => {
      addOptimistic({ type: 'void' });
      const result = await voidInvoice(optInvoice.id);
      if (result.success) {
        toast.success('Invoice voided', { position: 'top-center' });
      } else {
        toast.error(`Failed to void invoice: ${result.error}`, {
          position: 'top-center',
        });
      }
    });
  }

  const overdue = isOverdue(optInvoice);
  const statusKey = overdue ? 'overdue' : optInvoice.status;

  return (
    <>
      <div className="col-span-2 col-start-6 flex w-full flex-col items-center justify-center gap-2">
        <div
          className={`flex min-h-4 min-w-16 flex-col items-center justify-center rounded-full ${statusStyles[statusKey]}`}
        >
          <p className="text-sm">
            {overdue ? 'Overdue' : capitalize(optInvoice.status)}
          </p>
        </div>

        {optInvoice.status === 'paid' && optInvoice.paid_at && (
          <p className="hidden text-center text-xs text-emerald-600 lg:inline">
            {formatDate(optInvoice.paid_at)}
          </p>
        )}
      </div>

      <div className="flex justify-self-end">
        {optInvoice.status === 'draft' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              handleEmailClient(
                `mailto:${optInvoice.client_email}?subject=Invoice %23${optInvoice.inv_num}&body=${buildMailBody(settings?.email_new_invoice, 'Please find your invoice attached. Do not hesitate to reach out if you have any questions.')}`
              )
            }
            disabled={isPending}
          >
            <PaperAirplaneIcon></PaperAirplaneIcon>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger disabled={isPending}>
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-w-36 min-w-32">
            <DropdownMenuGroup>
              <DropdownMenuLabel asChild>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full border-stone-300 text-sm hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
                >
                  <Link href={`/overview/invoices/${optInvoice.id}`}>
                    <View></View>View
                  </Link>
                </Button>
              </DropdownMenuLabel>
              {optInvoice.status !== 'void' && (
                <DropdownMenuLabel asChild>
                  <EditInvoiceDialog
                    invoice={optInvoice}
                    clients={clients}
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    onOptimisticEdit={(data) =>
                      addOptimistic({ type: 'edit', data })
                    }
                  />
                </DropdownMenuLabel>
              )}
              {optInvoice.client_email &&
                optInvoice.status !== 'paid' &&
                optInvoice.status !== 'overdue' &&
                optInvoice.status !== 'void' && (
                  <DropdownMenuLabel asChild>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        handleEmailClient(
                          `mailto:${optInvoice.client_email}?subject=Invoice %23${optInvoice.inv_num}&body=${buildMailBody(settings?.email_new_invoice, 'Please find your invoice attached. Do not hesitate to reach out if you have any questions.')}`
                        )
                      }
                      disabled={isPending}
                      className="w-full border-stone-300 text-center text-sm hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:hover:bg-stone-700"
                    >
                      <Send></Send>
                      Email
                    </Button>
                  </DropdownMenuLabel>
                )}
              {optInvoice.client_email && optInvoice.status === 'overdue' && (
                <DropdownMenuLabel asChild>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleEmailClient(
                        `mailto:${optInvoice.client_email}?subject=Reminder: Invoice %23${optInvoice.inv_num}&body=${buildMailBody(settings?.email_overdue_reminder, 'This is a friendly reminder that your invoice is now overdue. Please arrange payment at your earliest convenience.')}`
                      )
                    }
                    disabled={isPending}
                    className="w-full border-stone-300 text-sm hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:hover:bg-stone-700"
                  >
                    <Bell></Bell>
                    Remind
                  </Button>
                </DropdownMenuLabel>
              )}
              {optInvoice.client_email && optInvoice.status === 'paid' && (
                <DropdownMenuLabel asChild>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleEmailClient(
                        `mailto:${optInvoice.client_email}?subject=Receipt: Invoice %23${optInvoice.inv_num}&body=${buildMailBody(settings?.email_receipt, 'Thank you for your payment. This email confirms receipt of your payment in full.')}`
                      )
                    }
                    disabled={isPending}
                    className="w-full border-stone-300 text-sm hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:hover:bg-stone-700"
                  >
                    <Receipt></Receipt>
                    Send Receipt
                  </Button>
                </DropdownMenuLabel>
              )}
              {optInvoice.client_email && optInvoice.status === 'void' && (
                <DropdownMenuLabel asChild>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleEmailClient(
                        `mailto:${optInvoice.client_email}?subject=Receipt: Invoice %23${optInvoice.inv_num}&body=${buildMailBody(settings?.email_void, 'This email is to inform you that the invoice in question is void.')}`
                      )
                    }
                    disabled={isPending}
                    className="w-full border-stone-300 text-sm hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:hover:bg-stone-700"
                  >
                    <MessageSquareWarning></MessageSquareWarning>
                    Inform
                  </Button>
                </DropdownMenuLabel>
              )}
              {optInvoice.status !== 'paid' &&
                optInvoice.status !== 'draft' &&
                optInvoice.status !== 'void' && (
                  <DropdownMenuLabel asChild>
                    <Button
                      variant="ghost"
                      className="w-full border-stone-300 text-sm text-green-600 hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
                      disabled={isPending}
                      onClick={handleMarkPaid}
                    >
                      <BanknoteArrowDown></BanknoteArrowDown>
                      Mark as Paid
                    </Button>
                  </DropdownMenuLabel>
                )}
              {optInvoice.status === 'paid' && (
                <DropdownMenuLabel asChild>
                  <Button
                    variant="ghost"
                    className="w-full border-stone-300 text-sm text-amber-600 hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
                    disabled={isPending}
                    onClick={handleMarkUnpaid}
                  >
                    <BanknoteX></BanknoteX>
                    Mark as Unpaid
                  </Button>
                </DropdownMenuLabel>
              )}

              {optInvoice.status !== 'void' && (
                <DropdownMenuLabel asChild>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-destructive w-full hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
                      >
                        <TicketX></TicketX>
                        Void
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Void this invoice?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will mark the invoice as void. It will no longer
                          appear in your invoice list but will be kept in
                          records for auditing purposes.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          variant="destructive"
                          disabled={isPending}
                          onClick={handleVoid}
                        >
                          Void Invoice
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuLabel>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
