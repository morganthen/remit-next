// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg- flex min-h-screen flex-col items-center justify-center bg-stone-950 p-24">
      <h1 className="mb-8 text-4xl font-bold">Remit 2.0</h1>
      <Link
        href="/dashboard"
        className="rounded-full px-6 py-3 text-white transition-colors hover:bg-gray-800"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
