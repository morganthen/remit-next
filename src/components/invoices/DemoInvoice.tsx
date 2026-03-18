export default function DemoInvoice() {
  return (
    <div
      id="invoice-card"
      className="mx-auto max-w-2xl rounded-xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900"
    >
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
            Acme Corp
          </h1>

          <p className="text-sm text-stone-500 dark:text-stone-400">
            acme@acme.com
          </p>

          <p className="text-sm text-stone-500 dark:text-stone-400">
            012-234-6789
          </p>

          <p className="text-sm whitespace-pre-line text-stone-500 dark:text-stone-400">
            1, Acme Street, Perth 6330, WA, Australia
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-stone-800 dark:text-stone-100">
            Invoice #002
          </p>
          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 capitalize dark:bg-green-900/40 dark:text-green-300">
            Paid
          </span>
        </div>
      </div>

      {/* Bill to */}
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold tracking-widest text-stone-400 uppercase dark:text-stone-500">
          Bill To
        </p>
        <p className="font-medium text-stone-800 dark:text-stone-100">
          Tony Stark
        </p>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          tony@avengers.com
        </p>
      </div>

      {/* Dates */}
      <div className="mb-8 flex gap-12">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-widest text-stone-400 uppercase dark:text-stone-500">
            Issue Date
          </p>
          <p className="text-sm text-stone-800 dark:text-stone-100">3/7/2026</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold tracking-widest text-stone-400 uppercase dark:text-stone-500">
            Due Date
          </p>
          <p className="text-sm text-stone-800 dark:text-stone-100">
            3/14/2026
          </p>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-8 rounded-lg bg-stone-50 px-6 py-4 dark:bg-stone-800">
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Amount Due
          </p>
          <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
            808.00
          </p>
        </div>
      </div>

      {/* Payment details */}

      <div className="border-t border-stone-100 pt-6 dark:border-stone-700">
        <p className="mb-3 text-xs font-semibold tracking-widest text-stone-400 uppercase dark:text-stone-500">
          Payment Details
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <>
            <p className="text-stone-500 dark:text-stone-400">Bank</p>
            <p className="text-stone-800 dark:text-stone-100">ING Australia</p>
          </>

          <>
            <p className="text-stone-500 dark:text-stone-400">Account Name</p>
            <p className="text-stone-800 dark:text-stone-100">Acme Corp</p>
          </>

          <>
            <p className="text-stone-500 dark:text-stone-400">Account Number</p>
            <p className="text-stone-800 dark:text-stone-100">888-888</p>
          </>

          <>
            <p className="text-stone-500 dark:text-stone-400">BSB</p>
            <p className="text-stone-800 dark:text-stone-100">888-888</p>
          </>
        </div>
      </div>
    </div>
  );
}
