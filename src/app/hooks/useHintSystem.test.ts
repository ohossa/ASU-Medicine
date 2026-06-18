import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useHintSystem } from './useHintSystem';

describe('useHintSystem', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  const makeProps = (overrides: any = {}) => ({
    question: { id: 1, text: 'What is CN VI?', type: 'mcq', options: ['A', 'B'], correctIndex: 1, subjectColor: 'clinical', explanation: 'CN VI is Abducens' },
    getToken: async () => 'mock-token',
    enabled: true,
    ...overrides,
  });

  it('does not fetch when previousAttempts < 2', async () => {
    const { result } = renderHook(() => useHintSystem(makeProps()));
    await act(async () => {
      result.current.fetchHint(1);
    });
    await vi.advanceTimersByTimeAsync(500);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.hint).toBeNull();
  });

  it('fetches hint when previousAttempts >= 2', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hint: 'Think about eye movement.', source: 'openai' }),
    });

    const { result } = renderHook(() => useHintSystem(makeProps()));
    await act(async () => {
      result.current.fetchHint(2);
    });
    await vi.advanceTimersByTimeAsync(500);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).toHaveBeenCalled();
    expect(result.current.hint).toEqual({ text: 'Think about eye movement.', source: 'openai' });
  });

  it('shows rate-limit message on 429', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: 'Rate limited' }),
    });

    const { result } = renderHook(() => useHintSystem(makeProps()));
    await act(async () => {
      result.current.fetchHint(2);
    });
    await vi.advanceTimersByTimeAsync(500);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hint?.text).toContain('too quickly');
    expect(result.current.hint?.source).toBe('static');
  });

  it('caches hints and returns cached on second call', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hint: 'Cached hint', source: 'static' }),
    });

    const { result } = renderHook(() => useHintSystem(makeProps()));
    await act(async () => {
      result.current.fetchHint(2);
    });
    await vi.advanceTimersByTimeAsync(500);
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.fetchHint(3);
    });
    await vi.advanceTimersByTimeAsync(500);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.hint?.text).toBe('Cached hint');
  });

  it('sets error when fetch fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useHintSystem(makeProps()));
    await act(async () => {
      result.current.fetchHint(2);
    });
    await vi.advanceTimersByTimeAsync(500);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toContain('Network error');
  });

  it('does not fetch when disabled', async () => {
    const { result } = renderHook(() => useHintSystem(makeProps({ enabled: false })));
    await act(async () => {
      result.current.fetchHint(2);
    });
    await vi.advanceTimersByTimeAsync(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('clearHint resets state', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ hint: 'A hint', source: 'static' }),
    });

    const { result } = renderHook(() => useHintSystem(makeProps()));
    await act(async () => {
      result.current.fetchHint(2);
    });
    await vi.advanceTimersByTimeAsync(500);
    await waitFor(() => expect(result.current.hint).not.toBeNull());

    act(() => {
      result.current.clearHint();
    });

    expect(result.current.hint).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
