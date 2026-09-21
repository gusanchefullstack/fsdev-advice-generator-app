import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdviceCard } from '../../src/components/AdviceCard/AdviceCard';

const slip = { id: 117, advice: 'It is easy to sit up and take notice.' };

describe('AdviceCard', () => {
  it('renders the slip number in the ADVICE #nnn form', () => {
    render(<AdviceCard slip={slip} message={null} />);
    expect(screen.getByText(/ADVICE #117/i)).toBeInTheDocument();
  });

  it('renders the advice text', () => {
    render(<AdviceCard slip={slip} message={null} />);
    expect(screen.getByText(/It is easy to sit up and take notice\./)).toBeInTheDocument();
  });

  it('renders the friendly message instead of a quote when one is set', () => {
    render(<AdviceCard slip={null} message="Couldn't fetch advice right now." />);
    expect(screen.getByText(/Couldn't fetch advice right now\./)).toBeInTheDocument();
  });

  it('keeps the previous advice visible when a message is set alongside a slip', () => {
    render(<AdviceCard slip={slip} message="Couldn't fetch advice right now." />);
    expect(screen.getByText(/ADVICE #117/i)).toBeInTheDocument();
    expect(screen.getByText(/Couldn't fetch advice right now\./)).toBeInTheDocument();
  });

  it('never renders an empty card before the first slip arrives', () => {
    const { container } = render(<AdviceCard slip={null} message={null} />);
    expect(container.textContent?.trim()).not.toBe('');
  });

  it('marks the advice region as a polite live region', () => {
    render(<AdviceCard slip={slip} message={null} />);
    const live = screen.getByRole('status');
    expect(live).toHaveAttribute('aria-live', 'polite');
  });

  it('renders the divider image as decorative', () => {
    const { container } = render(<AdviceCard slip={slip} message={null} />);
    const divider = container.querySelector('img');
    expect(divider).toHaveAttribute('alt', '');
  });
});
