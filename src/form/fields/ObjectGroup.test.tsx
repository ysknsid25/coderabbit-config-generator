import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderField } from '../../test/renderField';

describe('ObjectGroup', () => {
  const node = {
    type: 'object',
    description: 'Settings for auto review.',
    properties: {
      enabled: { type: 'boolean', default: true },
      nested: {
        type: 'object',
        properties: {
          drafts: { type: 'boolean', default: false },
        },
      },
    },
  };

  it('renders its description and every child', () => {
    renderField(node, 'auto_review');
    expect(screen.getByText('Settings for auto review.')).toBeInTheDocument();
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByText('Nested')).toBeInTheDocument();
    expect(screen.getByText('Drafts')).toBeInTheDocument();
  });

  it('nests a child group in its own accordion', () => {
    const { container } = renderField(node, 'auto_review');
    // Outer group plus the nested group each render a <details>.
    expect(container.querySelectorAll('details')).toHaveLength(2);
  });
});
