'use client';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useState } from 'react';

export default function DeleteAccountDialog({
  userId,
}: {
  userId: string | undefined;
}) {
  const [loading, setLoading] = useState(false);
  async function handleDelete() {
    // returning console.error seems strange, console.error returns void
    if (!userId) {
      console.error('No user id');
      return;
    }
    setLoading(true);
    // This function probably works, but it doesn't seem like idiomatic React
    // (manually setting window.location within a function that is also doing a fetch)
    // My React is a little rusty, Try asking AI how it might refactor this to be more idiomatic
    try {
      const form = new FormData();
      form.append('id', userId);
      const res = await fetch('/api/delete-user', {
        method: 'POST',
        credentials: 'same-origin',
        body: form,
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || 'Delete failed');
      // success: show toast then redirect/sign out
      window.location.href = '/signup';
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all invoices. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <Button
              variant="destructive"
              type="submit"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete account
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
