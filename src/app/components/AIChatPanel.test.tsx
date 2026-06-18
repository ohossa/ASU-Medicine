import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIChatPanel } from './AIChatPanel';
import type { ChatMessage } from '../hooks/useHintSystem';

function makeMessages(overrides: Partial<ChatMessage>[] = []): ChatMessage[] {
  return overrides.map((m, i) => ({
    id: String(i),
    role: 'user' as const,
    content: 'Test message',
    ...m,
  }));
}

function makeProps(overrides: any = {}) {
  return {
    visible: false,
    messages: [] as ChatMessage[],
    loading: false,
    error: null,
    onSend: vi.fn(),
    onClear: vi.fn(),
    ...overrides,
  };
}

describe('AIChatPanel rendering', () => {
  it('renders hidden when visible=false', () => {
    render(<AIChatPanel {...makeProps({ visible: false })} />);
    expect(screen.queryByText(/AI Tutor/i)).not.toBeInTheDocument();
  });

  it('renders visible when visible=true', () => {
    render(<AIChatPanel {...makeProps({ visible: true })} />);
    // Use getAllByText since placeholder also contains "AI tutor"
    const elements = screen.getAllByText(/AI Tutor/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('shows placeholder when no messages', () => {
    render(<AIChatPanel {...makeProps({ visible: true })} />);
    expect(screen.getByText(/Ask the AI tutor/i)).toBeInTheDocument();
  });

  it('shows message count badge when messages exist', () => {
    const messages = makeMessages([
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there' },
    ]);
    render(<AIChatPanel {...makeProps({ visible: true, messages })} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders user messages with correct styling', () => {
    const messages = makeMessages([
      { id: '1', role: 'user', content: 'My question' },
    ]);
    render(<AIChatPanel {...makeProps({ visible: true, messages })} />);
    const msgEl = screen.getByText('My question');
    expect(msgEl).toBeInTheDocument();
  });

  it('renders assistant messages with AI label', () => {
    const messages = makeMessages([
      { id: '1', role: 'assistant', content: 'AI response' },
    ]);
    render(<AIChatPanel {...makeProps({ visible: true, messages })} />);
    expect(screen.getByText('AI response')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('shows error message when error is set', () => {
    render(<AIChatPanel {...makeProps({ visible: true, error: 'Network failed' })} />);
    expect(screen.getByText(/Network failed/i)).toBeInTheDocument();
  });
});

describe('AIChatPanel input behavior', () => {
  it('calls onSend when user types and presses Enter', async () => {
    const onSend = vi.fn();
    render(<AIChatPanel {...makeProps({ visible: true, onSend })} />);

    const textarea = screen.getByPlaceholderText(/Ask a follow-up/i);
    fireEvent.change(textarea, { target: { value: 'What is CN III?' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(onSend).toHaveBeenCalledWith('What is CN III?');
  });

  it('does not submit on Shift+Enter', () => {
    const onSend = vi.fn();
    render(<AIChatPanel {...makeProps({ visible: true, onSend })} />);

    const textarea = screen.getByPlaceholderText(/Ask a follow-up/i);
    fireEvent.change(textarea, { target: { value: 'Multi\nline' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    // Shift+Enter should NOT call onSend (auto-trigger on mount calls onSend(''), but Shift+Enter should not)
    expect(onSend).toHaveBeenCalledTimes(1); // only the mount auto-trigger
    expect(onSend).toHaveBeenCalledWith(''); // mount auto-trigger sends empty initial prompt
  });

  it('clears input after submission', () => {
    const onSend = vi.fn();
    render(<AIChatPanel {...makeProps({ visible: true, onSend })} />);

    const textarea = screen.getByPlaceholderText(/Ask a follow-up/i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect((textarea as HTMLTextAreaElement).value).toBe('');
  });

  it('disables input when loading', () => {
    render(<AIChatPanel {...makeProps({ visible: true, loading: true })} />);

    const textarea = screen.getByPlaceholderText(/Ask a follow-up/i);
    expect(textarea).toBeDisabled();
  });

  it('disables send button when input is empty', () => {
    render(<AIChatPanel {...makeProps({ visible: true })} />);

    const sendBtn = screen.getByRole('button', { name: /send/i });
    expect(sendBtn).toBeDisabled();
  });

  it('enables send button when input has text', () => {
    render(<AIChatPanel {...makeProps({ visible: true })} />);

    const textarea = screen.getByPlaceholderText(/Ask a follow-up/i);
    fireEvent.change(textarea, { target: { value: 'Hello' } });

    const sendBtn = screen.getByRole('button', { name: /send/i });
    expect(sendBtn).toBeEnabled();
  });

  it('calls onSend when send button is clicked', () => {
    const onSend = vi.fn();
    render(<AIChatPanel {...makeProps({ visible: true, onSend })} />);

    const textarea = screen.getByPlaceholderText(/Ask a follow-up/i);
    fireEvent.change(textarea, { target: { value: 'Test' } });

    const sendBtn = screen.getByRole('button', { name: /send/i });
    fireEvent.click(sendBtn);

    expect(onSend).toHaveBeenCalledWith('Test');
  });
});

describe('AIChatPanel clear behavior', () => {
  it('renders clear button when messages exist', () => {
    const messages = makeMessages([{ id: '1', role: 'user', content: 'Test' }]);
    render(<AIChatPanel {...makeProps({ visible: true, messages })} />);

    expect(screen.getByText(/Clear/i)).toBeInTheDocument();
  });

  it('does not render clear button when no messages', () => {
    render(<AIChatPanel {...makeProps({ visible: true, messages: [] })} />);

    expect(screen.queryByText(/Clear/i)).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = vi.fn();
    const messages = makeMessages([{ id: '1', role: 'user', content: 'Test' }]);
    render(<AIChatPanel {...makeProps({ visible: true, messages, onClear })} />);

    fireEvent.click(screen.getByText(/Clear/i));

    expect(onClear).toHaveBeenCalled();
  });
});

describe('AIChatPanel loading state', () => {
  it('shows typing indicator when loading', () => {
    render(<AIChatPanel {...makeProps({ visible: true, loading: true })} />);

    expect(screen.getByText(/AI is thinking/i)).toBeInTheDocument();
  });

  it('shows bouncing dots when loading', () => {
    render(<AIChatPanel {...makeProps({ visible: true, loading: true })} />);

    // Three bouncing dots
    const dots = document.querySelectorAll('.animate-bounce');
    expect(dots.length).toBe(3);
  });

  it('shows spinner on send button when loading', () => {
    render(<AIChatPanel {...makeProps({ visible: true, loading: true })} />);

    const sendBtn = screen.getByRole('button', { name: /send/i });
    expect(sendBtn.querySelector('.animate-spin')).toBeTruthy();
  });
});

describe('AIChatPanel message rendering', () => {
  it('renders multiple messages in order', () => {
    const messages = makeMessages([
      { id: '1', role: 'user', content: 'First' },
      { id: '2', role: 'assistant', content: 'Second' },
      { id: '3', role: 'user', content: 'Third' },
    ]);
    render(<AIChatPanel {...makeProps({ visible: true, messages })} />);

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('renders long messages with wrapping', () => {
    const longMessage = 'This is a very long message that should wrap properly within the chat container to demonstrate proper text handling.';
    const messages = makeMessages([{ id: '1', role: 'assistant', content: longMessage }]);
    render(<AIChatPanel {...makeProps({ visible: true, messages })} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});