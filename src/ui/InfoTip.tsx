import { useState, type ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
}

export function InfoTip({ label, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-stone-300 text-[10px] font-semibold text-stone-500 hover:border-brand-400 hover:text-brand-600"
      >
        i
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute top-full right-0 z-20 mt-2 w-64 rounded-md border border-stone-200 bg-white p-3 text-xs leading-relaxed font-normal text-stone-600 shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  );
}
