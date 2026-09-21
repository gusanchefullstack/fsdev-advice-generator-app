# Contract: UI Components

**Design authority**: the project's Figma file. Exact values are recorded in
[research.md](../research.md); they are referenced here, never re-declared.

---

## Page composition — `App`

```text
<body>                          background: blue-950
  <main>                        exactly one per page (FR-013)
    <h1>                        exactly one per page (FR-013) — visually hidden
    AdviceCard
    DiceButton
```

The visible `ADVICE #<id>` line is **not** the page heading — it changes with every slip and
names the slip, not the page. The single `<h1>` carries the page's actual name and is
visually hidden. This is what keeps FR-013 satisfiable while the card's own heading changes
freely.

## `AdviceCard`

```ts
interface AdviceCardProps {
  slip: AdviceSlip | null;
  message: string | null;   // friendly failure text, when present
}
```

Presentational only — it performs no retrieval and holds no state.

| Requirement | Obligation |
|-------------|------------|
| FR-001, FR-003 | Renders `ADVICE #<id>` and the quote, wrapped in typographic quotation marks as the design shows |
| FR-007 | When `message` is set, shows it in place of the quote; never renders a blank card |
| FR-008 | Renders only the friendly `message` string — never an error object, code or stack |
| FR-012 | Card background, radius, shadow, padding and the divider asset per research D3–D4 |
| FR-015 | The heading-and-quote region is a polite live region, so in-place changes are announced |

## `DiceButton`

```ts
interface DiceButtonProps {
  onClick: () => void;
  isBusy: boolean;
}
```

| Requirement | Obligation |
|-------------|------------|
| FR-002 | A real `<button type="button">`, never a `<div>` or a bare `<img>` |
| FR-005 | `disabled` while `isBusy`; carries `aria-busy` so the state is not colour-only |
| FR-010 | Green glow on `:hover` per research D6 |
| FR-014 | Keyboard focusable, activates on Enter and Space, same glow on `:focus-visible`, and an accessible name such as "Get new advice" — the `<img>` glyph is decorative with empty `alt` |
| FR-012 | 64px circle filled `green-300`, centred on the card's bottom edge, glyph at 24px |

## `useAdvice`

```ts
function useAdvice(): {
  state: AdviceState;
  requestAdvice: () => void;
};
```

| Requirement | Obligation |
|-------------|------------|
| FR-001 | Starts a retrieval on mount, with no user action |
| FR-003 | Replaces the displayed slip in place — no page reload |
| FR-005 | Keeps the previous slip on `loading`; exposes `status` so the button can disable |
| FR-007, FR-008 | Converts every rejection into the one friendly message; the underlying error never leaves the hook |
| FR-009 | Never retries on its own |
| Edge case | Ignores `requestAdvice()` while `status === 'loading'`, so requests cannot stack |

## Accessibility contract (SC-005)

- Exactly one `<main>` and exactly one `<h1>` on the page.
- The dice control is reachable and operable by keyboard, with a visible focus indicator.
- The dice control has a non-empty accessible name; its glyph is decorative.
- Advice changing in place is announced politely.
- Text and interactive elements meet WCAG AA contrast against their backgrounds.
- No link text is duplicated, and the page has a `lang` attribute.
