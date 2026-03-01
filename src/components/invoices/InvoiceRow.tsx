'use client';

import { useEffect, useRef, useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Invoice, Client } from '@/lib/types';
import { Button } from '../ui/button';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { capitalize } from '@/lib/utils';
import { markInvoiceOverdue, voidInvoice } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ActionButton from './ActionButton';
import EditInvoiceDialog from './EditInvoiceDialog';

type InvoiceRowProps = {
  invoice: Invoice;
  clients: Client[];
};

export default function InvoiceRow({ invoice, clients }: InvoiceRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Ignore clicks inside the menu
      if (menuRef.current && menuRef.current.contains(target)) {
        return;
      }

      // Check if click is inside any radix portal (dialogs, alerts, etc.)
      const portalContainer = (target as Element).closest?.(
        '[data-radix-portal]'
      );
      if (portalContainer) {
        return;
      }

      setMenuOpen(false);
    }

    // Bind event listener only when the menu is open
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  async function handleVoid() {
    const result = await voidInvoice(invoice.id);
    if (result.success) {
      toast.success('Invoice voided', { position: 'top-center' });
      router.refresh();
    } else {
      toast.error(`Failed to void invoice: ${result.error}`, {
        position: 'top-center',
      });
    }
    setMenuOpen(false);
  }

  const statusStyles: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700',
    unpaid: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-200 text-red-700',
    draft: 'bg-blue-50 text-blue-700',
    void: 'bg-red-50 text-red-700',
  };

  return (
    <div
      id={`invoice-content-${invoice.id}`}
      className="relative mb-2 grid max-w-full grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center justify-between gap-x-3 rounded-lg border border-stone-100 bg-white px-5 py-5 shadow-sm transition-all hover:border-stone-300 hover:shadow-md"
    >
      {/*Invoice Number*/}
      <div className="col-span-1 col-start-1">
        <p className="text-xs text-stone-400">#{invoice.inv_num}</p>
      </div>
      {/*Client name and email*/}
      <div className="col-span-1 col-start-2 min-w-3">
        <p>{invoice.client_name}</p>
        <p className="hidden text-xs text-stone-400 md:block">
          {invoice.client_email ?? 'No email'}
        </p>
      </div>
      {/*amount and date*/}
      <div className="col-span-3 col-start-4 flex min-w-6 flex-col items-center justify-center pl-4">
        <p className="text-sm">{formatCurrency(invoice.amount)}</p>
        <p className="text-xs text-stone-400">{formatDate(invoice.due_date)}</p>
      </div>
      {/*status*/}
      <div
        className={`col-span-1 col-start-7 flex min-w-16 flex-col items-center justify-center rounded-full px-2 py-1 ${isOverdue(invoice) ? statusStyles['overdue'] : statusStyles[invoice.status]}`}
      >
        <p className="text-xs text-stone-400">
          {isOverdue(invoice) ? 'Overdue' : capitalize(invoice.status)}
        </p>
      </div>
      {/*action button*/}
      <div
        ref={menuRef}
        className="relative col-span-1 col-end-9 flex justify-end"
      >
        <Button
          variant="outline"
          onClick={() => {
            setMenuOpen((prev) => !prev);
          }}
        >
          <Bars3Icon />
        </Button>
        {menuOpen && (
          <ActionButton
            onVoid={handleVoid}
            invoiceId={invoice.id}
            status={invoice.status}
            invoice={invoice}
            clients={clients}
            onEdit={() => {
              setMenuOpen(false); // close menu
              setEditOpen(true); // open dialog
            }}
          />
        )}

        <EditInvoiceDialog
          invoice={invoice}
          clients={clients}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      </div>
    </div>
  );
}
