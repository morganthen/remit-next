'use client';

import { useEffect, useRef, useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Invoice } from '@/lib/types';
import { Button } from '../ui/button';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { capitalize } from '@/lib/utils';
import { deleteInvoice } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ActionButton from './ActionButton';

type InvoiceRowProps = {
  invoice: Invoice;
};

export default function InvoiceRow({ invoice }: InvoiceRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("InvoiceRow mounted for id:', invoice.id");
  }, [invoice.id]);

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

      // Ignore clicks inside any AlertDialog portal (rendered in document.body)
      const alertDialogContent = document.querySelector('[role="alertdialog"]');
      if (alertDialogContent && alertDialogContent.contains(target)) {
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

  async function handleDelete() {
    try {
      console.log('handleDelete initiated for ID:', invoice.id);
      const result = await deleteInvoice(invoice.id);
      console.log('deleteInvoice result:', result);
      if (result.success) {
        toast.success('Invoice deleted successfully', {
          position: 'top-center',
        });
        router.refresh();
      } else {
        toast.error(`failed to delete invoice: ${result.error}`, {
          position: 'top-center',
        });
      }
    } catch (err) {
      console.error('handleDelete unexpected error:', err);
      toast.error('Unexpected error deleting invoice', {
        position: 'top-center',
      });
    }
  }

  const statusStyles: Record<string, string> = {
    paid: 'bg-emerald-100 text-emerald-700',
    unpaid: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    draft: 'bg-blue-50 text-blue-700',
  };

  return (
    <div className="relative grid max-w-full grid-cols-[auto_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center justify-between gap-x-3 rounded-lg border border-stone-100 bg-white px-5 py-5 shadow-sm transition-all hover:border-stone-300 hover:shadow-md">
      {/*Invoice Number*/}
      <div className="col-span1 col-start-1">
        <p className="text-xs text-stone-400">{invoice.inv_num}</p>
      </div>
      {/*Client name and email*/}
      <div className="col-span-2 col-start-2">
        <p>{invoice.client_name}</p>
        <p className="hidden text-xs text-stone-400 md:block">
          {invoice.clients?.email ?? 'No email'}
        </p>
      </div>
      {/*amount and date*/}
      <div className="col-span-3 col-start-4 flex flex-col items-center justify-center pl-4">
        <p className="text-sm">{formatCurrency(invoice.amount)}</p>
        <p className="text-xs text-stone-400">{formatDate(invoice.due_date)}</p>
      </div>
      {/*status*/}
      <div
        className={`col-span-1 col-start-7 flex flex-col items-center justify-center rounded-full px-2 py-1 ${statusStyles[invoice.status]}`}
      >
        <p className="text-xs text-stone-400">{capitalize(invoice.status)}</p>
      </div>
      {/*action button*/}
      <div
        ref={menuRef}
        className="relative col-span-1 col-end-9 flex justify-end"
      >
        <Button
          variant="outline"
          onClick={() => {
            console.log('menu toggle clicked, prev:', menuOpen);
            setMenuOpen((prev) => !prev);
          }}
        >
          <Bars3Icon />
        </Button>
        {menuOpen && <ActionButton onDelete={handleDelete} />}
      </div>
    </div>
  );
}
