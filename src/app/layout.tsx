import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
