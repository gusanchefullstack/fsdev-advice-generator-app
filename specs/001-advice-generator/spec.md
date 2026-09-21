# Feature Specification: Advice Generator

**Feature Branch**: `spec`

**Feature Directory**: `specs/001-advice-generator`

**Created**: 2026-09-21

**Status**: Draft

**Input**: User description: "Advice generator app — a single-page app that displays a random piece of advice and lets the user request a new one by clicking the dice button. Full requirements, data contract, design source of truth, responsive breakpoints, accessibility rules and style guide are defined in my-sdd-docs/specs.md; standing governance is in .specify/memory/constitution.md."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Receive a piece of advice on arrival (Priority: P1)

A visitor opens the page and is shown a piece of advice without taking any action. The
advice is presented on a card together with its identifying number, laid out to match the
published design.

**Why this priority**: This is the smallest slice that delivers the product's entire
promise — a visitor who does nothing still leaves with advice. It is the only story that
stands alone: every other story assumes a card exists to display advice in. Shipped by
itself, it is already a usable product.

**Independent Test**: Open the page with no further interaction and confirm a piece of
advice and its number are visible. Delivers value without the dice button existing.

**Acceptance Scenarios**:

1. **Given** a visitor opens the page, **When** the page finishes loading, **Then** a
   piece of advice and its identifying number are displayed on the card.
2. **Given** the advice has been retrieved, **When** the visitor reads the card, **Then**
   the advice text and number are legible and positioned as the published design shows.
3. **Given** the page is opened a second time in a new session, **When** it loads,
   **Then** the advice shown is drawn fresh rather than repeated from the previous visit.

---

### User Story 2 - Request a new piece of advice (Priority: P2)

A visitor who wants different advice activates the dice control and is shown a newly
retrieved piece of advice in place of the current one, without the page reloading.

**Why this priority**: This is the headline interaction and the reason a visitor stays on
the page, but it cannot be demonstrated until a card exists to replace content within, so
it follows P1.

**Independent Test**: With advice already displayed, activate the dice control and confirm
the displayed advice and number change to a newly retrieved slip.

**Acceptance Scenarios**:

1. **Given** advice is displayed, **When** the visitor activates the dice control,
   **Then** a newly retrieved piece of advice and its number replace the previous ones.
2. **Given** the visitor activates the dice control several times in succession, **When**
   each request completes, **Then** each result is a freshly retrieved slip rather than a
   repeat of an earlier response held in storage.
3. **Given** a request is in progress, **When** the visitor looks at the dice control,
   **Then** it is visibly unavailable and the previously displayed advice remains on
   screen until the new advice arrives.
4. **Given** a visitor points at the dice control, **When** the pointer rests over it,
   **Then** the control shows its hover treatment as the published design specifies.
5. **Given** a visitor navigating by keyboard alone, **When** they move focus through the
   page, **Then** the dice control receives visible focus and can be activated without a
   pointer.
6. **Given** a visitor using a screen reader, **When** new advice replaces the old,
   **Then** the change is announced without the visitor having to hunt for it.

---

### User Story 3 - Read comfortably on any device (Priority: P3)

A visitor arriving on a phone, tablet, or desktop sees a layout suited to their screen,
with the card, advice text, and dice control all readable and reachable.

**Why this priority**: The content is already usable once P1 and P2 ship; this story
raises quality across devices and is graded, but no functionality is lost without it.

**Independent Test**: Load the page at narrow, mid, and wide viewport widths and confirm
the layout adapts without content overlapping, overflowing, or becoming unreadable.

**Acceptance Scenarios**:

1. **Given** a visitor on a narrow screen, **When** the page loads, **Then** the card and
   its contents fit the viewport with no sideways scrolling.
2. **Given** a visitor on a wide screen, **When** the page loads, **Then** the layout
   matches the published desktop design rather than stretching to fill the width.
3. **Given** any supported viewport width, **When** the advice text is unusually long,
   **Then** the text wraps within the card instead of overflowing it.

---

### Edge Cases

- **Retrieval fails** (no connectivity, the service is unreachable, or it answers with
  something other than usable advice): the visitor sees a short, friendly message
  explaining that advice could not be retrieved, the card does not appear blank or
  broken, and the dice control returns to an available state so they can try again.
- **The service reports a problem while still appearing to answer normally**: this is
  treated as a failed retrieval, not as advice. No empty card and no placeholder text are
  shown in place of real advice.
- **Repeated requests return the same advice**: consecutive requests must yield freshly
  retrieved results, so the visitor never sees the dice appear to do nothing.
