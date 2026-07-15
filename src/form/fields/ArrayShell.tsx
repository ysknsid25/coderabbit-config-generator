import type { ReactNode } from 'react';
import type { FieldMeta } from '../../schema';
import { addButtonClass } from './styles';

interface ArrayShellProps {
  meta: FieldMeta;
  count: number;
  onAdd: () => void;
  children: ReactNode;
}

export function ArrayShell({ meta, count, onAdd, children }: ArrayShellProps) {
  const atLimit = meta.maxItems !== undefined && count >= meta.maxItems;
  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{meta.title}</p>
          {meta.description && (
            <p className="mt-0.5 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              {meta.description}
            </p>
          )}
        </div>
        <span className="text-xs text-stone-400 dark:text-stone-500">
          {count}
          {meta.maxItems !== undefined && ` / ${meta.maxItems}`}
        </span>
      </div>
      <div className="mt-2 space-y-2">{children}</div>
      <button
        type="button"
        onClick={onAdd}
        disabled={atLimit}
        className={`${addButtonClass} mt-2`}
      >
        + Add
      </button>
    </div>
  );
}
