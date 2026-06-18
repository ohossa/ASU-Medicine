/**
 * AIChatPanel.tsx
 *
 * Premium interactive chat panel that slides in below a question when
 * a student answers incorrectly. Uses the 21st.dev auto-resize textarea
 * pattern with CornerRightUp send button and typing indicator.
 */

import React, { useCallback, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CornerRightUp, Loader2, Sparkles } from 'lucide-react';
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
  minHeight = 48,
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
      textareaRef.current.style.height = '48px';
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
          <div className="mt-4 rounded-2xl border border-white/10 dark:border-white/5 bg-white/60 dark:bg-zinc-900/40 overflow-hidden backdrop-blur-xl shadow-sm">
            {/* Messages area - only renders when there are messages */}
            {(messages.length > 0 || loading || error) && (
              <div
                className="flex flex-col gap-2.5 px-4 pt-4 pb-2 overflow-y-auto"
                style={{ maxHeight: 300 }}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {/* Minimal header */}
                {messages.length > 0 && (
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-gray-400 dark:text-white/30 uppercase tracking-wider">
                      AI Tutor
                    </span>
                    <button
                      type="button"
                      onClick={onClear}
                      className="rounded-md px-2 py-1 text-[11px] text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {error && (
                  <div className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-xs ${
                    /misconfigured|CLERK|secret/i.test(error)
                      ? 'border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-gray-700 dark:text-white/70'
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
                        className="mt-0.5 rounded-md bg-gray-900/10 dark:bg-white/10 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:text-white/70 hover:bg-gray-900/15 dark:hover:bg-white/15 transition-colors"
                      >
                        Open Clerk Dashboard →
                      </a>
                    )}
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
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gray-900 dark:bg-white/15 text-white dark:text-white'
                            : 'bg-gray-100 dark:bg-white/[0.07] text-gray-800 dark:text-white/85'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Sparkles
                              size={9}
                              className="text-gray-400 dark:text-white/40"
                            />
                            <span className="text-[9px] font-medium uppercase tracking-wider text-gray-400 dark:text-white/40">
                              AI
                            </span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">
                          {/* Simple markdown bold parser: **text** → <strong>text</strong> */}
                          {(() => {
                            const parts = msg.content.split(/(\*\*.*?\*\*)/g);
                            return parts.map((part, i) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={i}>{part.slice(2, -2)}</strong>;
                              }
                              return part;
                            });
                          })()}
                        </p>
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
                    <div className="flex items-center gap-2 rounded-2xl bg-gray-100 dark:bg-white/[0.07] px-4 py-3">
                      <Sparkles
                        size={10}
                        className="text-gray-400 dark:text-white/40"
                      />
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-white/40 [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-white/40 [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-white/40 [animation-delay:300ms]" />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-white/50">
                        {txt.thinking}
                      </span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input area */}
            <div className="p-3">
              <div className="relative flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={messages.length > 0 ? 'Ask a follow-up...' : 'Ask AI Tutor...'}
                  disabled={loading}
                  rows={1}
                  style={{ height: 48 }}
                  className="w-full resize-none rounded-3xl border border-gray-200/60 dark:border-white/5 bg-gray-50 dark:bg-white/[0.03] px-4 py-3 pr-11 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/50 outline-none transition-colors focus:border-gray-300 dark:focus:border-white/20 focus:bg-white dark:focus:bg-white/[0.05] focus:ring-2 focus:ring-gray-900/5 dark:focus:ring-white/10 disabled:opacity-50 disabled:cursor-not-allowed scrollbar-thin"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || loading}
                  aria-label={txt.send}
                  className="absolute end-2 bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 dark:bg-white/15 hover:bg-gray-800 dark:hover:bg-white/20 text-white dark:text-white/90 transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:scale-105 active:scale-95"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}