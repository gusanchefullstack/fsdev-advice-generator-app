# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A Frontend Mentor challenge ([Advice generator app](https://www.frontendmentor.io/challenges/advice-generator-app-QdUG-13db)) built as a Spec-Driven Development (SDD) exercise. As of this writing the repo is a **pre-implementation scaffold**: starter `index.html`, `/images` assets, the Figma file, and the two SDD documents. There is no `src/`, no `package.json`, and no application code yet.

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

- GitHub repos are created **before** implementation and must carry the **`fsdev-`** prefix. This repo currently has no remote configured.
- Never let Figma design files reach GitHub — `.gitignore` already covers `*.fig`, `*.sketch`, `*.xd`.
- Deployment: frontend to **Vercel**, only after the user confirms the project is done and the GitHub repos exist.

## Post-implementation sequence

`specs.md` defines an ordered pipeline; it is real work, not boilerplate:

1. Submit to frontendmentor.io via `@frontendmentor-submitter`.
2. Collect the Solution URL and the live Vercel URL, then update `README.md` and the repo's live-site field.
3. **Ask for confirmation first**, then update the portfolio via `@landing-page-portfolio-updater`.
4. Fix reported issues via `@frontend-mentor-issue-fixer` to raise the quality score.

`README.md` is built from `README-template.md` (plus the `/create-readme` skill). `specs.md` holds the author links and the screenshot rules — screenshots go in `/screenshots` at strict 375px and 1440px, with the mobile shot rendered at 40% the width of the desktop shot.

## Known spec gap

Constitution §3 says to "use defined APIs in specs," but `specs.md` never defines the Advice Slip API endpoint or response shape — only `constitution.md` names the API at all. Under the stop-and-ask rule this is a spec update, not something to assume. Raise it with the user before writing fetch code.
