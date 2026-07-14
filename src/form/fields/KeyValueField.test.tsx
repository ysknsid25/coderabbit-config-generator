import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderField } from '../../test/renderField';

const node = {
  type: 'object',
  default: {},
  propertyNames: { type: 'string', minLength: 1 },
  additionalProperties: { type: 'array', items: { type: 'string' } },
};

describe('KeyValueField', () => {
  it('adds a key/value row and captures input', async () => {
    const user = userEvent.setup();
    renderField(node, 'mutually_exclusive_groups');
    await user.click(screen.getByRole('button', { name: /Add/ }));
    const [key, values] = screen.getAllByRole('textbox');
    await user.type(key, 'risk');
    await user.type(values, 'high, low');
    expect(key).toHaveValue('risk');
    expect(values).toHaveValue('high, low');
  });
});
