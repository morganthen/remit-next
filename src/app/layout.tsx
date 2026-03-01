import type { Metadata } from 'next';
import './_styles/globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/ui/ui/theme-provider';

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
