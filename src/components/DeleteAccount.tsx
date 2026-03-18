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
    if (!userId) return console.error('No user id');
    setLoading(true);
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
