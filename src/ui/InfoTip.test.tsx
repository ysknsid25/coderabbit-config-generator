import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { InfoTip } from './InfoTip';

describe('InfoTip', () => {
  it('hides its content until the button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <InfoTip label="About">
        <a href="https://example.com">Docs</a>
      </InfoTip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'About' }));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });

  it('toggles closed on a second click', async () => {
    const user = userEvent.setup();
    render(
      <InfoTip label="About">
        <span>tip</span>
      </InfoTip>,
    );
    const button = screen.getByRole('button', { name: 'About' });
    await user.click(button);
    await user.click(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
