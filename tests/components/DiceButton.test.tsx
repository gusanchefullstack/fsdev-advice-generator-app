import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiceButton } from '../../src/components/DiceButton/DiceButton';

describe('DiceButton', () => {
  it('renders a real button element of type button', () => {
    render(<DiceButton onClick={() => {}} isBusy={false} />);
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('has a non-empty accessible name', () => {
    render(<DiceButton onClick={() => {}} isBusy={false} />);
    expect(screen.getByRole('button', { name: /advice/i })).toBeInTheDocument();
  });

  it('renders the dice glyph as decorative', () => {
    const { container } = render(<DiceButton onClick={() => {}} isBusy={false} />);
    const glyph = container.querySelector('img');
    expect(glyph).toHaveAttribute('alt', '');
  });

  it('calls onClick when activated with the pointer', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<DiceButton onClick={onClick} isBusy={false} />);

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is keyboard reachable and activates with Enter and Space', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<DiceButton onClick={onClick} isBusy={false} />);

    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('is disabled and marked busy while a request is in flight', () => {
    render(<DiceButton onClick={() => {}} isBusy />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('does not call onClick while busy', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<DiceButton onClick={onClick} isBusy />);

    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
