'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Client } from '@/lib/types';
import EditClientDialog from './EditClientDialog';
import { deleteClient } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function ClientRow({ client }: { client: Client }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
    const result = await deleteClient(client.id);
    if (result.success) {
      toast.success('Client deleted');
      router.refresh();
    } else {
      toast.error(result.error ?? 'Failed to delete client');
    }
    setOpen(false);
  }

  return (
    <div className="relative mb-2 grid max-w-full min-w-4 grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] items-center justify-between gap-x-3 rounded-lg border border-stone-100 bg-white px-5 py-5 shadow-sm transition-all hover:border-stone-300 hover:shadow-md md:min-w-full">
      {/*Client name and email*/}
      <div className="col-span-2 col-start-1 flex flex-col">
        <p>{client.name}</p>
      </div>
      <div className="col-span-2 col-start-4 flex items-center justify-center text-xs text-stone-400">
        <p>{client.email}</p>
      </div>

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
          <div className="absolute top-full right-0 z-10 mt-1 flex w-36 flex-col items-center rounded-md border border-stone-200 bg-white shadow-md">
            <EditClientDialog
              client={client}
              className="w-full border-b border-stone-300 px-4 py-2 text-center text-sm hover:bg-stone-50"
            />
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <button className="w-full border-b border-stone-300 px-4 py-2 text-center text-sm text-red-600 hover:bg-stone-50">
                  Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this client?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove the client from your address book. Existing
                    invoices will not be affected.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
