import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderField } from '../../test/renderField';

const node = {
  type: 'array',
  items: { type: 'string' },
  default: [],
};

describe('StringArrayField', () => {
  it('starts empty and adds a row on demand', async () => {
    const user = userEvent.setup();
    renderField(node, 'base_branches');
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /Add/ }));
    expect(screen.getAllByRole('textbox')).toHaveLength(1);
  });

  it('edits and removes rows', async () => {
    const user = userEvent.setup();
    renderField(node, 'base_branches');
    await user.click(screen.getByRole('button', { name: /Add/ }));
    const input = screen.getByRole('textbox');
    await user.type(input, 'main');
    expect(input).toHaveValue('main');
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
  });
});
