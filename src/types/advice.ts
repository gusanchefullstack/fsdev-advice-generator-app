/** One piece of advice retrieved from the Advice Slip API. */
export interface AdviceSlip {
  id: number;
  advice: string;
}

/**
 * The request state machine.
 *
 * `slip` is carried through `loading` and `failed` on purpose: the previously
 * displayed advice must stay on screen while a new request is in flight, and
 * the card must never go blank after a failure. It is null only before the
 * first successful retrieval.
 */
export type AdviceState =
  | { status: 'loading'; slip: AdviceSlip | null }
  | { status: 'ready'; slip: AdviceSlip }
  | { status: 'failed'; slip: AdviceSlip | null; message: string };
