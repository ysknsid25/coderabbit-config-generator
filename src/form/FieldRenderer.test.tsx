import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderField } from '../test/renderField';

describe('FieldRenderer group', () => {
  const node = {
    type: 'object',
    properties: {
      early_access: { type: 'boolean', default: false },
    },
  };

  it('renders a group as a collapsible accordion', () => {
    const { container } = renderField(node, 'reviews');
    expect(container.querySelector('details')).toBeInTheDocument();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText('Early Access')).toBeInTheDocument();
  });

  it('expands and collapses when the summary is toggled', async () => {
    const user = userEvent.setup();
    const { container } = renderField(node, 'reviews');
    const details = container.querySelector('details')!;
    expect(details.open).toBe(false);
    await user.click(screen.getByText('Reviews'));
    expect(details.open).toBe(true);
    await user.click(screen.getByText('Reviews'));
    expect(details.open).toBe(false);
  });
});
