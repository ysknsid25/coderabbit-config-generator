import { useState } from 'react';
import { App } from './App';
import { ImportPage } from './import/ImportPage';

export function Root() {
  const [view, setView] = useState<'form' | 'import'>('form');
  const [initialInput, setInitialInput] = useState<Record<string, unknown>>();
  const [formKey, setFormKey] = useState(0);

  if (view === 'import') {
    return (
      <ImportPage
        onCancel={() => setView('form')}
        onImport={(value) => {
          setInitialInput(value);
          setFormKey(k => k + 1);
          setView('form');
        }}
      />
    );
  }

  return (
    <App
      key={formKey}
      initialInput={initialInput}
      onImportClick={() => setView('import')}
    />
  );
}
