# Phase 0 Research: Advice Generator

**Date**: 2026-09-21 | **Plan**: [plan.md](./plan.md)

All values below were read from the project's Figma file through the Figma Desktop MCP, or
observed by calling the live Advice Slip endpoint. Nothing here is inferred from the starter
HTML or from the exported images, per Principle I.

No `NEEDS CLARIFICATION` items remain.

---

## D1. Design tokens

**Decision**: Declare the full token set once in `src/styles/variables.css` as custom
properties, and reference them everywhere else.

**Rationale**: Principle IV requires colours, spacing and typography to be parameterized in
a single file. The Figma Design System page already defines exactly these tokens, so the
variables file is a transcription rather than an invention.

| Token | Value | Used for |
|-------|-------|----------|
| `blue-950` | `#202733` | Page background |
| `blue-900` | `#313a48` | Card background |
| `blue-600` | `#4f5d74` | Divider rules |
| `blue-200` | `#cee3e9` | Quote text, divider glyph |
| `green-300` | `#53ffaa` | Heading text, dice button fill, hover glow |
| spacing scale | `0, 8, 16, 24, 32, 40, 64, 128` | All gaps and padding |

**Alternatives considered**: Reading the palette from `specs.md` instead. Rejected — the
`specs.md` palette is given in HSL and matches these hex values exactly, but Principle I
makes Figma authoritative, and the Figma file additionally carries the spacing scale that
`specs.md` omits.

---

## D2. Typography

**Decision**: Manrope, weight 800 only, in three presets.

| Preset | Size | Line height | Letter spacing | Applied to |
|--------|------|-------------|----------------|------------|
| Preset 3 | 13px | 1.35 | `4px` | `ADVICE #117` heading, uppercase |
| Preset 2 | 24px | 1.35 | `-0.3px` | Quote — **mobile only** |
| Preset 1 | 28px | 1.35 | `-0.3px` | Quote — tablet and desktop |

**Heading format**: the design renders the heading literally as `ADVICE #117` — uppercase,
no space between `#` and the number. This resolves the one open question carried by the
specification.

**⚠ Conflict with `specs.md`**: the style guide records a single quote size, 28px. The Figma
designs use **24px on mobile** and 28px from tablet upward. Principle I makes Figma
authoritative, so the plan follows Figma. This is a detected fault in the specification —
under Principle II it needs a `specs.md` amendment recording both sizes, and that amendment
should be made before implementation rather than after.

**Alternatives considered**: Using 28px at every width to match `specs.md` literally.
Rejected — it contradicts the authoritative design, and at 375px a 28px quote overflows the
296px content column.

---

## D3. Card and layout geometry

**Decision**: Two layouts, switching at 768px.

| Property | Mobile (<768px) | Tablet / Desktop (≥768px) |
|----------|-----------------|---------------------------|
| Card width | `343px` (16px side margin at 375px) | `540px`, centred |
| Card corner radius | `10px` | `15px` |
| Horizontal padding | `24px` | `48px` |
| Content column | `296px` | `444px` |
| Gap, heading → quote | `16px` | `24px` |
| Gap between sections | `32px` | `40px` |
| Divider rule width | `122px` each side | `196px` each side |

Card shadow is identical at both sizes: `30px 50px 80px 0 rgba(0, 0, 0, 0.1)`.

The card width is expressed as a maximum with a fluid fallback rather than a fixed pixel
value, so the layout still holds at 320px as SC-004 requires.

**Rationale**: The Figma frames are 375px, 768px and 1440px. The tablet and desktop frames
are geometrically identical — same 540px card, same internal spacing — so they need one set
of rules, not two. Only the mobile frame differs.

**Alternatives considered**: Three breakpoints, one per Figma frame. Rejected — the tablet
and desktop cards are identical, so a third breakpoint would add a rule that changes nothing.

---

## D4. The divider

**Decision**: Use the existing `images/pattern-divider-mobile.svg` and
`images/pattern-divider-desktop.svg`, swapped at the 768px breakpoint.

**Rationale**: CLAUDE.md states the SVGs in `/images` are already optimized and are to be
preferred over re-exporting. The two files differ only in the width of the rules, which is
exactly the mobile/desktop difference recorded in D3.

