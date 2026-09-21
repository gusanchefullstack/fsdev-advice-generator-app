import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AdviceCard } from '../../src/components/AdviceCard/AdviceCard';

const slip = { id: 117, advice: 'It is easy to sit up and take notice.' };

/*
 * jsdom performs no layout and evaluates no media queries, so these assertions
 * cover only what is verifiable here: that both divider assets are wired up and
 * that the breakpoint is expressed declaratively. Real responsive behaviour is
 * verified in a browser at 320/375/768/1440 (tasks T036, quickstart checks 9-13).
 */
describe('AdviceCard responsive wiring', () => {
  it('offers the desktop divider above the 768px breakpoint', () => {
    const { container } = render(<AdviceCard slip={slip} message={null} />);
    const source = container.querySelector('source');

    expect(source).toHaveAttribute('media', '(min-width: 768px)');
    expect(source).toHaveAttribute('srcSet', '/pattern-divider-desktop.svg');
  });

  it('falls back to the mobile divider below the breakpoint', () => {
    const { container } = render(<AdviceCard slip={slip} message={null} />);
    const img = container.querySelector('img');

    expect(img).toHaveAttribute('src', '/pattern-divider-mobile.svg');
    expect(img).toHaveAttribute('alt', '');
  });
});
