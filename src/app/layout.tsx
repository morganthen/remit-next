import type { Metadata } from 'next';
import './_styles/globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Remit 2.0',
  description: 'Invoice made simple',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
