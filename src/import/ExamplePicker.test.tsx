import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ExampleCategory } from '../examples/types';
import { ExamplePicker } from './ExamplePicker';

const categories: ExampleCategory[] = [
  {
    key: 'fullstack',
    label: 'fullstack',
    files: [
      { key: 'a.yaml', label: 'a.yaml', content: 'language: en-US' },
      { key: 'b.yaml', label: 'b.yaml', content: 'language: ja-JP' },
    ],
  },
  {
    key: 'python',
    label: 'python',
    files: [
      { key: 'c.yaml', label: 'c.yaml', content: 'language: fr-FR' },
    ],
  },
];

describe('ExamplePicker', () => {
  it('disables the file select until a category is chosen', () => {
    render(<ExamplePicker categories={categories} onSelect={() => {}} />);
    expect(screen.getByLabelText('Example file')).toBeDisabled();
  });

  it('selects the first file of a category and reports its content', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ExamplePicker categories={categories} onSelect={onSelect} />);

    await user.selectOptions(screen.getByLabelText('Example category'), 'fullstack');

    expect(screen.getByLabelText('Example file')).toHaveValue('a.yaml');
    expect(onSelect).toHaveBeenCalledWith('language: en-US');
  });

  it('reports the content of the file the user picks', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ExamplePicker categories={categories} onSelect={onSelect} />);

    await user.selectOptions(screen.getByLabelText('Example category'), 'fullstack');
    await user.selectOptions(screen.getByLabelText('Example file'), 'b.yaml');

    expect(onSelect).toHaveBeenLastCalledWith('language: ja-JP');
  });

  it('replaces the file options when switching categories', async () => {
    const user = userEvent.setup();
    render(<ExamplePicker categories={categories} onSelect={() => {}} />);

    await user.selectOptions(screen.getByLabelText('Example category'), 'python');

    expect(screen.getByRole('option', { name: 'c.yaml' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'a.yaml' })).not.toBeInTheDocument();
  });
});
