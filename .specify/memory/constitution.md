# Advice Generator App Constitution

## Core Principles

### I. Design Fidelity to Figma (NON-NEGOTIABLE)

The Figma file is the single source of truth for CSS styles, spacing, fonts, colours,
gradients, and responsive layout. It outranks the starter HTML and any inference drawn
from the asset files. The Design and Design System pages MUST both be consulted, and the
Figma Desktop MCP MUST be used to read them rather than eyeballing exported images.
Designs exist for mobile, tablet, and desktop; each layout MUST match its Figma
specification while applying sound responsive practice between the named breakpoints.
Assets already present in the repository are preferred over re-exported ones; the Figma
file supplies only what is missing.

Rationale: This project is graded on visual accuracy against a published design. A
single authoritative design source removes drift between what is built and what is
measured.

### II. Spec-Bounded Implementation — Zero Shadow Code (NON-NEGOTIABLE)

Only what the specification documents MUST be built. Speculative features, "just in
case" abstractions, and undocumented behaviour are prohibited. When a user instruction
contradicts this constitution, or when a logical fault is detected in the specification,
work MUST stop before any source file is touched; the problem MUST be stated plainly and
a specification update requested.

Rationale: Spec-Driven Development is an explicit goal of this project, not a side
effect. Code that outruns its specification destroys the traceability the exercise is
meant to demonstrate.

### III. Authoritative Data Sources

Application data MUST come from the API defined in the specification. No data source may
be introduced that the specification does not name, and no response shape may be assumed
when the specification is silent — an undefined contract is a specification gap and MUST
be raised under Principle II rather than guessed at.

Rationale: Pinning data access to a documented contract keeps the implementation
verifiable against the specification instead of against a live third-party service.

### IV. Typed React Frontend with Tokenized Styling

The frontend MUST be built in React with TypeScript. Styling MUST use CSS Modules with
classes. Fonts, colours, gradients, and typography MUST be parameterized as variables in
a dedicated variables file, never scattered across individual component styles, so that
a design change is made in one place.

Rationale: Centralized design tokens are what make a Figma-driven redesign a one-file
edit rather than a repository-wide search.

### V. Plain Structure and Consistent Naming

Project structure MUST stay plain; overengineering is prohibited. Components MUST be
written as React function components, following the idiom React itself expects. Naming
is fixed: `camelCase` for functions and variables, `PascalCase` for interfaces, types,
and classes. These conventions MUST hold across the entire codebase without exception.

Rationale: A small, well-understood application does not earn architectural complexity,
and mechanical rules for component form and naming are checkable in review rather than
debatable.

### VI. User-Facing Error Translation

Raw errors and stack traces MUST NEVER reach the end user. Every technical failure MUST
be translated into a friendly, human-readable message in the UI. If a backend exists, it
MUST return semantically correct HTTP status codes.

Rationale: Error presentation is part of the product surface; leaked internals are both
a usability failure and an information-disclosure risk.

## Technology Stack & Repository Constraints

The stack is mandated, not selected per feature:

- **Language**: TypeScript, in frontend and backend alike.
- **Frontend**: React, styled with CSS Modules and classes.
- **Backend** (only if one exists): Node.js with Express.js, following REST guidelines.
- **Database** (only if one exists): Prisma Postgres accessed through the Prisma ORM.
- **Repositories**: frontend and backend live in separate repositories. Monorepo and
  monolith layouts are prohibited.

The Backend and Database entries are conditional. This project is frontend-only and
consumes a third-party API, so neither a backend nor a database may be scaffolded
without a specification change authorizing it.

Scope: the application generates a piece of advice on demand, presents hover states for
interactive elements, and adapts its layout to the viewer's screen size. Detailed user
stories, breakpoints, colour palette, and type scale live in specs.md and MUST NOT be
duplicated here.

## Development Workflow & Delivery Gates

- A local git repository MUST exist before implementation begins; initialize one if
  absent.
- The frontend GitHub repository — and the backend one, if a backend applies — MUST be
  created as the first step, before implementation begins.
- Every GitHub repository MUST carry the `fsdev-` prefix so it stays identifiable later.
- Figma design files MUST NEVER be pushed to GitHub. `.gitignore` MUST exclude them.

Deployment targets and testing gates are defined in specs.md and are not restated here.

## Governance

This constitution supersedes all other development practices for this project. Where it
and an ad-hoc instruction disagree, this document wins and the disagreement MUST be
raised under Principle II.

**Upstream source**: `my-sdd-docs/constitution.md` is the authoring copy and remains the
author's authority. This file is the derived Spec Kit copy. Amendments originate
upstream and are propagated here; this file MUST NOT be edited in isolation, or the two
documents will silently diverge.

**Amendment procedure**: amendments are made in `my-sdd-docs/constitution.md`, then
applied here with a version bump, an updated amendment date, and a Sync Impact Report
recording what changed. The Sync Impact Report is review scratch material and is removed
before the amended file is committed.

**Versioning policy**: semantic versioning. MAJOR for backward-incompatible governance
changes, principle removals, or redefinitions. MINOR for a new principle or materially
expanded guidance. PATCH for clarifications, wording, and non-semantic refinements.

**Compliance review**: every change MUST be checked against these principles before it
is considered done. Deviations MUST be justified in writing or reverted. Outstanding
`TODO(...)` markers MUST be resolved before the work they govern is implemented.

**Version**: 1.1.0 | **Ratified**: 2026-09-21 | **Last Amended**: 2026-09-21
