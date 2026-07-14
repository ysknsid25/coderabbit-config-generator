import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderField } from '../../test/renderField';

describe('NumberField', () => {
  const node = {
    type: 'integer',
    default: 5,
    minimum: 0,
    maximum: 30,
  };

  it('reflects the default and constraint attributes', () => {
    renderField(node, 'auto_pause_after_reviewed_commits');
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(5);
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '30');
    expect(input).toHaveAttribute('step', '1');
  });

  it('uses a fractional step for non-integer numbers', () => {
    renderField({ type: 'number', default: 80 }, 'threshold');
    expect(screen.getByRole('spinbutton')).toHaveAttribute('step', 'any');
  });

  it('updates on input', async () => {
    const user = userEvent.setup();
    renderField(node, 'count');
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '12');
    expect(input).toHaveValue(12);
  });
});
