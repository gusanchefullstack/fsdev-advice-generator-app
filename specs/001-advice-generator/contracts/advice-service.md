# Contract: Advice Service (external)

**Source of truth**: `my-sdd-docs/specs.md` § Domain Rules and Business Logic. This file
restates the contract in implementation terms; where the two disagree, `specs.md` wins.

---

## Request

```text
GET https://api.adviceslip.com/advice
```

Every request MUST defeat the HTTP cache (FR-004, research D7):

- pass `cache: 'no-store'` to `fetch`, **and**
- append a unique query parameter, e.g. `?t=<epoch-milliseconds>`.

No authentication, no headers, no request body.

## Success response

HTTP 200 with a JSON body:

```json
{ "slip": { "id": 193, "advice": "Value the people in your life." } }
```

## Failure responses

The service does not use status codes to signal failure. All of the following are failures:

| Condition | Observed shape |
|-----------|----------------|
| Service-level error | HTTP **200** with `{ "message": { "type": "error", "text": "..." } }` |
| Unknown path | HTTP 404 with an **HTML** body — `response.json()` throws |
| Network unreachable | `fetch` rejects |
| Malformed body | `response.json()` throws |

## Service interface

```ts
export async function fetchAdvice(): Promise<AdviceSlip>;
```

**Behaviour**:

- Resolves with a validated `AdviceSlip`.
- Rejects with a plain `Error` for every failure above. The rejection reason is for
  developers and MUST NOT reach the UI (FR-008); the hook replaces it with the friendly
  message.
- Applies the validation rules in [data-model.md](../data-model.md#entity-adviceslip)
  before resolving.
- MUST NOT branch on `response.ok` alone (FR-006, research D8).
- MUST NOT retry internally (FR-009).

## Required test cases

| Case | Expectation |
|------|-------------|
| Valid payload | Resolves with `{ id, advice }` |
| `message` payload at HTTP 200 | Rejects |
| `slip` present but `advice` empty or whitespace | Rejects |
| `slip` present but `advice` not a string | Rejects |
| Body is not JSON | Rejects, does not throw unhandled |
| `fetch` rejects | Rejects |
| Two consecutive calls | Both carry distinct cache-busting parameters |
| Any call | Issued with `cache: 'no-store'` |
