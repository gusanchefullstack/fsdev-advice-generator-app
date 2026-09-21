import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAdvice } from '../services/adviceService';
import type { AdviceState } from '../types/advice';

/** The single message shown for every failure path. */
export const FAILURE_MESSAGE = "Couldn't fetch advice right now. Please try again.";

export function useAdvice(): { state: AdviceState; requestAdvice: () => void } {
  const [state, setState] = useState<AdviceState>({ status: 'loading', slip: null });

  // Guards against stacked requests. A ref rather than state because the check
  // must be synchronous — three fast clicks must not each see a stale value.
  const isRequestInFlight = useRef(false);

  const requestAdvice = useCallback(() => {
    if (isRequestInFlight.current) return;
    isRequestInFlight.current = true;

    // Carry the current slip forward so the card keeps showing it while the
    // new one is on its way.
    setState((previous) => ({ status: 'loading', slip: previous.slip }));

    fetchAdvice()
      .then((slip) => setState({ status: 'ready', slip }))
      .catch(() =>
        setState((previous) => ({
          status: 'failed',
          slip: previous.slip,
          message: FAILURE_MESSAGE,
        })),
      )
      .finally(() => {
        isRequestInFlight.current = false;
      });
  }, []);

  useEffect(() => {
    requestAdvice();
  }, [requestAdvice]);

  return { state, requestAdvice };
}
