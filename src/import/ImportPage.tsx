import { useState } from 'react';
import { ImportErrorList } from './ImportErrorList';
import { parseImportedConfig } from './parseImportedConfig';

interface Props {
  onImport: (value: Record<string, unknown>) => void;
  onCancel: () => void;
}

export function ImportPage({ onImport, onCancel }: Props) {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleImport = () => {
    const result = parseImportedConfig(text);
    if (result.success) {
      setErrors([]);
      onImport(result.value);
      return;
    }
    setErrors(result.errors);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 dark:bg-stone-950 dark:text-stone-200">
      <div className="mx-auto max-w-3xl space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Import Configuration
          </h1>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
          >
            Cancel
          </button>
        </div>

        <ImportErrorList errors={errors} />

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={20}
          placeholder="Paste your .coderabbit.yaml here"
          className="w-full rounded-md border border-stone-300 bg-white p-3 font-mono text-xs text-stone-800 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        />

        <button
          type="button"
          onClick={handleImport}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Import
        </button>
      </div>
    </div>
  );
}
