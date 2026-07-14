import { useState } from 'react';
import type { FieldMeta } from '../../schema';
import { AnyField, type AnyForm, type PathSegments } from '../formisch';
import { ArrayShell } from './ArrayShell';
import { inputClass, removeButtonClass } from './styles';

interface Props {
  form: AnyForm;
  meta: FieldMeta;
  path: PathSegments;
}

interface Row {
  key: string;
  values: string;
}

function toRows(input: unknown): Row[] {
  if (!input || typeof input !== 'object') return [];
  return Object.entries(input as Record<string, unknown>).map(([key, v]) => ({
    key,
    values: Array.isArray(v) ? v.join(', ') : '',
  }));
}

function toRecord(rows: Row[]): Record<string, string[]> | undefined {
  const record: Record<string, string[]> = {};
  for (const row of rows) {
    const key = row.key.trim();
    if (!key) continue;
    record[key] = row.values
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
  return Object.keys(record).length > 0 ? record : undefined;
}

interface EditorProps {
  meta: FieldMeta;
  initial: unknown;
  onChange: (value: unknown) => void;
}

// Local rows avoid focus loss that would come from live key renames
// rewriting the underlying record on every keystroke.
function KeyValueEditor({ meta, initial, onChange }: EditorProps) {
  const [rows, setRows] = useState<Row[]>(() => toRows(initial));

  const commit = (next: Row[]) => {
    setRows(next);
    onChange(toRecord(next));
  };

  return (
    <ArrayShell
      meta={meta}
      count={rows.length}
      onAdd={() => commit([...rows, { key: '', values: '' }])}
    >
      {rows.map((row, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            className={`${inputClass} max-w-40`}
            placeholder="group"
            value={row.key}
            onChange={e =>
              commit(
                rows.map((r, i) =>
                  i === index ? { ...r, key: e.target.value } : r,
                ),
              )}
          />
          <input
            className={inputClass}
            placeholder="value1, value2"
            value={row.values}
            onChange={e =>
              commit(
                rows.map((r, i) =>
                  i === index ? { ...r, values: e.target.value } : r,
                ),
              )}
          />
          <button
            type="button"
            aria-label="Remove"
            className={removeButtonClass}
            onClick={() => commit(rows.filter((_, i) => i !== index))}
          >
            ×
          </button>
        </div>
      ))}
    </ArrayShell>
  );
}

export function KeyValueField({ form, meta, path }: Props) {
  return (
    <AnyField of={form} path={path}>
      {field => (
        <KeyValueEditor
          meta={meta}
          initial={field.input}
          onChange={field.onChange}
        />
      )}
    </AnyField>
  );
}
