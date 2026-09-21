---
description: "Task list for the Advice Generator feature"
---

# Tasks: Advice Generator

**Input**: Design documents from `/specs/001-advice-generator/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: Test tasks ARE included. `my-sdd-docs/specs.md` § Testing mandates Vitest, requires
key and edge cases to be covered, and requires the suite to be re-run after significant
changes. Tests are therefore a requirement here, not an option.

**Organization**: Tasks are grouped by user story so each story can be implemented, tested
and demonstrated on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story the task belongs to (US1, US2, US3)
- Exact file paths are given in every task

## Path Conventions

Single frontend project at the repository root: source in `src/`, tests in `tests/`, existing
optimized assets in `images/`. Paths follow the structure decided in
[plan.md](./plan.md#project-structure).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Satisfy the pre-implementation gates and scaffold the toolchain.

- [x] T001 Create the GitHub repository `fsdev-advice-generator-app` and add it as the `origin` remote. **DONE 2026-09-21** — created private and wired as `origin`; must be made public before the Frontend Mentor submission step.
- [x] T002 Amend `my-sdd-docs/specs.md` § Front-end Style Guide → Typography to record **two** quote sizes — 24px below 768px and 28px at 768px and above. **DONE 2026-09-21** — approved by the author in favour of the Figma definition; the spec and the design now agree.
- [ ] T003 Initialize `package.json` at the repository root with React 18+, React DOM, TypeScript 5.x, Vite 5+, Vitest, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom` and `jsdom`
- [ ] T004 Update `index.html` at the repository root to be the Vite entry point: add `<script type="module" src="/src/main.tsx"></script>`, add the mount node `<div id="root"></div>`, and change the favicon reference from `./images/favicon-32x32.png` to `/favicon-32x32.png` (it is served from `publicDir`). The file stays at the root, per `my-sdd-docs/specs.md` § Front-end Style Guide.
- [ ] T005 Create `vite.config.ts` at the repository root with the React plugin and `publicDir: 'images'`, so the existing optimized assets are served at root-relative URLs such as `/icon-dice.svg`. Everything else stays on Vite's defaults — entry `index.html` at the root, build output to `dist/`.
- [ ] T006 [P] Create `tsconfig.json` and `tsconfig.node.json` at the repository root, targeting ES2022 with `strict: true`
- [ ] T007 [P] Configure Vitest in `vite.config.ts` with the `jsdom` environment, and create `tests/setup.ts` importing `@testing-library/jest-dom`
- [ ] T008 [P] Replace the "Commands" section of `CLAUDE.md` with the real `dev` / `build` / `test` scripts, including how to run a single test file and a single test case

