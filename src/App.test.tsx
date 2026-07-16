import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the header and top-level sections from the schema', () => {
    render(<App onImportClick={() => {}} />);
    expect(
      screen.getByText('CodeRabbit Config Generator'),
    ).toBeInTheDocument();
    for (const section of ['General', 'Reviews', 'Chat', 'Knowledge Base']) {
      expect(screen.getByText(section)).toBeInTheDocument();
    }
  });

  it('links to the repository and sponsor pages', () => {
    render(<App onImportClick={() => {}} />);
    expect(
      screen.getByRole('link', { name: 'GitHub repository' }),
    ).toHaveAttribute(
      'href',
      'https://github.com/ysknsid25/coderabbit-config-generator',
    );
    expect(
      screen.getByRole('link', { name: 'Sponsor on GitHub' }),
    ).toHaveAttribute('href', 'https://github.com/sponsors/ysknsid25');
  });

  it('shows a copyright notice', () => {
    render(<App onImportClick={() => {}} />);
    expect(screen.getByText(/©\s*2026/)).toBeInTheDocument();
  });

  it('calls onImportClick when the Import Configure button is clicked', async () => {
    const user = userEvent.setup();
    const onImportClick = vi.fn();
    render(<App onImportClick={onImportClick} />);
    await user.click(screen.getByRole('button', { name: 'Import Configure' }));
    expect(onImportClick).toHaveBeenCalledTimes(1);
  });
});
