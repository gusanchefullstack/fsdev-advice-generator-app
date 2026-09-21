import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchAdvice } from '../../src/services/adviceService';

/** Build a Response-like stub whose json() resolves to the given body. */
function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

describe('fetchAdvice', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('resolves with the slip when the payload is valid', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ slip: { id: 193, advice: 'Value the people in your life.' } }),
    );

    await expect(fetchAdvice()).resolves.toEqual({
      id: 193,
      advice: 'Value the people in your life.',
    });
  });

  it('rejects when the service reports an error at HTTP 200', async () => {
    // The Advice Slip API signals failure in the body, not the status code.
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ message: { type: 'error', text: 'Advice slip not found.' } }),
    );

    await expect(fetchAdvice()).rejects.toThrow();
  });

  it('rejects when advice is an empty string', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ slip: { id: 1, advice: '' } }));
    await expect(fetchAdvice()).rejects.toThrow();
  });

  it('rejects when advice is only whitespace', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ slip: { id: 1, advice: '   ' } }));
    await expect(fetchAdvice()).rejects.toThrow();
  });

  it('rejects when advice is not a string', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ slip: { id: 1, advice: 42 } }));
    await expect(fetchAdvice()).rejects.toThrow();
  });

  it('rejects when id is not a number', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ slip: { id: 'x', advice: 'hi' } }));
    await expect(fetchAdvice()).rejects.toThrow();
  });

  it('rejects when the body is null', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(null));
    await expect(fetchAdvice()).rejects.toThrow();
  });

  it('rejects when the body is not JSON, without throwing unhandled', async () => {
    // An unknown path returns an HTML error page, so json() throws.
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => {
        throw new SyntaxError('Unexpected token < in JSON');
      },
    } as unknown as Response);

    await expect(fetchAdvice()).rejects.toThrow();
  });

  it('rejects when the network request itself fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(fetchAdvice()).rejects.toThrow();
  });

  it('requests with cache: no-store', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ slip: { id: 1, advice: 'hi' } }));
    await fetchAdvice();

    const init = vi.mocked(fetch).mock.calls[0][1];
    expect(init).toMatchObject({ cache: 'no-store' });
  });

  it('gives every request a distinct cache-busting parameter', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ slip: { id: 1, advice: 'hi' } }));

    const urls: string[] = [];
    for (let i = 0; i < 10; i += 1) {
      await fetchAdvice();
      urls.push(String(vi.mocked(fetch).mock.calls[i][0]));
    }

    expect(new Set(urls).size).toBe(10);
    urls.forEach((url) => expect(url).toContain('api.adviceslip.com/advice'));
  });
});