**Checkpoint**: `npm run dev` serves a blank page from the root `index.html`; `npm test` runs and finds no tests yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The design tokens and shared types every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T009 Create `src/styles/variables.css` declaring every design token as a custom property — colours `blue-950 #202733`, `blue-900 #313a48`, `blue-600 #4f5d74`, `blue-200 #cee3e9`, `green-300 #53ffaa`; the spacing scale `0, 8, 16, 24, 32, 40, 64, 128`; and the three Manrope 800 type presets from [research.md](./research.md) D1–D2. This is the single place tokens are declared (Principle IV).
- [ ] T010 Create `src/styles/global.css` with a minimal reset, `body` background `blue-950`, and the Manrope 800 web font loaded from Google Fonts
- [ ] T011 [P] Create `src/types/advice.ts` defining `interface AdviceSlip { id: number; advice: string }` and the discriminated union `AdviceState` with its three variants `loading` / `ready` / `failed`, exactly as specified in [data-model.md](./data-model.md#state-advicestate). `slip` is `AdviceSlip | null` on `loading` and `failed`, and `AdviceSlip` on `ready`.

**Checkpoint**: Tokens and types exist and compile. User story work can begin.

---

## Phase 3: User Story 1 - Receive a piece of advice on arrival (Priority: P1) 🎯 MVP

**Goal**: A visitor who opens the page and does nothing is shown a piece of advice and its number on the card. If retrieval fails, they see a friendly message instead of a blank card.

**Independent Test**: Open the page, take no action, and confirm advice and its number appear. Delivers value with no dice button present.

### Tests for User Story 1

> Write these first and confirm they fail before implementing.

- [ ] T012 [P] [US1] Write `tests/services/adviceService.test.ts` covering every case in [contracts/advice-service.md](./contracts/advice-service.md#required-test-cases): valid payload resolves; a `message` payload at HTTP 200 rejects; `slip.advice` empty, whitespace-only or non-string rejects; a non-JSON body rejects without throwing unhandled; a rejected `fetch` rejects; every call passes `cache: 'no-store'`; two consecutive calls carry distinct cache-busting parameters
- [ ] T013 [P] [US1] Write `tests/hooks/useAdvice.test.ts` covering the mount behaviour: a retrieval starts on mount with no user action, state moves `loading` → `ready` on a valid payload, and state moves `loading` → `failed` carrying the friendly message on rejection
- [ ] T014 [P] [US1] Write `tests/components/AdviceCard.test.tsx` covering: renders `ADVICE #<id>` and the quote from a given slip; renders the friendly message instead of the quote when `message` is set; never renders an empty card; the heading-and-quote region carries a polite live region role

### Implementation for User Story 1

- [ ] T015 [US1] Implement `fetchAdvice()` in `src/services/adviceService.ts` per [contracts/advice-service.md](./contracts/advice-service.md): `GET https://api.adviceslip.com/advice` with `cache: 'no-store'` and a unique `?t=<epoch-ms>` parameter; validate the parsed body against the rules in [data-model.md](./data-model.md#entity-adviceslip) — body is a non-null object, `slip` is an object, `slip.advice` is a string with at least one non-whitespace character, `slip.id` is a number — and reject with a plain `Error` on any failure. **Must not branch on `response.ok` alone; the service returns HTTP 200 on failure.** Must not retry internally.
- [ ] T016 [US1] Implement `useAdvice()` in `src/hooks/useAdvice.ts` holding `AdviceState`: start a retrieval on mount (FR-001), transition per the table in [data-model.md](./data-model.md#transitions), and convert every rejection into the single friendly message `"Couldn't fetch advice right now. Please try again."`. The underlying `Error` must never leave the hook (FR-008). Expose `state` and `requestAdvice`.
- [ ] T017 [P] [US1] Implement `src/components/AdviceCard/AdviceCard.tsx` taking `{ slip: AdviceSlip | null; message: string | null }`, rendering the `ADVICE #<id>` heading and the quote wrapped in typographic quotation marks, or the friendly message in place of the quote. Presentational only — no retrieval, no state. Wrap the heading-and-quote region in a polite live region (FR-015).
- [ ] T018 [P] [US1] Implement `src/components/AdviceCard/AdviceCard.module.css` for the desktop card per [research.md](./research.md) D3: background `blue-900`, radius `15px`, shadow `30px 50px 80px 0 rgba(0,0,0,0.1)`, horizontal padding `48px`, content column `444px`, heading→quote gap `24px`, section gap `40px`; heading in `green-300` at 13px with `4px` letter-spacing, uppercase; quote in `blue-200` at 28px with `-0.3px` letter-spacing and `1.35` line height
- [ ] T019 [US1] Implement the divider in `AdviceCard.tsx` and its styles using `images/pattern-divider-desktop.svg` referenced as `/pattern-divider-desktop.svg` (per research D4 — use the shipped asset, do not rebuild it in CSS)
- [ ] T020 [US1] Implement `src/App.tsx` composing the page: exactly one `<main>`, exactly one `<h1>` carrying the page name and visually hidden, and `<AdviceCard>` wired to `useAdvice()`. The visible `ADVICE #<id>` line is **not** the `<h1>` — see [contracts/ui-contract.md](./contracts/ui-contract.md#page-composition--app).
- [ ] T021 [US1] Implement `src/main.tsx` mounting `<App />`, importing `src/styles/variables.css` and `src/styles/global.css`
- [ ] T022 [US1] Run `npm test -- --run` and confirm the User Story 1 tests now pass

**Checkpoint**: Opening the page shows advice with no user action, and a friendly message when retrieval fails. User Story 1 is independently demonstrable.

---

## Phase 4: User Story 2 - Request a new piece of advice (Priority: P2)

**Goal**: Activating the dice replaces the displayed advice with a freshly retrieved slip, without a page reload, while the previous advice stays visible during the request.

**Independent Test**: With advice displayed, activate the dice and confirm the advice and number change to a newly retrieved slip.

### Tests for User Story 2

- [ ] T023 [P] [US2] Write `tests/components/DiceButton.test.tsx` covering: renders a real `<button type="button">`; is `disabled` and carries `aria-busy` while `isBusy`; has a non-empty accessible name; the dice glyph is decorative with empty `alt`; activates on click, Enter and Space
- [ ] T024 [P] [US2] Extend `tests/hooks/useAdvice.test.ts` with the re-request cases: `requestAdvice()` moves `ready` → `loading` while **keeping the previous slip** (FR-005); `requestAdvice()` is ignored while `status === 'loading'` so requests cannot stack; `failed` → `loading` on retry; nothing retries automatically (FR-009)
- [ ] T025 [P] [US2] Extend `tests/services/adviceService.test.ts` with a distinctness case: ten consecutive `fetchAdvice()` calls each issue a request with a distinct cache-busting parameter (SC-002)

### Implementation for User Story 2

- [ ] T026 [P] [US2] Implement `src/components/DiceButton/DiceButton.tsx` taking `{ onClick: () => void; isBusy: boolean }`, rendering a `<button type="button">` with an accessible name such as "Get new advice", containing `images/icon-dice.svg` referenced as `/icon-dice.svg` with empty `alt`, and setting `disabled` and `aria-busy` from `isBusy`
- [ ] T027 [P] [US2] Implement `src/components/DiceButton/DiceButton.module.css` per [research.md](./research.md) D5–D6: a 64px circle filled `green-300` with the glyph at 24px, positioned centred on the card's bottom edge offset by half its height; green glow `box-shadow: 0 0 40px 0 <green-300>` on both `:hover` and `:focus-visible`; a visible focus indicator
- [ ] T028 [US2] Wire `<DiceButton>` into `src/App.tsx`, passing `requestAdvice` as `onClick` and `state.status === 'loading'` as `isBusy`
- [ ] T029 [US2] Guard `requestAdvice()` in `src/hooks/useAdvice.ts` so activations are ignored while a request is in flight, and confirm the previous slip is carried through the `loading` state so the card never blanks mid-request
- [ ] T030 [US2] Run `npm test -- --run` and confirm the User Story 2 tests pass
- [ ] T031 [US2] Verify in a real browser with DevTools → Network that ten consecutive dice activations each produce a genuine network request rather than `(from disk cache)`, and that the advice changes each time (FR-004, SC-002). **This cannot be proven with `curl` or in jsdom — neither implements an HTTP cache.**

**Checkpoint**: User Stories 1 and 2 both work. The dice is fully functional, keyboard-operable and never serves stale advice.

---

## Phase 5: User Story 3 - Read comfortably on any device (Priority: P3)

**Goal**: The layout adapts across the full supported width range, matching the Figma mobile design below 768px and the desktop design at and above it.

**Independent Test**: Load the page at narrow, mid and wide viewport widths and confirm the layout adapts with no overlap, overflow or horizontal scrolling.

### Tests for User Story 3

- [ ] T032 [P] [US3] Write `tests/components/AdviceCard.responsive.test.tsx` asserting what jsdom can actually verify — that both divider assets are referenced and that the card root carries the class the media queries target. **Note: jsdom performs no layout, so true responsive behaviour is verified in the browser at T036, not here.**

### Implementation for User Story 3

- [ ] T033 [US3] Restructure `src/components/AdviceCard/AdviceCard.module.css` to be mobile-first: base rules for the mobile card per [research.md](./research.md) D3 — radius `10px`, horizontal padding `24px`, content column `296px`, heading→quote gap `16px`, section gap `32px`, quote at **24px** — with a single `min-width: 768px` media query raising them to the desktop values already written in T018
- [ ] T034 [US3] In `src/components/AdviceCard/AdviceCard.module.css`, express the card width as a maximum with a fluid fallback — `343px` cap on mobile, `540px` cap from 768px, never a fixed pixel width — so the layout holds down to 320px (SC-004)
- [ ] T035 [US3] Swap the divider asset at the 768px breakpoint in `src/components/AdviceCard/AdviceCard.module.css` (and its reference in `src/components/AdviceCard/AdviceCard.tsx` if set in markup), using `/pattern-divider-mobile.svg` below it and `/pattern-divider-desktop.svg` at and above it (research D4)
- [ ] T036 [US3] Verify in a browser at **320px, 375px, 768px and 1440px**: no horizontal scrolling at any width; quote is 24px below 768px and 28px at and above; card is 343px/10px radius on mobile and 540px/15px radius from 768px; the divider asset swaps correctly

**Checkpoint**: All three user stories are independently functional across the supported width range.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T037 Verify unusually long and unusually short advice wraps inside the card without clipping or collapsing the layout, at both 375px and 1440px (US3 acceptance scenario 3)
- [ ] T038 Run an automated accessibility audit (Lighthouse or axe) and resolve every violation; confirm exactly one `<main>` and exactly one `<h1>`, a visible focus indicator on the dice, a non-empty accessible name, and WCAG AA contrast (FR-013, FR-014, SC-005)
- [ ] T039 Confirm with a screen reader that replacing the advice is announced politely and that focus is not stolen from the dice button (FR-015, research D10)
- [ ] T040 [P] Add plain-style comments to the key parts of `src/services/adviceService.ts` and `src/hooks/useAdvice.ts` — in particular why success is decided from the payload rather than the status code, and why every request bypasses the cache
- [ ] T041 Work through every check in [quickstart.md](./quickstart.md) and confirm all 20 pass
- [ ] T042 Run the full suite with `npm test -- --run` and confirm it is green
- [ ] T043 [P] Take screenshots at strictly 375px and strictly 1440px, save them to `screenshots/` at the repository root, and size the mobile shot to 40% the width of the desktop shot, per `my-sdd-docs/specs.md` § Documentation
- [ ] T044 Create `README.md` from `README-template.md` using the `/create-readme` skill, including the author links and badges listed in `my-sdd-docs/specs.md` § Documentation and the screenshots from T043

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 blocks everything — the repository gate is a constitution requirement. T002 should be settled before T033, since it governs the mobile quote size.
- **Foundational (Phase 2)**: Depends on Setup. **Blocks all user stories.**
- **User Story 1 (Phase 3)**: Depends on Foundational. Independent of US2 and US3.
- **User Story 2 (Phase 4)**: Depends on Foundational, and on US1 for the card it replaces content within.
- **User Story 3 (Phase 5)**: Depends on Foundational, and on US1 for the card styles it makes responsive.
- **Polish (Phase 6)**: Depends on all desired stories being complete.

### Within Each User Story

- Tests are written first and must fail before implementation
- Types → service → hook → components → composition
- Story complete and demonstrable before moving to the next priority

### Parallel Opportunities

- **Setup**: T006, T007 and T008 run in parallel once T003 is done
- **Foundational**: T011 runs in parallel with T009/T010 (different files, no shared edits)
- **US1**: T012, T013 and T014 all in parallel (three separate test files); then T017 and T018 in parallel (component and its stylesheet)
- **US2**: T023, T024 and T025 all in parallel; then T026 and T027 in parallel
- **Polish**: T040 and T043 run in parallel with the verification tasks

**Not parallel**: T015 → T016 → T020 form a chain (service, then hook, then composition). T018 and T033 edit the same stylesheet and must be sequential. T024 and T013 edit the same test file and must be sequential.

---

## Parallel Example: User Story 1

```bash
# Write all three US1 test files together:
Task: "Write tests/services/adviceService.test.ts covering the contract's required cases"
Task: "Write tests/hooks/useAdvice.test.ts covering mount behaviour"
Task: "Write tests/components/AdviceCard.test.tsx covering rendering and the live region"

# After the service and hook exist, build the card and its styles together:
Task: "Implement src/components/AdviceCard/AdviceCard.tsx"
Task: "Implement src/components/AdviceCard/AdviceCard.module.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 Setup — **T001 first; the repository gate blocks implementation**
2. Phase 2 Foundational — tokens and types
3. Phase 3 User Story 1
4. **STOP and VALIDATE**: open the page, take no action, confirm advice appears; force a failure and confirm the friendly message
5. This is already a working product: it shows advice, just not new advice on demand

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Add US1 → validate → **MVP**
3. Add US2 → validate → the dice works, advice is never stale
4. Add US3 → validate at 320/375/768/1440 → responsive
5. Polish → accessibility, screenshots, README

### Sequencing note

This is a single-developer project, so the parallel markers indicate tasks that are safe to
batch rather than work to split across people. The stories are genuinely independent in
their requirements, but US2 and US3 both build on the card delivered by US1, so the
priority order is also the practical build order.

---

## Notes

- `[P]` marks tasks touching different files with no dependency on incomplete work
- `[Story]` labels map each task to a user story for traceability
- Verify tests fail before implementing the behaviour they describe
- Commit after each task or logical group
- Two facts drive most of the implementation and are easy to get wrong: **success is decided from the payload, not the HTTP status**, and **every request must bypass the HTTP cache**
- Do not add features the spec does not document — Zero Shadow Code (Principle II)
