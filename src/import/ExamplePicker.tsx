import { useState } from 'react';
import type { ExampleCategory } from '../examples/types';
import { inputClass } from '../form/fields/styles';

interface Props {
  categories: ExampleCategory[];
  onSelect: (content: string) => void;
}

export function ExamplePicker({ categories, onSelect }: Props) {
  const [categoryKey, setCategoryKey] = useState('');
  const [fileKey, setFileKey] = useState('');
  const category = categories.find(c => c.key === categoryKey);

  const handleCategoryChange = (nextCategoryKey: string) => {
    setCategoryKey(nextCategoryKey);
    const nextCategory = categories.find(c => c.key === nextCategoryKey);
    const nextFile = nextCategory?.files[0];
    setFileKey(nextFile?.key ?? '');
    if (nextFile) onSelect(nextFile.content);
  };

  const handleFileChange = (nextFileKey: string) => {
    setFileKey(nextFileKey);
    const file = category?.files.find(f => f.key === nextFileKey);
    if (file) onSelect(file.content);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <select
        aria-label="Example category"
        className={inputClass}
        value={categoryKey}
        onChange={e => handleCategoryChange(e.target.value)}
      >
        <option value="">Select a category…</option>
        {categories.map(c => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Example file"
        className={inputClass}
        value={fileKey}
        onChange={e => handleFileChange(e.target.value)}
        disabled={!category}
      >
        <option value="">Select a file…</option>
        {category?.files.map(f => (
          <option key={f.key} value={f.key}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
