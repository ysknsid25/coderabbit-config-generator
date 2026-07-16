import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ImportPage } from './ImportPage';

describe('ImportPage', () => {
  it('calls onImport with the parsed value for valid YAML', async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<ImportPage onImport={onImport} onCancel={() => {}} />);

    await user.type(screen.getByPlaceholderText('Paste your .coderabbit.yaml here'), 'language: ja-JP');
    await user.click(screen.getByRole('button', { name: 'Import' }));

    expect(onImport).toHaveBeenCalledTimes(1);
    expect(onImport.mock.calls[0][0].language).toBe('ja-JP');
  });

  it('shows errors and does not call onImport for invalid YAML', async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<ImportPage onImport={onImport} onCancel={() => {}} />);

    await user.type(screen.getByPlaceholderText('Paste your .coderabbit.yaml here'), 'nonexistent_field: true');
    await user.click(screen.getByRole('button', { name: 'Import' }));

    expect(onImport).not.toHaveBeenCalled();
    expect(screen.getByRole('listitem')).toHaveTextContent('nonexistent_field');
  });

  it('calls onCancel without calling onImport', async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    const onCancel = vi.fn();
    render(<ImportPage onImport={onImport} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onImport).not.toHaveBeenCalled();
  });

  it('clears previous errors after a subsequent successful import', async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<ImportPage onImport={onImport} onCancel={() => {}} />);

    const textarea = screen.getByPlaceholderText('Paste your .coderabbit.yaml here');
    await user.type(textarea, 'nonexistent_field: true');
    await user.click(screen.getByRole('button', { name: 'Import' }));
    expect(screen.getByRole('listitem')).toHaveTextContent('nonexistent_field');

    await user.clear(textarea);
    await user.type(textarea, 'language: ja-JP');
    await user.click(screen.getByRole('button', { name: 'Import' }));

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(onImport).toHaveBeenCalledTimes(1);
  });
});
