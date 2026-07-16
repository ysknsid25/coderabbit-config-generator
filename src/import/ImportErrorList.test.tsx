import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ImportErrorList } from './ImportErrorList';

describe('ImportErrorList', () => {
  it('renders nothing when there are no errors', () => {
    const { container } = render(<ImportErrorList errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders one item per error, in order', () => {
    render(<ImportErrorList errors={['first problem', 'second problem']} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('first problem');
    expect(items[1]).toHaveTextContent('second problem');
  });
});
