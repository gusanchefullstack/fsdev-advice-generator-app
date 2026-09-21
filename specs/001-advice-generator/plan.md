# Implementation Plan: Advice Generator

**Branch**: `plan` (feature directory `001-advice-generator`) | **Date**: 2026-09-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-advice-generator/spec.md`

## Summary

A single-page application that shows one piece of advice on load and replaces it with a
freshly retrieved one each time the visitor activates the dice control. The card, its
divider and the dice button are rebuilt from the Figma design; the advice itself comes
from the Advice Slip API defined in `my-sdd-docs/specs.md`.

The technical approach is deliberately small: one page, one card component, one dice
button, a single service function that retrieves and validates a slip, and a hook that
holds the request state machine. Every failure mode collapses into one friendly message,
because the spec requires that no technical detail ever reaches the visitor.

Two behaviours drive most of the design work. First, the service reports failure while
still answering with HTTP 200, so success is decided by inspecting the payload rather than
the status code. Second, the endpoint sends caching headers that would let a browser serve
the same slip for ten minutes, which would make the dice appear broken; every request
therefore bypasses the HTTP cache.

## Technical Context

**Language/Version**: TypeScript 5.x, targeting ES2022

**Primary Dependencies**: React 18+, Vite 5+ (dev server and build), CSS Modules (no CSS
framework — Tailwind is explicitly not used)

**Storage**: None. No persistence, no history, no browser storage of any kind.

**Testing**: Vitest, with React Testing Library for component behaviour and a mocked
`fetch` for service-level tests

**Target Platform**: Modern evergreen browsers, mobile and desktop

**Project Type**: Frontend-only single-page web application. No backend, no database.

**Performance Goals**: Advice or a failure message visible within 3 seconds of page load on
a typical broadband connection (SC-001)

**Constraints**: Layout must hold from 320px to large desktop displays without horizontal
scrolling (SC-004, FR-011). Every request must bypass the HTTP cache (FR-004). No raw error
text may reach the visitor (FR-008).

**Scale/Scope**: One page, one route, two interactive states, roughly five source modules.
No authentication, no navigation, no server-side component.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Source | Status | Evidence |
|------|--------|--------|----------|
| Design fidelity to Figma | Principle I | PASS | Design System and Desktop/Tablet/Mobile frames read through the Figma Desktop MCP; tokens, spacing, radii, shadow and the hover treatment are recorded in [research.md](./research.md). |
| Spec-bounded — Zero Shadow Code | Principle II | PASS | Every module in the structure below traces to a numbered requirement. Nothing speculative: no routing, no state library, no theming, no persistence. |
| Authoritative data sources | Principle III | PASS | The contract is defined in `my-sdd-docs/specs.md` and restated for implementation in [contracts/advice-service.md](./contracts/advice-service.md). No shape is assumed. |
| Typed React with tokenized styling | Principle IV | PASS | TypeScript throughout; CSS Modules for component styles; all colours, spacing and type presets declared once in `src/styles/variables.css`. |
| Plain structure and naming | Principle V | PASS | Function components only. `camelCase` for functions and variables, `PascalCase` for components, types and interfaces. No class hierarchy, no abstraction layers. |
| User-facing error translation | Principle VI | PASS | One friendly message for every failure path; the service never surfaces its own error objects to the UI. See the error contract. |
| Mandated stack, no backend scaffolded | Technology Stack | PASS | React + TypeScript + CSS Modules + Vite + Vitest, frontend only. No Node/Express, no Prisma, no database. |
| Figma files excluded from version control | Workflow | PASS | `.gitignore` already covers `*.fig`, `*.sketch`, `*.xd`. |
| GitHub repository created before implementation | Workflow | PASS | `fsdev-advice-generator-app` created 2026-09-21 and wired as `origin`. Currently **private**; it must be made public before the Frontend Mentor submission step, which needs a publicly reachable repository URL. |

**Post-Phase 1 re-check**: Re-run after the design artifacts below were written. All gates
hold with the same evidence; the design introduced no new dependency, no additional
project, and no pattern requiring justification.

**Gate status update (2026-09-21)**: the repository gate has since been satisfied, and the
quote-size discrepancy recorded in research.md D2 has been resolved by amending
`my-sdd-docs/specs.md`. No pre-implementation conditions remain outstanding.

## Project Structure

### Documentation (this feature)

```text
specs/001-advice-generator/
├── plan.md              # This file
├── research.md          # Phase 0 output — design tokens, layout, API decisions
├── data-model.md        # Phase 1 output — entities and request state machine
├── quickstart.md        # Phase 1 output — how to run and validate
├── contracts/
│   ├── advice-service.md   # External service contract and validation rules
│   └── ui-contract.md      # Component boundaries, props, accessibility contract
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── index.html                  # Moved here from the repository root, per specs.md
├── main.tsx                    # Application entry point
├── App.tsx                     # Composes the page: one <main>, one <h1>
├── components/
│   ├── AdviceCard/
│   │   ├── AdviceCard.tsx      # Heading, quote, divider — presentational
│   │   └── AdviceCard.module.css
│   └── DiceButton/
│       ├── DiceButton.tsx      # The dice control, with its busy state
│       └── DiceButton.module.css
├── hooks/
│   └── useAdvice.ts            # Request state machine (FR-001, FR-003 … FR-009)
├── services/
│   └── adviceService.ts        # Retrieval, cache-busting, payload validation
├── types/
│   └── advice.ts               # AdviceSlip, AdviceState
└── styles/
    ├── variables.css           # All design tokens — the single place they are declared
    └── global.css              # Reset, body background, font loading

tests/
├── services/
│   └── adviceService.test.ts   # Payload validation, cache-busting, failure paths
├── hooks/
│   └── useAdvice.test.ts       # State transitions, no request stacking
└── components/
    ├── AdviceCard.test.tsx     # Rendering, accessible announcement
    └── DiceButton.test.tsx     # Disabled while busy, keyboard operability

images/                         # Existing optimized assets — served as Vite's publicDir
├── icon-dice.svg
├── pattern-divider-desktop.svg
├── pattern-divider-mobile.svg
└── favicon-32x32.png

vite.config.ts                  # root: 'src', publicDir: ../images, build.outDir: ../dist
package.json
tsconfig.json
```

**Structure Decision**: A single frontend project rooted at the repository root, with all
application source under `src/` and tests mirroring that layout under `tests/`. There is no
backend directory and no monorepo tooling, because the constitution's Backend and Database
rules are conditional and this project has neither.

`specs.md` requires `index.html` to move into `src/` before implementation starts, which
would normally conflict with Vite's expectation that the entry HTML sits at the project
root. The conflict is resolved in configuration rather than by disobeying either side:
`vite.config.ts` sets `root: 'src'`, which makes `src/index.html` the true entry point, with
`publicDir` pointed at the existing repository-level `images/` directory and `build.outDir`
pointed back out to `dist/`. Assets keep their single home in `images/` and are referenced
as root-relative URLs such as `/icon-dice.svg`.

Component styles sit beside their components as `*.module.css`, which is the CSS Modules
convention and keeps each component's styling in one obvious place. The shared, non-scoped
styles that `specs.md` asks to be grouped — the design tokens and the global reset — live
together under `src/styles/`, with every colour, spacing step and type preset declared once
in `variables.css` as Principle IV requires.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations to justify. Every gate in the table above passes. The one gate
that was previously blocked — repository creation — was an unmet pre-implementation
condition rather than a design compromise, and it has since been satisfied.
