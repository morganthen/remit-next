'use client';

import { useEffect, useRef, useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Invoice } from '@/lib/types';
import { Button } from '../ui/button';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { capitalize } from '@/lib/utils';
import { deleteInvoice } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type InvoiceRowProps = {
  invoice: Invoice;
};

export default function InvoiceRow({ invoice }: InvoiceRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    // Bind the event listener only when the menu is open
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]); // <-- Add menuOpen here

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this invoice? This action cannot be undone'
    );

    if (confirmed) {
      const result = await deleteInvoice(invoice.id);
      if (result.sucess) {
        toast.success('Invoice deleted successfully', {
          position: 'top-center',
        });
        router.refresh();
      } else {
        toast.error('failed to delete invoice: ${result.error}', {
          position: 'top-center',
        });
      }
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
          {invoice.clients.email}
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
        <Button variant="outline" onClick={() => setMenuOpen((prev) => !prev)}>
          <Bars3Icon />
        </Button>
        {menuOpen && (
          <div className="absolute top-full right-0 z-10 mt-1 w-36 rounded-md border border-stone-200 bg-white py-1 shadow-md">
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-stone-50">
              View
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-stone-50">
              Edit
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-stone-50"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
