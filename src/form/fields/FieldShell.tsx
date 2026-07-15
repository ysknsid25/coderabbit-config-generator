import type { ReactNode } from 'react';

interface FieldShellProps {
  title: string;
  description?: string;
  version?: string;
  error?: string | null;
  htmlFor?: string;
  children: ReactNode;
}

export function FieldShell({
  title,
  description,
  version,
  error,
  htmlFor,
  children,
}: FieldShellProps) {
  return (
    <div className="py-3">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-stone-800 dark:text-stone-200"
      >
        {title}
        {version && (
          <span className="ml-2 rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] text-stone-500 dark:bg-stone-800 dark:text-stone-400">
            {version}
          </span>
        )}
      </label>
      {description && (
        <p className="mt-0.5 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
          {description}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
