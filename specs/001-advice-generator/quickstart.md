# Quickstart: Advice Generator

**Date**: 2026-09-21 | **Plan**: [plan.md](./plan.md)

How to run the application and prove it satisfies the specification. This is a validation
guide, not an implementation guide — component internals belong to `tasks.md` and the
implementation phase.

---

## Prerequisites

- Node.js 20 LTS or newer, with npm
- An internet connection — the advice service is a third-party dependency
- The frontend GitHub repository `fsdev-advice-generator-app` exists and is wired as
  `origin`. It is currently **private** and must be made public before the Frontend Mentor
  submission step.

## Commands

Once the toolchain is scaffolded, these are the entry points. Replace the Commands section
of `CLAUDE.md` with them at that point, as it instructs.

```bash
npm install
npm run dev        # Vite dev server
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm test           # Vitest, watch mode
npm test -- --run  # Vitest, single pass
```

Run one test file, or one case:

```bash
npm test -- --run tests/services/adviceService.test.ts
npm test -- --run -t "rejects when the body carries a message instead of a slip"
```

## Validating against the specification

Each check below names the requirement it proves. All should be performed before the
project is considered done.

### Core behaviour

| # | Check | Proves |
|---|-------|--------|
| 1 | Load the page and take no action — advice and its number appear | FR-001, US1 |
| 2 | Activate the dice — the advice and number change, with no page reload | FR-002, FR-003 |
| 3 | Activate the dice 10 times in a row — 10 distinct retrievals, no repeats from cache | FR-004, SC-002 |
| 4 | Watch the control during a request — it is disabled and the old advice stays on screen | FR-005 |

### Cache-busting

The failure this guards against is invisible in `curl`, which has no HTTP cache. Verify it
in a real browser:

1. Open DevTools → Network, disable "Disable cache" so the browser behaves normally.
2. Click the dice repeatedly.
3. Every request must appear as a real network call, not `(from disk cache)`, and the advice
   must change. Same advice twice in a row is a failure of FR-004.

### Failure handling

| # | Check | Proves |
|---|-------|--------|
| 5 | Go offline (DevTools → Network → Offline), click the dice — a friendly message appears, the card is not blank, the button is usable again | FR-007, FR-008 |
| 6 | In DevTools, block `api.adviceslip.com` and reload — the page shows a friendly message rather than an empty card | FR-006, FR-007 |
| 7 | Nothing in either case shows an error object, status code or stack trace | FR-008, SC-003 |
| 8 | After a failure, clicking the dice retries; nothing retries on its own | FR-009 |

### Responsive layout

Check at **375px**, **768px** and **1440px**, as `specs.md` requires, plus **320px** for the
lower bound in SC-004:

| # | Check | Proves |
|---|-------|--------|
| 9 | No horizontal scrolling at any width from 320px upward | FR-011, SC-004 |
| 10 | Quote renders at 24px below 768px and 28px at and above it | Research D2 |
| 11 | Card is 343px wide with a 10px radius on mobile; 540px with a 15px radius from 768px | Research D3 |
| 12 | The divider asset swaps between the mobile and desktop SVGs at 768px | Research D4 |
| 13 | Unusually long advice wraps inside the card rather than overflowing | US3 scenario 3 |

### Accessibility

| # | Check | Proves |
|---|-------|--------|
| 14 | Exactly one `<main>` and exactly one `<h1>` in the document | FR-013 |
| 15 | Tab to the dice control — it takes visible focus and activates with Enter and Space | FR-014 |
| 16 | The control has an accessible name; the dice glyph is decorative | FR-014 |
| 17 | With a screen reader, new advice is announced when it replaces the old | FR-015 |
| 18 | An automated audit (Lighthouse or axe) reports no violations | SC-005 |

### Visual fidelity

| # | Check | Proves |
|---|-------|--------|
| 19 | Compare against the Figma frames at 375px and 1440px — spacing, colour and typography match | FR-012, SC-007 |
| 20 | Hover the dice — the green glow appears, per research D6 | FR-010 |

## Known pre-implementation conditions

1. ~~No GitHub remote.~~ **Resolved** — `fsdev-advice-generator-app` created and wired as
   `origin` on 2026-09-21. Still private; make it public before submitting to Frontend
   Mentor, which needs a publicly reachable repository URL.
2. ~~`specs.md` records one quote size.~~ **Resolved** — `my-sdd-docs/specs.md` now records
   24px below 768px and 28px at and above, matching the design. See
   [research.md](./research.md) D2.
3. **`index.html` still sits at the repository root.** It moves to `src/` as the first
   implementation step, with `vite.config.ts` setting `root: 'src'` to match. This remains
   open and is task T004.