**Alternatives considered**: Reproducing the divider in CSS as two 1px rules plus two 6×16
rounded glyphs, which is what the Figma node tree describes. Rejected — it is more markup
for an identical result, and it ignores assets the project already ships.

---

## D5. The dice button

**Decision**: Build the control as a CSS circle with the glyph inside it — a 64px round
`<button>` filled with `green-300`, containing `images/icon-dice.svg` at 24px. Position it
centred on the card's bottom edge, offset by half its own height.

**Rationale**: Figma exports the button as a single flattened 64px image, but
`images/icon-dice.svg` is the glyph alone. Composing the circle in CSS keeps the control a
real, focusable `<button>` — which FR-014 requires — instead of an image that has to have
interactivity bolted on.

**Alternatives considered**: Using the flattened Figma export. Rejected twice over: the
Figma asset URLs are served from an ephemeral `localhost` asset server and would not survive
the session, and a flattened image cannot carry a focus ring or a hover transition.

---

## D6. Hover treatment

**Decision**: On hover and on keyboard focus, apply a green glow —
`box-shadow: 0 0 40px 0 <green-300>` — to the dice button.

**Rationale**: Read from the `Desktop - Active` frame, where the button's glow layer extends
40px beyond each edge of the 64px control. Applying the same treatment on `:focus-visible`,
not only `:hover`, satisfies FR-014 without inventing a separate focus style.

**Alternatives considered**: A brightness or scale change on hover. Rejected — the design
specifies a glow, and Principle I does not leave this to taste.

---

## D7. Cache-busting strategy

**Decision**: Append a unique query parameter to every request **and** pass
`cache: 'no-store'` to `fetch`.

**Rationale**: The endpoint returns two conflicting `Cache-Control` headers, the stricter
being `max-age=600, private, must-revalidate`. Without intervention a browser may serve the
same slip for ten minutes, and the dice would appear not to work — the exact failure FR-004
and SC-002 exist to prevent. The two mechanisms are belt and braces: `no-store` covers the
HTTP cache, the unique parameter defeats any intermediate that ignores it.

**Verification note**: calling the endpoint with `curl` returns a different slip each time,
but that proves nothing about browsers, because `curl` does not implement an HTTP cache.
The headers, not the `curl` behaviour, are the evidence here.

**Alternatives considered**: Relying on `no-store` alone. Rejected as a single point of
failure for the one behaviour most likely to be judged broken by a reviewer.

---

## D8. Deciding whether a response succeeded

**Decision**: Treat a response as successful only when the parsed body contains
`slip.advice` as a non-empty string. Never branch on `response.ok` alone.

**Rationale**: Observed directly — requesting a non-existent slip returns
`{"message": {"type": "error", "text": "Advice slip not found."}}` with **HTTP status 200**.
A conventional `if (!response.ok) throw` never fires, and the UI would render `undefined`.
An unknown path returns an HTML error page instead of JSON, so `response.json()` can also
throw a parse error. FR-006 encodes this rule.

**Alternatives considered**: Trusting the status code, the conventional approach. Rejected
on direct evidence that it is wrong for this service.

---

## D9. Request state and rapid clicking

**Decision**: Model the request as an explicit state machine in `useAdvice`, keep the
previously displayed slip while a new one is in flight, and ignore activations while a
request is already running.

**Rationale**: FR-005 requires the previous advice to stay visible and the control to be
visibly unavailable during a request, which together also prevent the overlapping-request
edge case — a disabled control cannot start a second request. This is simpler and more
honest than cancelling in-flight requests, and it makes the "card ends on the most recent
result" edge case trivially true.

**Alternatives considered**: Aborting the previous request with an `AbortController` on each
new click. Rejected as unnecessary complexity under Principle V, since the control is
disabled for the whole duration anyway.

---

## D10. Announcing new advice to assistive technology

**Decision**: Mark the region containing the heading and quote as a polite live region.

**Rationale**: FR-015 requires a visitor who is not watching the screen to learn that new
advice arrived. The content changes in place with no navigation and no focus move, so
without a live region the change is silent. Polite rather than assertive, because the change
is user-initiated and not urgent.

**Alternatives considered**: Moving focus to the quote after each update. Rejected — it
steals focus from the dice button, which makes repeated clicking hostile for keyboard users.
