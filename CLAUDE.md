# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A Frontend Mentor challenge ([Advice generator app](https://www.frontendmentor.io/challenges/advice-generator-app-QdUG-13db)) built as a Spec-Driven Development (SDD) exercise.

**The challenge is complete and shipped.** The app is implemented in `src/`, tested in `tests/`, deployed to Vercel, and submitted to Frontend Mentor (quality report: 8.9/10). The SDD artifacts live in `specs/001-advice-generator/` — spec, plan, research, data model, contracts, quickstart and the task breakdown — and the branch history preserves the phases: `constitution` → `spec` → `plan` → `tasks` → `implement`, with `main` carrying everything forward.

- Live: https://fsdev-advice-generator-app.vercel.app
- Repo: https://github.com/gusanchefullstack/fsdev-advice-generator-app
- Solution: https://www.frontendmentor.io/solutions/advice-generator-react-typescript-built-spec-first-qHhKuVXz8-

Further work on this repo is maintenance, not greenfield. The governance below still applies: changes are still spec-first.

## Governance: the SDD documents are authority

Two files in `my-sdd-docs/` govern all work here. Read both before implementing anything.

- **`my-sdd-docs/constitution.md`** — standing rules that outlive any single task (tech stack, code style, error handling, versioning, agent behaviour).
- **`my-sdd-docs/specs.md`** — this project's specification (architecture, style guide, design tokens, testing, documentation, deployment, post-implementation steps).

Two rules from constitution §7 change how you should work:

- **Zero Shadow Code** — build only what `specs.md` documents. No speculative features.
- **Stop and ask** — if a user instruction contradicts the constitution, or you detect a logical fault, stop, state the problem, and request a `specs.md` update *before* touching source.

Treat these documents as the source of truth rather than duplicating their contents elsewhere. In particular, read the colour palette and type scale from `specs.md` rather than re-declaring them anywhere else.

## Commands

```bash
npm install
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # type-check (tsc --noEmit) then production build to dist/
npm run preview    # serve the production build
npm test           # Vitest, watch mode
npm run test:run   # Vitest, single pass
```

Run a single test file, or a single case by name:

```bash
npx vitest run tests/services/adviceService.test.ts
npx vitest run -t "rejects when the service reports an error at HTTP 200"
```

The stack is mandated by `specs.md` and constitution §4: Vite, React, TypeScript,
CSS Modules, Vitest. `vite.config.ts` sets `publicDir: 'images'` so the challenge's
pre-optimized assets are served from the root (`/icon-dice.svg`); everything else
uses Vite's defaults, with `index.html` at the project root.

## Architecture and constraints

**Frontend-only.** The constitution's Backend (Node/Express) and Database (Prisma/Postgres) sections are conditional — "if exist" — and this project has neither. Data comes from the third-party Advice Slip API. Do not scaffold a backend.

**Structure** (per `specs.md`):

- Source lives in `src/`, with CSS and TypeScript in their own subfolders and React components under a components folder.
- **`index.html` stays at the project root**, where Vite expects the entry HTML; `specs.md` was amended on 2026-09-21 to say so, reversing an earlier instruction to move it into `src/`. Application source still lives under `src/`.
- Design tokens — fonts, colours, gradients, typography — must be parameterized in **a separate variables file** (constitution §4), not scattered across component styles.
- Keep the structure plain; the constitution explicitly warns against overengineering.

**Naming:** `camelCase` for functions and variables, `PascalCase` for interfaces, types, and classes.

**Accessibility is a graded requirement, not a nicety.** `specs.md` calls out: consistent semantic HTML, exactly one `<main>` per page, exactly one `<h1>`, and no multiple links sharing identical text. The Frontend Mentor quality report scores these.

**Errors:** never surface raw errors or stack traces in the UI — translate every technical failure into a friendly message.

## Design source of truth

The Figma file is authoritative for spacing, fonts, colours, and responsive layout — above the starter HTML and above any inference from the assets. Use the **Figma Desktop MCP** to read it; the file-and-node URLs for the Design System and the Desktop/Tablet/Mobile designs are in `specs.md`.

Note: `*.fig` is gitignored, so `figma-design/advice-generator-app.fig` is local-only and will be absent from a fresh clone. Use the Figma URLs in that case. SVGs in `/images` are already optimized — prefer them over re-exporting.

Designs target 375px (mobile) and 1440px (desktop), but the layout must hold from 320px to large screens.

## Testing

Vitest, per `specs.md`. Exercise the implementation at 375px, 768px, and 1440px viewports, and re-run tests to validate functionality after significant changes.

## Versioning and delivery

- GitHub repos are created **before** implementation and must carry the **`fsdev-`** prefix. This repo's remote is `origin` → `gusanchefullstack/fsdev-advice-generator-app` (public, default branch `main`).
- Never let Figma design files reach GitHub — `.gitignore` already covers `*.fig`, `*.sketch`, `*.xd`.
- Deployment: frontend to **Vercel**, only after the user confirms the project is done and the GitHub repos exist.

## Post-implementation sequence

`specs.md` defines an ordered pipeline. **All four steps were completed on 2026-09-21**; they are recorded here because they apply to the next challenge built from these documents:

1. Submit to frontendmentor.io via `@frontendmentor-submitter`. — done
2. Collect the Solution URL and the live Vercel URL, then update `README.md` and the repo's live-site field. — done
3. **Ask for confirmation first**, then update the portfolio via `@landing-page-portfolio-updater`. — done
4. Fix reported issues via `@frontend-mentor-issue-fixer` to raise the quality score. — not needed; the report surfaced no fixable issues.

**Frontend Mentor's analyzer clones the `main` branch by name, not the repo's default branch.** The first report scored 2.6/10 because `main` still held the pre-implementation scaffold while the code sat on `implement`. Fast-forwarding `main` took the same code to 8.9/10 with no source changes. Make sure `main` holds the real code before submitting.

`README.md` is built from `README-template.md` (plus the `/create-readme` skill). `specs.md` holds the author links and the screenshot rules — screenshots go in `/screenshots` at strict 375px and 1440px, with the mobile shot rendered at 40% the width of the desktop shot.

## Two API behaviours that are easy to get wrong

`specs.md` § Domain Rules defines the Advice Slip contract (this gap was closed on
2026-09-21 by calling the live endpoint). Two findings there drive most of
`src/services/adviceService.ts`, and both look like bugs if you "fix" them:

- **The API reports failure with HTTP 200** and a different payload shape
  (`{ "message": {...} }` instead of `{ "slip": {...} }`). `response.ok` is not a
  usable success signal; success is decided by validating that `slip.advice` is a
  non-empty string. Do not replace that check with a status-code check.
- **It sends `Cache-Control: max-age=600`**, so without intervention a browser serves
  the same slip for ten minutes and the dice appears dead. Every request carries both
  `cache: 'no-store'` and a unique query parameter combining the clock with a counter —
  the counter matters because several clicks can land in one millisecond. This cannot be
  verified with `curl` or in jsdom; neither implements an HTTP cache.