- **The visitor activates the dice repeatedly and rapidly**: requests do not stack up or
  interleave, and the card ends on the result of the most recent request.
- **A request is slow**: the previously displayed advice stays visible and the dice
  control shows itself as busy rather than the card emptying.
- **Advice text is much longer or much shorter than typical**: the card accommodates it
  without clipping the text or collapsing the layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a piece of advice and its identifying number when
  the page loads, without requiring any visitor action.
- **FR-002**: Visitors MUST be able to request a new piece of advice by activating the
  dice control.
- **FR-003**: The system MUST replace the displayed advice and number with the newly
  retrieved ones, without reloading the page.
- **FR-004**: Each request MUST return freshly retrieved advice rather than a previously
  stored copy of an earlier response.
- **FR-005**: While a request is in progress, the system MUST make the dice control
  visibly unavailable and MUST keep any previously displayed advice on screen.
- **FR-006**: The system MUST treat a response as successful only when it actually
  carries advice text, and MUST treat every other outcome as a failed retrieval.
- **FR-007**: On a failed retrieval, the system MUST show a short, friendly message and
  MUST return the dice control to an available state so the visitor can retry.
- **FR-008**: The system MUST NEVER display raw error text, diagnostic codes, or
  technical failure details to the visitor.
- **FR-009**: The system MUST NOT retry a failed request automatically; retrying is the
  visitor's choice via the dice control.
- **FR-010**: Interactive controls MUST present a distinct hover treatment, as the
  published design specifies.
- **FR-011**: The layout MUST adapt across the full supported range of screen widths,
  from narrow phones to large desktop displays, without horizontal scrolling or
  overlapping content.
- **FR-012**: Visual presentation — spacing, colour, typography, and layout at each
  breakpoint — MUST match the published design.
- **FR-013**: The page MUST use a consistent semantic document structure, with exactly
  one main content region and exactly one top-level heading.
- **FR-014**: All interactive controls MUST be reachable and operable by keyboard, and
  MUST carry an accessible name describing their purpose.
- **FR-015**: Advice content that changes in place MUST be announced to assistive
  technology, so a visitor not looking at the screen learns that new advice arrived.

### Key Entities

- **Advice Slip**: A single piece of advice retrieved from the external advice service.
  Carries an identifying number, shown in the card heading, and the advice text itself,
  shown as the quotation. Only one slip is displayed at a time; slips are not stored
  between visits.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor opening the page sees a piece of advice, or a friendly failure
  message, within 3 seconds on a typical broadband connection — the card is never left
  indefinitely empty.
- **SC-002**: Activating the dice control 10 times in a row produces 10 freshly retrieved
  results, with no result served from a previously stored copy.
- **SC-003**: 100% of retrieval failures present a human-readable message; raw error
  text, stack traces, and diagnostic codes appear to the visitor in 0% of cases.
- **SC-004**: The layout holds without horizontal scrolling or overlapping content at
  every width from 320px to large desktop displays, verified at the narrow, mid, and wide
  reference widths.
- **SC-005**: The page passes automated accessibility checks with no violations for
  document structure, control naming, or colour contrast.
- **SC-006**: A first-time visitor can obtain a new piece of advice on their first
  attempt without instruction, because the dice control is the only interactive element
  on the page.
- **SC-007**: Visual comparison against the published design at the mobile and desktop
  reference widths shows no discrepancy in spacing, colour, or typography.

## Assumptions

- The data source, its contract, and its failure behaviour are defined in
  `my-sdd-docs/specs.md`; this specification describes only what the visitor experiences
  and does not restate them.
- The mandated technology stack, code structure, naming, and error-handling rules are
  fixed by `.specify/memory/constitution.md` and are out of scope here.
- The published design in the project's Figma file is authoritative for all visual
  detail, including the exact format of the advice number in the card heading.
- The failure message wording, the decision to keep stale advice visible during loading,
  and the absence of automatic retry are settled product decisions recorded in
  `my-sdd-docs/specs.md`.
- Scope is a single page with one card and one interactive control. There is no
  navigation, no accounts, no settings, and no server-side component.
- Advice is not persisted between visits, and there is no history of previously shown
  advice. Each visit begins with a freshly retrieved slip.
- Visitors have a working internet connection; offline use is out of scope and is
  handled as an ordinary retrieval failure.
- Advice is presented in the language the external service returns it in; translation and
  localisation are out of scope.
- The external advice service is a third-party dependency. Its availability, rate limits,
  and content are outside the project's control, which is why the failure path is a
  first-class requirement rather than an afterthought.
