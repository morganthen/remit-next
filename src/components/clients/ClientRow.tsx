'use client';

import { useState } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { EllipsisVertical, Trash } from 'lucide-react';

export default function ClientRow({ client }: { client: Client }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteClient(client.id);

    if (result.success) {
      toast.success('Client deleted');
      router.refresh();
      setIsDeleting(false);
    } else {
      toast.error(result.error ?? 'Failed to delete client');
      setIsDeleting(false);
    }
  }

  return (
    <div className="relative mb-2 grid max-w-full min-w-4 grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] items-center justify-between gap-x-3 rounded-lg border border-stone-100 bg-white px-5 py-5 shadow-sm transition-all hover:border-stone-300 hover:shadow-md md:min-w-full dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-500">
      {/*Client name and email*/}
      <div className="col-span-2 col-start-1 flex flex-col">
        <p>{client.name}</p>
      </div>
      <div className="col-span-2 col-start-4 flex items-center justify-center text-xs text-stone-400">
        <p>{client.email}</p>
      </div>

      <div className="relative col-span-1 col-end-9 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <EllipsisVertical></EllipsisVertical>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36">
            <DropdownMenuGroup>
              <DropdownMenuLabel asChild>
                <EditClientDialog client={client} isDeleting={isDeleting} />
              </DropdownMenuLabel>

              <DropdownMenuLabel asChild>
                <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full border-stone-300 text-center text-sm text-red-600 hover:bg-stone-50 dark:border-stone-600 dark:hover:bg-stone-700"
                      disabled={isDeleting}
                    >
                      <Trash></Trash>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this client?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove the client from your address book.
                        Existing invoices will not be affected.
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
              </DropdownMenuLabel>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
