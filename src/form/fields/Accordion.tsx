import { useState, type ReactNode } from 'react';

interface AccordionProps {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  depth?: number;
  children: ReactNode;
}

export function Accordion({
  title,
  description,
  defaultOpen = false,
  depth = 0,
  children,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      open={open}
      className="overflow-hidden rounded-lg border border-stone-200 bg-white"
    >
      <summary
        // Drive open state explicitly so behaviour is deterministic across
        // browsers and jsdom, which does not toggle <details> natively.
        onClick={(e) => {
          e.preventDefault();
          setOpen(o => !o);
        }}
        className={`flex cursor-pointer list-none items-center gap-2 px-4 py-3 select-none hover:bg-stone-50 ${
          depth === 0 ? 'font-semibold text-stone-900' : 'font-medium text-stone-700'
        }`}
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${
            open ? 'rotate-90' : ''
          }`}
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.25 4.25a.75.75 0 0 1 0 1.08l-4.25 4.25a.75.75 0 0 1-1.06-.02Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm">{title}</span>
      </summary>
      <div className="border-t border-stone-100 px-4 py-2">
        {description && (
          <p className="py-2 text-xs leading-relaxed text-stone-500">
            {description}
          </p>
        )}
        {children}
      </div>
    </details>
  );
}
