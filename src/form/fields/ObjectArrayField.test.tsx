import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderField } from '../../test/renderField';

const node = {
  type: 'array',
  maxItems: 2,
  default: [],
  items: {
    type: 'object',
    properties: {
      path: { type: 'string', default: '' },
      instructions: { type: 'string', default: '', maxLength: 20000 },
    },
  },
};

describe('ObjectArrayField', () => {
  it('adds an item that renders its child fields', async () => {
    const user = userEvent.setup();
    renderField(node, 'path_instructions');
    expect(screen.queryByText('Path')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Add/ }));
    expect(screen.getByText('Path')).toBeInTheDocument();
    expect(screen.getByText('Instructions')).toBeInTheDocument();
  });

  it('disables adding beyond maxItems', async () => {
    const user = userEvent.setup();
    renderField(node, 'path_instructions');
    const add = screen.getByRole('button', { name: /Add/ });
    await user.click(add);
    await user.click(add);
    expect(add).toBeDisabled();
  });
});
