import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { Button } from '../ui/button';

export default function ActionButton({ onDelete }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    console.log('handleConfirmDelete called');
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  }

  return (
    <div className="absolute top-full right-0 z-10 mt-1 w-36 rounded-md border border-stone-200 bg-white py-1 shadow-md">
      <button className="w-full px-4 py-2 text-left text-sm hover:bg-stone-50">
        View
      </button>
      <button className="w-full px-4 py-2 text-left text-sm hover:bg-stone-50">
        Edit
      </button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          onClick={() => console.log('Delete button pressed')}
          asChild
        >
          <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-stone-50">
            Delete
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              invoice and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
            >
              {isDeleting ? 'Deleting...' : 'Continue'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
