import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('is collapsed by default', () => {
    const { container } = render(
      <Accordion title="Reviews">
        <p>body</p>
      </Accordion>,
    );
    expect(container.querySelector('details')!.open).toBe(false);
  });

  it('respects defaultOpen', () => {
    const { container } = render(
      <Accordion title="Reviews" defaultOpen>
        <p>body</p>
      </Accordion>,
    );
    expect(container.querySelector('details')!.open).toBe(true);
  });

  it('toggles when the summary is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Accordion title="Reviews">
        <p>body</p>
      </Accordion>,
    );
    const details = container.querySelector('details')!;
    await user.click(screen.getByText('Reviews'));
    expect(details.open).toBe(true);
    await user.click(screen.getByText('Reviews'));
    expect(details.open).toBe(false);
  });

  it('renders an optional description', () => {
    render(
      <Accordion title="Reviews" description="Review settings.">
        <p>body</p>
      </Accordion>,
    );
    expect(screen.getByText('Review settings.')).toBeInTheDocument();
  });
});
