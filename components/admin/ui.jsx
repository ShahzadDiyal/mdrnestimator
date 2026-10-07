'use client';
// Shared admin UI primitives. Tailwind + the site's brand palette.

import { useEffect, useState } from 'react';
import {
  IconX, IconChevronDown, IconAlert, IconCheck, IconSearch,
} from './icons';

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className = '', children, ...rest }) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-[0_6px_20px_-6px_rgba(11,27,51,0.10)] ring-1 ring-ink-900/5 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function Stat({ label, value, sub, icon, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    accent: 'bg-accent-50 text-accent-600',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-100 text-slate-500',
  };
  return (
    <Card className="flex items-start gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
        <p className="mt-1 truncate text-2xl font-bold text-ink-900">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-ink-500">{sub}</p>}
      </div>
    </Card>
  );
}

const badgeTones = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  accent: 'bg-accent-50 text-accent-700 ring-accent-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  red: 'bg-rose-50 text-rose-700 ring-rose-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  blue: 'bg-sky-50 text-sky-700 ring-sky-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
};

export function Badge({ tone = 'slate', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${badgeTones[tone]} ${className}`}>
      {children}
    </span>
  );
}

const STATUS_TONE = {
  New: 'blue',
  Contacted: 'amber',
  Quoted: 'violet',
  Won: 'green',
  Lost: 'slate',
  Active: 'green',
  Draft: 'slate',
  Published: 'green',
  Paused: 'amber',
  Admin: 'brand',
  Estimator: 'accent',
};

export function StatusBadge({ status }) {
  return <Badge tone={STATUS_TONE[status] || 'slate'}>{status}</Badge>;
}

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none';
const btnVariants = {
  primary: 'bg-brand-600 text-white shadow-[0_10px_30px_-12px_rgba(20,40,74,0.4)] hover:bg-brand-700',
  accent: 'bg-accent-500 text-white hover:bg-accent-600',
  ghost: 'bg-white text-ink-800 ring-1 ring-ink-900/10 hover:ring-brand-300 hover:text-brand-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  dangerGhost: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100',
  dark: 'bg-ink-900 text-white hover:bg-ink-800',
};

export function Btn({ variant = 'primary', className = '', ...rest }) {
  return <button className={`${btnBase} ${btnVariants[variant]} ${className}`} {...rest} />;
}

export function Field({ label, hint, children, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      {children}
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

export const inputCls = 'input';
export function Input(props) { return <input className={`input ${props.className || ''}`} {...props} />; }
export function Textarea(props) { return <textarea className={`input resize-y ${props.className || ''}`} {...props} />; }
export function Select({ children, ...props }) {
  return (
    <div className="relative">
      <select className={`input appearance-none pr-9 ${props.className || ''}`} {...props}>{children}</select>
      <IconChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5"
    >
      <span className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-slate-300'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </span>
      {label && <span className="text-sm text-ink-700">{label}</span>}
    </button>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            value === t.id ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500 hover:text-ink-800'
          }`}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, wide }) {
  useEffect(() => {
    if (!open) return;
    const fn = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'}`}>
        <div className="flex items-center justify-between border-b border-ink-900/5 px-6 py-4">
          <h3 className="text-lg font-bold text-ink-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-slate-100 hover:text-ink-800" aria-label="Close">
            <IconX size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-ink-900/5 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const fn = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink-900/5 px-6 py-4">
          <h3 className="text-lg font-bold text-ink-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-slate-100 hover:text-ink-800" aria-label="Close">
            <IconX size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-ink-900/5 px-6 py-4">{footer}</div>}
      </aside>
    </div>
  );
}

export function EmptyState({ icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-14 text-center ring-1 ring-ink-900/5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-ink-400">{icon}</div>
      <h3 className="mt-4 font-bold text-ink-900">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-ink-500">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative">
      <IconSearch size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 z-10" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input !pl-11"
        style={{ paddingLeft: '2.75rem' }}
      />
    </div>
  );
}

export function DemoNote() {
  return null;
}

export function ConfirmState({ onConfirm, onCancel, title = 'Are you sure?', text, confirmLabel = 'Delete' }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <IconAlert size={22} />
      </div>
      <h4 className="mt-3 font-bold text-ink-900">{title}</h4>
      {text && <p className="mt-1 text-sm text-ink-500">{text}</p>}
      <div className="mt-5 flex justify-center gap-2">
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm}>{confirmLabel}</Btn>
      </div>
    </div>
  );
}

// Table helpers
export const thCls = 'whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-400';
export const tdCls = 'px-4 py-3.5 text-sm text-ink-800 align-middle';
export function TableWrap({ children }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">{children}</table>
      </div>
    </Card>
  );
}

// Small toast (local, no library)
let toastFn = null;
export function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    toastFn = (msg, tone = 'dark') => {
      const id = Date.now() + Math.random();
      setItems((p) => [...p, { id, msg, tone }]);
      setTimeout(() => setItems((p) => p.filter((i) => i.id !== id)), 2600);
    };
    return () => { toastFn = null; };
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
      {items.map((i) => (
        <div key={i.id} className="pointer-events-auto flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl">
          <IconCheck size={16} className="text-emerald-400" />
          {i.msg}
        </div>
      ))}
    </div>
  );
}
export const toast = (msg) => toastFn && toastFn(msg);
