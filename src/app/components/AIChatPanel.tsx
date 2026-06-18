/**
 * AIChatPanel.tsx
 *
 * Premium interactive chat panel that slides in below a question when
 * a student answers incorrectly. Uses the 21st.dev auto-resize textarea
 * pattern with CornerRightUp send button and typing indicator.
 */

import React, { useCallback, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CornerRightUp, Trash2, Loader2, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../hooks/useHintSystem';

interface AIChatPanelProps {
  visible: boolean;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onClear: () => void;
}

// Auto-resizing textarea hook (21st.dev pattern)
function useAutoResizeTextarea({
  minHeight = 56,
  maxHeight = 200,
}: {
  minHeight?: number;
  maxHeight?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const adjustHeight = useCallback(
    (reset = false) => {
      const el = textareaRef.current;
      if (!el) return;
      if (reset) {
        el.style.height = 'auto';
      } else {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
      }
      const currentHeight = parseInt(el.style.height);
      if (currentHeight > maxHeight) {
        el.style.height = maxHeight + 'px';
        el.style.overflowY = 'auto';
      } else {
        el.style.overflowY = 'hidden';
      }
      if (currentHeight < minHeight) {
        el.style.height = minHeight + 'px';
      }
    },
    [minHeight, maxHeight]
  );
  return { textareaRef, adjustHeight };
}

const t = {
  en: {
    title: 'AI Tutor',
    thinking: 'AI is thinking...',
    placeholder: 'Ask a follow-up...',
    clear: 'Clear',
    error: 'Error',
    send: 'Send',
  },
  ar: {
    title: 'معلم الذكاء الاصطناعي',
    thinking: 'الذكاء الاصطناعي يفكر...',
    placeholder: 'اسأل سؤالاً إضافياً...',
    clear: 'مسح',
    error: 'خطأ',
    send: 'إرسال',
  },
};

export function AIChatPanel({
  visible,
  messages,
  loading,
  error,
  onSend,
  onClear,
}: AIChatPanelProps) {
  // Detect language - import lazily to avoid circular deps
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  useEffect(() => {
    const stored = localStorage.getItem('language');
    setLang(stored === 'ar' ? 'ar' : 'en');
    const handler = () => {
      const pref = localStorage.getItem('language');
      setLang(pref === 'ar' ? 'ar' : 'en');
    };
    window.addEventListener('storage', handler);
    // Also listen for custom language change events
    window.addEventListener('languagechange', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('languagechange', handler);
    };
  }, []);

  const txt = t[lang] || t.en;
  const isRTL = lang === 'ar';

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({});
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (visible && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visible, messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    adjustHeight();
  };

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim() || loading) return;
    onSend(inputValue.trim());
    setInputValue('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
    }
  }, [inputValue, loading, onSend, textareaRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter, not Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: 12, height: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="mt-5 rounded-2xl border border-amber-500/20 bg-white dark:bg-zinc-900/50 overflow-hidden backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-500/10 px-4 py-3 bg-amber-50/30 dark:bg-amber-500/5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500 dark:text-amber-400" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  {txt.title}
                </span>
                {messages.length > 0 && (
                  <span className="flex items-center justify-center h-5 min-w-[20px] rounded-full bg-amber-500/20 dark:bg-amber-500/30 px-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-300">
                    {messages.length}
                  </span>
                )}
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={onClear}
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
                >
                  <Trash2 size={12} />
                  {txt.clear}
                </button>
              )}
            </div>

            {/* Messages area */}
            <div
              className="flex flex-col gap-3 p-4 overflow-y-auto"
              style={{ maxHeight: 320 }}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {error && (
                <div className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-xs ${
                  /misconfigured|CLERK|secret/i.test(error)
                    ? 'border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300'
                    : 'border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300'
                }`}>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">{txt.error}:</span>
                    <span className="leading-relaxed">{error}</span>
                  </div>
                  {/misconfigured|CLERK|secret/i.test(error) && (
                    <a
                      href="https://dashboard.clerk.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition-colors"
                    >
                      Open Clerk Dashboard →
                    </a>
                  )}
                </div>
              )}

              {messages.length === 0 && !error && !loading && (
                <div className="py-6 text-center text-sm text-gray-500 dark:text-white/40">
                  Ask the AI tutor a question about this topic.
                </div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-amber-500/15 dark:bg-amber-500/25 text-amber-900 dark:text-amber-100 rounded-tr-md'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white/90 rounded-tl-md'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Sparkles
                            size={11}
                            className="text-amber-500 dark:text-amber-400"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            AI
                          </span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2 rounded-2xl bg-gray-100 dark:bg-white/10 px-4 py-3">
                    <Sparkles
                      size={13}
                      className="text-amber-500 dark:text-amber-400"
                    />
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500 dark:bg-amber-400 [animation-delay:0ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500 dark:bg-amber-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500 dark:bg-amber-400 [animation-delay:300ms]" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-white/50">
                      {txt.thinking}
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-amber-500/10 p-3 bg-gray-50/30 dark:bg-black/20">
              <div className="flex items-end gap-2">
                <div className="relative flex-1">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={txt.placeholder}
                    disabled={loading}
                    rows={1}
                    style={{ height: 56 }}
                    className="w-full resize-none rounded-3xl border border-gray-200 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 pr-12 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/70 outline-none transition-colors focus:border-amber-400 dark:focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 dark:focus:ring-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed scrollbar-thin"
                  />
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || loading}
                    aria-label={txt.send}
                    className="absolute end-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500 text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <CornerRightUp size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}