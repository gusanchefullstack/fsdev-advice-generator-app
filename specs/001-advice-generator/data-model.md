# Phase 1 Data Model: Advice Generator

**Date**: 2026-09-21 | **Plan**: [plan.md](./plan.md)

The application holds no persistent data. Everything below lives in memory for the lifetime
of the page and is discarded on unload, as the specification's Assumptions require.

---

## Entity: AdviceSlip

One piece of advice retrieved from the external service. This is the only domain entity.

| Field | Type | Rules |
|-------|------|-------|
| `id` | `number` | The slip's identifier. Rendered in the heading as `ADVICE #<id>`. |
| `advice` | `string` | The advice text. Rendered as the quotation. Must be non-empty. |

```ts
export interface AdviceSlip {
  id: number;
  advice: string;
}
```

**Validation rules** (from FR-006, enforced in `adviceService`):

- The parsed body MUST be a non-null object.
- `slip` MUST be present and be an object.
- `slip.advice` MUST be a string with at least one non-whitespace character.
- `slip.id` MUST be a number.
- A body failing any of these is a failed retrieval, regardless of HTTP status.

**Relationships**: none. Exactly one slip is displayed at a time. Slips are not collected,
cached, counted or persisted — there is no history and no "previous advice" feature.

---

## State: AdviceState

The request state machine held by `useAdvice`. It is a discriminated union so that
impossible combinations cannot be represented.

```ts
export type AdviceState =
  | { status: 'loading'; slip: AdviceSlip | null }
  | { status: 'ready';   slip: AdviceSlip }
  | { status: 'failed';  slip: AdviceSlip | null; message: string };
```

`slip` is carried on `loading` and `failed` deliberately: FR-005 requires previously
displayed advice to remain on screen during a request, and the failure edge case requires
the card not to go blank. `null` occurs only before the first successful retrieval.

### Transitions

| From | Event | To | Notes |
|------|-------|----|-------|
| *(initial)* | Page loads | `loading` with `slip: null` | FR-001. Retrieval starts without user action. |
| `loading` | Valid payload received | `ready` | The card shows the new slip. |
| `loading` | Retrieval fails | `failed`, keeping the previous `slip` | FR-007. Message is the friendly string. |
| `ready` | Dice activated | `loading`, keeping the current `slip` | FR-003, FR-005. Previous advice stays visible. |
| `failed` | Dice activated | `loading`, keeping any previous `slip` | FR-009. Retry is the visitor's choice. |
| `loading` | Dice activated | *(no transition)* | The control is disabled; activations are ignored. |

### Derived values

Read by the components rather than stored, so they cannot drift out of step:

- `isBusy` — `status === 'loading'`. Drives the dice button's disabled and busy states.
- `hasAdvice` — `slip !== null`. Decides whether the card shows a quote at all.

---

## Not modelled

Recorded explicitly so a later reader does not mistake these for oversights. Under Zero
Shadow Code, none of them may be built without a specification change:

- No advice history or "previous slip" navigation.
- No favourites, sharing, or copy-to-clipboard.
- No retry counter, backoff schedule, or automatic retry (FR-009).
- No offline queue or cached last-known advice — offline is an ordinary failure.
- No user preferences, settings, or theme state.
