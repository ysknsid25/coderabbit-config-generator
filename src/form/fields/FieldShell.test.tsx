import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FieldShell } from './FieldShell';

describe('FieldShell', () => {
  it('renders title, description, version and error', () => {
    render(
      <FieldShell
        title="Ruff"
        description="A Python linter."
        version="v0.15.21"
        error="Something is wrong"
        htmlFor="ruff-input"
      >
        <input id="ruff-input" />
      </FieldShell>,
    );
    expect(screen.getByText('Ruff')).toBeInTheDocument();
    expect(screen.getByText('A Python linter.')).toBeInTheDocument();
    expect(screen.getByText('v0.15.21')).toBeInTheDocument();
    expect(screen.getByText('Something is wrong')).toBeInTheDocument();
  });

  it('associates the label with the control via htmlFor', () => {
    render(
      <FieldShell title="Name" htmlFor="name-input">
        <input id="name-input" />
      </FieldShell>,
    );
    expect(screen.getByText('Name')).toHaveAttribute('for', 'name-input');
  });

  it('omits optional slots when not provided', () => {
    render(
      <FieldShell title="Bare">
        <input />
      </FieldShell>,
    );
    expect(screen.queryByText('v0.15.21')).not.toBeInTheDocument();
    expect(screen.getByText('Bare')).toBeInTheDocument();
  });
});
