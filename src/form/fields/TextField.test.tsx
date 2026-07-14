import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderField } from '../../test/renderField';

describe('TextField', () => {
  it('reflects the default value', () => {
    renderField(
      { type: 'string', default: '@coderabbitai' },
      'auto_title_placeholder',
    );
    expect(screen.getByRole('textbox')).toHaveValue('@coderabbitai');
  });

  it('accepts typed input', async () => {
    const user = userEvent.setup();
    renderField({ type: 'string', default: '' }, 'name');
    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');
    expect(input).toHaveValue('hello');
  });

  it('renders a textarea with a character counter for long fields', async () => {
    const user = userEvent.setup();
    renderField(
      { type: 'string', default: '', maxLength: 250 },
      'tone_instructions',
    );
    const area = screen.getByRole('textbox');
    expect(area.tagName).toBe('TEXTAREA');
    await user.type(area, 'abc');
    expect(screen.getByText('3/250')).toBeInTheDocument();
  });
});
