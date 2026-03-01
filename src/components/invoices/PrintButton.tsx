'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-md border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 shadow-sm hover:bg-stone-50"
    >
      Save as PDF
    </button>
  );
}
