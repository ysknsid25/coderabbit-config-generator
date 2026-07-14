import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderField } from '../../test/renderField';

describe('BooleanField', () => {
  it('reflects the schema default', () => {
    renderField({ type: 'boolean', default: true }, 'enabled');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('defaults to off without a default', () => {
    renderField({ type: 'boolean' }, 'flag');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles on click', async () => {
    const user = userEvent.setup();
    renderField({ type: 'boolean', default: false }, 'flag');
    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('renders the title and description', () => {
    renderField(
      { type: 'boolean', description: 'Enable the thing.' },
      'high_level_summary',
    );
    expect(screen.getByText('High Level Summary')).toBeInTheDocument();
    expect(screen.getByText('Enable the thing.')).toBeInTheDocument();
  });
});
