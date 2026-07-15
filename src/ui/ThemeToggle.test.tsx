import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

afterEach(() => {
  document.documentElement.classList.remove('dark');
  localStorage.clear();
});

describe('ThemeToggle', () => {
  it('offers dark mode when the page is light', () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: 'Switch to dark theme' }),
    ).toBeInTheDocument();
  });

  it('offers light mode when the page is already dark', () => {
    document.documentElement.classList.add('dark');
    render(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: 'Switch to light theme' }),
    ).toBeInTheDocument();
  });

  it('applies the dark class and persists the choice on click', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(
      screen.getByRole('button', { name: 'Switch to dark theme' }),
    );
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(
      screen.getByRole('button', { name: 'Switch to light theme' }),
    ).toBeInTheDocument();
  });

  it('switches back to light on a second click', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    await user.click(button);
    await user.click(button);
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
