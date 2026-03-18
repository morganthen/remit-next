'use client';

import DemoInvoice from '@/components/invoices/DemoInvoice';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/remit-logo.png"
              width={56}
              height={56}
              alt="Remit logo"
              className="object-contain"
            />
            <div className="mr-8">
              <h3 className="text-sm font-semibold">Remit</h3>
              <p className="text-xs text-stone-500">Simple invoicing</p>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="w-full min-w-24 text-center text-xs text-stone-600 hover:text-stone-800 sm:text-sm"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="w-full min-w-24 rounded-full bg-stone-800 px-4 py-2 text-center text-xs text-white hover:bg-stone-900 sm:text-sm"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto flex flex-1 items-center px-6 py-20">
        <div className="mx-auto w-full max-w-6xl md:flex md:items-center md:justify-between md:gap-12">
          <div className="relative z-10 mt-8 md:mt-0 md:w-1/2">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="text-3xl leading-tight font-extrabold md:text-4xl"
            >
              Invoicing made simple for freelancers & small businesses
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="mt-6 text-lg text-stone-600"
            >
              Replace bloated, expensive tools with a focused invoicing app
              built for people starting out — fast setup, minimal, and
              everything you need to get paid.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-stone-800 px-6 py-3 text-base font-medium text-white shadow hover:bg-stone-900"
              >
                Get started
              </Link>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-3 md:gap-6"
            >
              <li className="flex flex-col items-center gap-2 md:items-start">
                <span className="text-2xl">⚡</span>
                <strong>Fast setup</strong>
                <span className="text-center text-xs text-stone-500 md:text-start">
                  Create and send your first invoice in minutes.
                </span>
              </li>
              <li className="flex flex-col items-center gap-2 md:items-start">
                <span className="text-2xl">🧘</span>
                <strong>No bloated features</strong>
                <span className="text-center text-xs text-stone-500 md:text-start">
                  Everything you need, and nothing you don&apos;t.
                </span>
              </li>
              <li className="flex flex-col items-center gap-2 md:items-start">
                <span className="text-2xl">🔒</span>
                <strong>Built for you</strong>
                <span className="text-center text-xs text-stone-500 md:text-start">
                  Designed with freelancers and micro-businesses in mind.
                </span>
              </li>
            </motion.ul>
          </div>

          {/* Desktop/demo column only */}
          <div className="hidden md:flex md:w-1/2 md:justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="demo-card w-105 max-w-full md:scale-95"
            >
              <DemoInvoice />
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t bg-stone-50 px-6 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-stone-500">
            © {new Date().getFullYear()} Remit — Simple invoicing for small
            businesses
          </p>
        </div>
      </footer>
    </main>
  );
}
