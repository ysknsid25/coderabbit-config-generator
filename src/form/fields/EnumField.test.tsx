import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderField } from '../../test/renderField';

describe('EnumField (radio)', () => {
  const node = {
    enum: ['quiet', 'chill', 'assertive'],
    default: 'chill',
  };

  it('marks the default option as pressed', () => {
    renderField(node, 'profile');
    expect(screen.getByRole('button', { name: 'chill' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'quiet' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('changes selection on click', async () => {
    const user = userEvent.setup();
    renderField(node, 'profile');
    await user.click(screen.getByRole('button', { name: 'assertive' }));
    expect(screen.getByRole('button', { name: 'assertive' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'chill' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});

describe('EnumField (select)', () => {
  // Regression guard: a datalist filtered options by the input value, so a
  // large enum must render every option in a real <select>.
  it('renders every option with its enumNames label', () => {
    const enumVals = Array.from({ length: 30 }, (_, i) => `l${i}`);
    const enumNames = Array.from({ length: 30 }, (_, i) => `Lang ${i}`);
    renderField(
      { enum: enumVals, enumNames, default: 'l0' },
      'language',
    );
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    // 30 options plus the empty placeholder.
    expect(select.options).toHaveLength(31);
    expect(screen.getByRole('option', { name: 'Lang 5' })).toBeInTheDocument();
    expect(select.value).toBe('l0');
  });

  it('updates the value on selection', async () => {
    const user = userEvent.setup();
    renderField(
      { enum: ['a', 'b', 'c', 'd', 'e'], default: 'a' },
      'kind',
    );
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    await user.selectOptions(select, 'd');
    expect(select.value).toBe('d');
  });
});
