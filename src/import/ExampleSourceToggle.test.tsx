import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ExampleSourceToggle } from './ExampleSourceToggle';

describe('ExampleSourceToggle', () => {
  it('marks the current mode as pressed', () => {
    render(<ExampleSourceToggle mode="paste" onChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Paste YAML' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Use an official example' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the clicked mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ExampleSourceToggle mode="paste" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Use an official example' }));

    expect(onChange).toHaveBeenCalledWith('example');
  });

  it('shows an explanation with a link to the awesome-coderabbit repo when the info tip is opened', async () => {
    const user = userEvent.setup();
    render(<ExampleSourceToggle mode="paste" onChange={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'What\'s an official example?' }));

    expect(screen.getByRole('link', { name: 'awesome-coderabbit' })).toHaveAttribute(
      'href',
      'https://github.com/coderabbitai/awesome-coderabbit/tree/main/configs',
    );
  });
});
