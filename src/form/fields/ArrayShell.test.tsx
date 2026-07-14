import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { FieldMeta } from '../../schema';
import { ArrayShell } from './ArrayShell';

const meta: FieldMeta = {
  key: 'labels',
  path: ['labels'],
  title: 'Labels',
  description: 'Repeatable labels.',
  kind: 'string-array',
  maxItems: 2,
};

describe('ArrayShell', () => {
  it('renders title, description and the count against the limit', () => {
    render(
      <ArrayShell meta={meta} count={1} onAdd={() => {}}>
        <div>row</div>
      </ArrayShell>,
    );
    expect(screen.getByText('Labels')).toBeInTheDocument();
    expect(screen.getByText('Repeatable labels.')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('calls onAdd when the add button is clicked', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(
      <ArrayShell meta={meta} count={0} onAdd={onAdd}>
        <div />
      </ArrayShell>,
    );
    await user.click(screen.getByRole('button', { name: /Add/ }));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it('disables adding at the item limit', () => {
    render(
      <ArrayShell meta={meta} count={2} onAdd={() => {}}>
        <div />
      </ArrayShell>,
    );
    expect(screen.getByRole('button', { name: /Add/ })).toBeDisabled();
  });

  it('omits the limit in the count when maxItems is unset', () => {
    const unlimited: FieldMeta = { ...meta, maxItems: undefined };
    render(
      <ArrayShell meta={unlimited} count={3} onAdd={() => {}}>
        <div />
      </ArrayShell>,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
  });
});
