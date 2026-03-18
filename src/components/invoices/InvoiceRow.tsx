'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Invoice, Client, Settings } from '@/lib/types';
import { Button } from '../ui/button';
import { capitalize } from '@/lib/utils';
import {
  markInvoiceOverdue,
  markInvoicePaid,
  markInvoiceUnpaid,
  voidInvoice,
} from '@/lib/actions';
import { useRouter } from 'next/navigation';
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

type InvoiceRowProps = {
  invoice: Invoice;
  clients: Client[];
  settings: Settings | null;
};

export default function InvoiceRow({
  invoice,
  clients,
  settings,
}: InvoiceRowProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isUnpaying, setIsUnpaying] = useState(false);
  const [voiding, setVoiding] = useState(false);
  const router = useRouter();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const invoiceUrl = `${appUrl}/invoice/${invoice.id}`;

  function buildMailBody(
    template: string | null | undefined,
    fallback: string
  ): string {
    const greeting = `Hi ${invoice.client_name},\n\n`;
    const body = `${greeting}${template || fallback}\n\nYou can view the invoice here:\nhttp://${invoiceUrl}`;
    return encodeURIComponent(body);
  }

  function isOverdue(invoice: Invoice): boolean {
    const today = new Date();
    const due = new Date(invoice.due_date);
    return (
      invoice.status !== 'paid' && invoice.status !== 'void' && due < today
    );
  }
  useEffect(() => {
    if (isOverdue(invoice) && invoice.status !== 'overdue') {
      markInvoiceOverdue(invoice.id).then(() => {
        router.refresh();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice.id, invoice.status, invoice.due_date]);

  async function handleEmailClient(mailtoUrl: string) {
    if (invoice.status === 'draft') {
      setIsEmailing(true);
      const result = await markInvoiceUnpaid(invoice.id);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to update invoice status');
        setIsEmailing(false);
        return; // don't open mailto if update failed
      }
      setIsEmailing(false);
    }
    window.location.href = mailtoUrl;
  }

  async function handleMarkPaid() {
    setIsPaying(true);
    const result = await markInvoicePaid(invoice.id);
    if (result.success) {
      toast.success('Invoice marked as paid');
      router.refresh();
    } else {
      toast.error(result.error ?? 'Failed to mark as paid');
    }
    setIsPaying(false);
  }

  async function handleMarkUnpaid() {
    setIsUnpaying(true);
    const result = await markInvoiceUnpaid(invoice.id);
    if (result.success) {
      toast.success('Invoice marked as unpaid');
      router.refresh();
    } else {
      toast.error(result.error ?? 'Failed to mark as unpaid');
    }
    setIsUnpaying(false);
  }

  async function handleVoid() {
    setVoiding(true);
    const result = await voidInvoice(invoice.id);
    if (result.success) {
      toast.success('Invoice voided', { position: 'top-center' });
      setVoiding(false);
      router.refresh();
    } else {
      toast.error(`Failed to void invoice: ${result.error}`, {
        position: 'top-center',
      });
      setVoiding(false);
    }
  }

  const statusStyles: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    unpaid:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    overdue: 'bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    draft: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    void: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div
      id={`invoice-content-${invoice.id}`}
      className="relative mb-2 grid max-w-full grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center justify-between gap-x-3 rounded-lg border border-stone-100 bg-white px-5 py-5 shadow-sm transition-all hover:border-stone-300 hover:shadow-md dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-500"
    >
      {/*Invoice Number -> Status (clickable)*/}
      <Link href={`/overview/invoices/${invoice.id}`} className="contents">
        <div className="col-span-1 col-start-1">
          <p className="text-xs text-stone-400 dark:text-stone-500">
            #{invoice.inv_num}
          </p>
        </div>
        {/*Client name and email*/}
        <div className="col-span-1 col-start-2 min-w-3">
          <p>{invoice.client_name}</p>
          <p className="hidden text-xs text-stone-400 lg:block dark:text-stone-500">
            {invoice.client_email ?? 'No email'}
          </p>
        </div>
        {/*amount and date*/}
        <div className="col-span-2 col-start-4 flex min-w-8 flex-col items-center justify-center gap-2 pl-4">
          <p className="text-sm">{formatCurrency(invoice.amount)}</p>
          <p className="text-xs text-stone-400 dark:text-stone-500">
            {formatDate(invoice.due_date)}
          </p>
        </div>
        {/*status*/}
        <div className="col-span-2 col-start-6 flex w-full flex-col items-center justify-center gap-2">
          <div
            className={`flex min-h-4 min-w-16 flex-col items-center justify-center rounded-full ${isOverdue(invoice) ? statusStyles['overdue'] : statusStyles[invoice.status]}`}
          >
            <p className="text-sm">
              {isOverdue(invoice) ? 'Overdue' : capitalize(invoice.status)}
            </p>
          </div>

          {invoice.status === 'paid' && invoice.paid_at && (
            <p className="hidden text-center text-xs text-emerald-600 lg:inline">
              {formatDate(invoice.paid_at)}
            </p>
          )}
        </div>
      </Link>

      <div className="flex justify-self-end">
        {invoice.status === 'draft' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              handleEmailClient(
                `mailto:${invoice.client_email}?subject=Invoice %23${invoice.inv_num}&body=${buildMailBody(settings?.email_new_invoice, 'Please find your invoice attached. Do not hesitate to reach out if you have any questions.')}`
              )
            }
            disabled={isEmailing}
          >
            <PaperAirplaneIcon></PaperAirplaneIcon>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger disabled={isEmailing}>
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
                  <Link href={`/overview/invoices/${invoice.id}`}>
                    <View></View>View
                  </Link>
                </Button>
              </DropdownMenuLabel>
              {invoice.status !== 'void' && (
                <DropdownMenuLabel asChild>
                  <EditInvoiceDialog
                    invoice={invoice}
                    clients={clients}
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                  />
                </DropdownMenuLabel>
              )}
              {invoice.client_email &&
                invoice.status !== 'paid' &&
                invoice.status !== 'overdue' &&
                invoice.status !== 'void' && (
                  <DropdownMenuLabel asChild>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        handleEmailClient(
                          `mailto:${invoice.client_email}?subject=Invoice %23${invoice.inv_num}&body=${buildMailBody(settings?.email_new_invoice, 'Please find your invoice attached. Do not hesitate to reach out if you have any questions.')}`
                        )
                      }
                      disabled={isEmailing}
                      className="w-full border-stone-300 text-center text-sm hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:hover:bg-stone-700"
                    >
                      <Send></Send>
                      {isEmailing ? 'Sending...' : 'Email'}
                    </Button>
                  </DropdownMenuLabel>
                )}
              {invoice.client_email && invoice.status === 'overdue' && (
                <DropdownMenuLabel asChild>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleEmailClient(
                        `mailto:${invoice.client_email}?subject=Reminder: Invoice %23${invoice.inv_num}&body=${buildMailBody(settings?.email_overdue_reminder, 'This is a friendly reminder that your invoice is now overdue. Please arrange payment at your earliest convenience.')}`
                      )
                    }
                    disabled={isEmailing}
                    className="w-full border-stone-300 text-sm hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:hover:bg-stone-700"
                  >
                    <Bell></Bell>
                    Remind
                  </Button>
                </DropdownMenuLabel>
              )}
              {invoice.client_email && invoice.status === 'paid' && (
                <DropdownMenuLabel asChild>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleEmailClient(
                        `mailto:${invoice.client_email}?subject=Receipt: Invoice %23${invoice.inv_num}&body=${buildMailBody(settings?.email_receipt, 'Thank you for your payment. This email confirms receipt of your payment in full.')}`
                      )
                    }
                    disabled={isEmailing}
                    className="w-full border-stone-300 text-sm hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:hover:bg-stone-700"
                  >
                    <Receipt></Receipt>
                    Send Receipt
                  </Button>
                </DropdownMenuLabel>
              )}
              {invoice.client_email && invoice.status === 'void' && (
                <DropdownMenuLabel asChild>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleEmailClient(
                        `mailto:${invoice.client_email}?subject=Receipt: Invoice %23${invoice.inv_num}&body=${buildMailBody(settings?.email_void, 'This email is to inform you that the invoice in question is void.')}`
                      )
                    }
                    disabled={isEmailing}
                    className="w-full border-stone-300 text-sm hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:hover:bg-stone-700"
                  >
                    <MessageSquareWarning></MessageSquareWarning>
                    Inform
                  </Button>
                </DropdownMenuLabel>
              )}
              {invoice.status !== 'paid' &&
                invoice.status !== 'draft' &&
                invoice.status !== 'void' && (
                  <DropdownMenuLabel asChild>
                    <Button
                      variant="ghost"
                      className="w-full border-stone-300 text-sm text-green-600 hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
                      disabled={isPaying}
                      onClick={handleMarkPaid}
                    >
                      <BanknoteArrowDown></BanknoteArrowDown>
                      {isPaying ? 'Marking...' : 'Mark as Paid'}
                    </Button>
                  </DropdownMenuLabel>
                )}
              {invoice.status === 'paid' && (
                <DropdownMenuLabel asChild>
                  <Button
                    variant="ghost"
                    className="w-full border-stone-300 text-sm text-amber-600 hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
                    disabled={isUnpaying}
                    onClick={handleMarkUnpaid}
                  >
                    <BanknoteX></BanknoteX>
                    {isUnpaying ? 'Marking...' : 'Mark as Unpaid'}
                  </Button>
                </DropdownMenuLabel>
              )}

              {invoice.status !== 'void' && (
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
                        <AlertDialogCancel disabled={voiding}>
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          variant="destructive"
                          disabled={voiding}
                          onClick={handleVoid}
                        >
                          {voiding ? 'Voiding...' : 'Void Invoice'}
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
    </div>
  );
}
