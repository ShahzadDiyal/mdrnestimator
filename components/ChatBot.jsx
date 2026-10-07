'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const AGENT_NAME = 'Ryan';

const GREETING = {
  role: 'assistant',
  content: "Hi there! Need a construction cost estimate? Share your project details and I'll help.",
};

const QUICK_REPLIES = [
  'What services do you offer?',
  'How fast is the turnaround?',
  'How much does it cost?',
  'I want a free quote',
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Allow other components (e.g. CTA buttons) to open the chat.
  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener('open-chatbot', openHandler);
    return () => window.removeEventListener('open-chatbot', openHandler);
  }, []);

  async function send(text) {
    const content = text.trim();
    if (!content || loading) return;

    const history = [...messages, { role: 'user', content }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: acc };
          return next;
        });
      }
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: 'assistant',
          content:
            (err && err.message) ||
            'Sorry — I could not reach the assistant. Please email hello@blueprintestimators.com.',
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  const showQuickReplies = messages.length <= 1;

  return (
    <>
      {/* Launcher button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Chat with us'}
        className="fixed bottom-5 right-5 z-50 group"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-brand-500/30 blur-xl group-hover:bg-brand-500/50 transition"></span>
        <span className="flex items-center gap-2 rounded-full bg-brand-500 px-4 py-3 text-white shadow-soft hover:bg-brand-600 transition">
          <span className="relative grid place-items-center h-7 w-7">
            {!open && <span className="absolute inset-0 rounded-full bg-white/30 ping-ring"></span>}
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            )}
          </span>
          <span className="hidden sm:inline text-sm font-semibold pr-1">{open ? 'Close' : 'Chat with us'}</span>
        </span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(11,27,51,0.35)] ring-1 ring-ink-900/10 flex flex-col" style={{ height: 'min(34rem, calc(100vh - 8rem))' }}>
          {/* Header */}
          <div className="flex items-center gap-3 bg-hero-gradient px-4 py-3 text-white">
            <span className="relative grid place-items-center h-10 w-10 rounded-full ring-2 ring-white/30 overflow-hidden">
              <Image src="/agent.png" alt={AGENT_NAME} width={40} height={40} className="h-full w-full object-cover" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#14284A]"></span>
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold leading-tight">{AGENT_NAME} · Estimating Specialist</p>
              <p className="flex items-center gap-1.5 text-[11px] text-white/80"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>Online · replies in seconds</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="grid place-items-center h-8 w-8 rounded-full hover:bg-white/15 transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-brand-50/30 px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={'flex items-end gap-2 ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
                {m.role === 'assistant' && (
                  <Image src="/agent.png" alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover ring-1 ring-ink-900/10 shrink-0" />
                )}
                <div
                  className={
                    'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ' +
                    (m.role === 'user'
                      ? 'bg-brand-500 text-white rounded-br-sm'
                      : 'bg-white text-ink-800 ring-1 ring-ink-900/5 rounded-bl-sm')
                  }
                >
                  {m.content || (loading && i === messages.length - 1 ? (
                    <span className="inline-flex gap-1 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-ink-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  ) : '')}
                </div>
              </div>
            ))}

            {showQuickReplies && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-ink-900/5 bg-white p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 rounded-full border border-ink-900/10 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="grid place-items-center h-10 w-10 shrink-0 rounded-full bg-brand-500 text-white hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
