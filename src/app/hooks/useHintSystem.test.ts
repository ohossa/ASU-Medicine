import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useHintSystem } from './useHintSystem';

describe('useHintSystem (chat interface)', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  interface MakeProps {
    question: Parameters<typeof useHintSystem>[0]['question'];
    userAnswer?: unknown;
    correctAnswer?: string;
    studentWrongAnswer?: string;
    getToken: () => Promise<string | null>;
    enabled?: boolean;
  }

  const makeProps = (overrides: Partial<MakeProps> = {}) => ({
    question: {
      id: 1,
      text: 'What is CN VI?',
      type: 'mcq',
      options: ['Optic', 'Oculomotor', 'Trochlear', 'Abducens'],
      correctIndex: 3,
      subjectColor: 'clinical',
      explanation: 'CN VI is Abducens',
    },
    userAnswer: 1,
    correctAnswer: 'Abducens',
    studentWrongAnswer: 'Oculomotor',
    getToken: async () => 'mock-token',
    enabled: true,
    ...overrides,
  });

  it('sends user message and receives AI response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Think about eye abduction.' }),
    });

    const { result } = renderHook(() => useHintSystem(makeProps()));

    await act(async () => {
      result.current.sendMessage('What hint can you give me?');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.messages).toHaveLength(2); // user + assistant
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[0].content).toBe('What hint can you give me?');
    expect(result.current.messages[1].role).toBe('assistant');
    expect(result.current.messages[1].content).toBe('Think about eye abduction.');
  });

  it('does nothing when sending empty message', async () => {
    const { result } = renderHook(() => useHintSystem(makeProps()));

    await act(async () => {
      result.current.sendMessage('');
    });

    // Empty message is blocked - student must type something
    expect(result.current.messages).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does nothing when sending whitespace-only message', async () => {
    const { result } = renderHook(() => useHintSystem(makeProps()));

    await act(async () => {
      result.current.sendMessage('   ');
    });

    // Whitespace-only trims to empty string and is blocked - student must type something
    expect(result.current.messages).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sets error when no token available', async () => {
    const { result } = renderHook(() =>
      useHintSystem(makeProps({ getToken: async () => null }))
    );

    await act(async () => {
      result.current.sendMessage('Hello');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Sign in to chat with AI tutor.');
    // User message is still added even without token
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Hello');
  });

  it('shows rate-limit message on 429', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: 'Rate limited' }),
    });

    const { result } = renderHook(() => useHintSystem(makeProps()));

    await act(async () => {
      result.current.sendMessage('Fast question');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    // Should have user message + AI rate limit message
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[1].content).toContain('too fast');
  });

  it('preserves message history across sends', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'First response' }),
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Second response' }),
    });

    const { result } = renderHook(() => useHintSystem(makeProps()));

    await act(async () => {
      result.current.sendMessage('First message');
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.sendMessage('Second message');
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.messages).toHaveLength(4); // 2 user + 2 assistant
    expect(result.current.messages[0].content).toBe('First message');
    expect(result.current.messages[1].content).toBe('First response');
    expect(result.current.messages[2].content).toBe('Second message');
    expect(result.current.messages[3].content).toBe('Second response');
  });

  it('sets error when fetch fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useHintSystem(makeProps()));

    await act(async () => {
      result.current.sendMessage('Hello');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network error');
    expect(result.current.messages).toHaveLength(1); // user message only
  });

  it('does not send when disabled', async () => {
    const { result } = renderHook(() =>
      useHintSystem(makeProps({ enabled: false }))
    );

    await act(async () => {
      result.current.sendMessage('Hello');
    });

    expect(result.current.messages).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('clearChat removes all messages and error', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Response' }),
    });

    const { result } = renderHook(() => useHintSystem(makeProps()));

    await act(async () => {
      result.current.sendMessage('Hello');
    });
    await waitFor(() => expect(result.current.messages.length).toBeGreaterThan(0));

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  it('sends correct API payload', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Hint' }),
    });

    const { result } = renderHook(() =>
      useHintSystem(
        makeProps({
          question: {
            id: 'q1',
            text: 'Test question',
            type: 'mcq',
            options: ['A', 'B', 'C'],
            correctIndex: 2,
            explanation: 'Because...',
            keyConcept: 'Important',
            subjectColor: 'anatomy',
            chapterTitle: 'Neuroanatomy',
          },
          userAnswer: 0,
          correctAnswer: 'C',
          studentWrongAnswer: 'A',
        })
      )
    );

    await act(async () => {
      result.current.sendMessage('Give me a hint');
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith('/api/hint', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer mock-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionText: 'Test question',
        options: ['A', 'B', 'C'],
        correctIndex: 2,
        explanation: 'Because...',
        keyConcept: 'Important',
        subject: 'anatomy',
        chapter: 'Neuroanatomy',
        previousAttempts: 1,
        userAnswer: '0',
        studentWrongAnswer: 'A',
        correctAnswer: 'C',
        messages: [
          { role: 'user', content: 'Give me a hint' },
        ],
      }),
    });
  });

  it('handles missing optional fields gracefully', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: 'Response' }),
    });

    const { result } = renderHook(() =>
      useHintSystem({
        question: { id: 1, text: 'Simple question', type: 'mcq' },
        getToken: async () => 'token',
        enabled: true,
      })
    );

    await act(async () => {
      result.current.sendMessage('Hello');
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.messages).toHaveLength(2);
  });
});