import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the header and top-level sections from the schema', () => {
    render(<App />);
    expect(
      screen.getByText('CodeRabbit Config Generator'),
    ).toBeInTheDocument();
    for (const section of ['General', 'Reviews', 'Chat', 'Knowledge Base']) {
      expect(screen.getByText(section)).toBeInTheDocument();
    }
  });
});
