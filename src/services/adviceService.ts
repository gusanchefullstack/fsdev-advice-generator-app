import type { AdviceSlip } from '../types/advice';

const ENDPOINT = 'https://api.adviceslip.com/advice';

/*
 * Counter combined with the clock for cache-busting. Date.now() alone is not
 * enough: several clicks can land in the same millisecond and would produce an
 * identical URL, which is exactly the repeat we are trying to avoid.
 */
let requestCounter = 0;

/**
 * The API answers with HTTP 200 even when it is reporting a failure, so the
 * payload is the only reliable signal. Anything that is not a well-formed slip
 * is treated as a failed retrieval.
 */
function toAdviceSlip(body: unknown): AdviceSlip | null {
  if (typeof body !== 'object' || body === null) return null;

  const { slip } = body as { slip?: unknown };
  if (typeof slip !== 'object' || slip === null) return null;

  const { id, advice } = slip as { id?: unknown; advice?: unknown };
  if (typeof id !== 'number' || !Number.isFinite(id)) return null;
  if (typeof advice !== 'string' || advice.trim() === '') return null;

  return { id, advice };
}

/**
 * Retrieve one random advice slip.
 *
 * Rejects with a plain Error on every failure path. The reason is for
 * developers only — the UI never shows it (constitution, Principle VI).
 */
export async function fetchAdvice(): Promise<AdviceSlip> {
  requestCounter += 1;
  const url = `${ENDPOINT}?t=${Date.now()}-${requestCounter}`;

  // no-store covers the HTTP cache; the unique parameter covers anything that
  // ignores it. The endpoint sends max-age=600, so without both a browser can
  // serve the same slip for ten minutes and the dice looks broken.
  const response = await fetch(url, { cache: 'no-store' });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error(`Advice response was not JSON (status ${response.status})`);
  }

  const slip = toAdviceSlip(body);
  if (slip === null) {
    throw new Error(`Advice response did not contain a usable slip (status ${response.status})`);
  }

  return slip;
}
