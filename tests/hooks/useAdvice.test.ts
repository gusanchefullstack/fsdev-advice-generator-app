import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAdvice, FAILURE_MESSAGE } from '../../src/hooks/useAdvice';
import * as adviceService from '../../src/services/adviceService';

const slip = { id: 117, advice: 'It is easy to sit up and take notice.' };
const otherSlip = { id: 42, advice: 'Value the people in your life.' };

describe('useAdvice', () => {
  beforeEach(() => {
    vi.spyOn(adviceService, 'fetchAdvice');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retrieves advice on mount with no user action', async () => {
    vi.mocked(adviceService.fetchAdvice).mockResolvedValue(slip);

    const { result } = renderHook(() => useAdvice());

    expect(result.current.state.status).toBe('loading');
    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    expect(result.current.state.slip).toEqual(slip);
    expect(adviceService.fetchAdvice).toHaveBeenCalledTimes(1);
  });

  it('moves to failed with the friendly message when retrieval rejects', async () => {
    vi.mocked(adviceService.fetchAdvice).mockRejectedValue(new Error('boom: internal detail'));

    const { result } = renderHook(() => useAdvice());

    await waitFor(() => expect(result.current.state.status).toBe('failed'));
    const state = result.current.state;
    if (state.status !== 'failed') throw new Error('expected failed');
    expect(state.message).toBe(FAILURE_MESSAGE);
    // The underlying error must never escape the hook.
    expect(state.message).not.toContain('boom');
  });

  it('keeps the previous slip visible while a new request is in flight', async () => {
    vi.mocked(adviceService.fetchAdvice).mockResolvedValue(slip);
    const { result } = renderHook(() => useAdvice());
    await waitFor(() => expect(result.current.state.status).toBe('ready'));

    let resolveSecond: (value: typeof otherSlip) => void = () => {};
    vi.mocked(adviceService.fetchAdvice).mockReturnValue(
      new Promise((resolve) => {
        resolveSecond = resolve;
      }),
    );

    act(() => result.current.requestAdvice());

    expect(result.current.state.status).toBe('loading');
    expect(result.current.state.slip).toEqual(slip);

    await act(async () => {
      resolveSecond(otherSlip);
    });
    await waitFor(() => expect(result.current.state.slip).toEqual(otherSlip));
  });

  it('keeps the previous slip visible after a failure', async () => {
    vi.mocked(adviceService.fetchAdvice).mockResolvedValue(slip);
    const { result } = renderHook(() => useAdvice());
    await waitFor(() => expect(result.current.state.status).toBe('ready'));

    vi.mocked(adviceService.fetchAdvice).mockRejectedValue(new Error('offline'));
    await act(async () => result.current.requestAdvice());

    await waitFor(() => expect(result.current.state.status).toBe('failed'));
    expect(result.current.state.slip).toEqual(slip);
  });

  it('ignores activations while a request is already in flight', async () => {
    vi.mocked(adviceService.fetchAdvice).mockResolvedValue(slip);
    const { result } = renderHook(() => useAdvice());
    await waitFor(() => expect(result.current.state.status).toBe('ready'));

    vi.mocked(adviceService.fetchAdvice).mockReturnValue(new Promise(() => {}));

    act(() => result.current.requestAdvice());
    act(() => result.current.requestAdvice());
    act(() => result.current.requestAdvice());

    // One on mount, one for the first activation; the rest are ignored.
    expect(adviceService.fetchAdvice).toHaveBeenCalledTimes(2);
  });

  it('retries from the failed state when asked, and never on its own', async () => {
    vi.mocked(adviceService.fetchAdvice).mockRejectedValue(new Error('offline'));
    const { result } = renderHook(() => useAdvice());
    await waitFor(() => expect(result.current.state.status).toBe('failed'));

    expect(adviceService.fetchAdvice).toHaveBeenCalledTimes(1);

    vi.mocked(adviceService.fetchAdvice).mockResolvedValue(otherSlip);
    await act(async () => result.current.requestAdvice());

    await waitFor(() => expect(result.current.state.status).toBe('ready'));
    expect(adviceService.fetchAdvice).toHaveBeenCalledTimes(2);
  });
});
