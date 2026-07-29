import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit';
};

const sizes = { md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' };
const variants = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40',
  outline: 'border border-border bg-background text-foreground hover:border-foreground/40',
  ghost: 'text-text-secondary hover:text-foreground',
};

export function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  type = 'button',
}: ButtonProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href)
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Section({
  children,
  eyebrow,
  title,
  lead,
  className = '',
  id,
}: {
  children?: ReactNode;
  eyebrow?: string;
  title?: string;
  lead?: string;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <div className="section-container">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        {title && <h2 className="headline-md mb-4">{title}</h2>}
        {lead && <p className="body-lg max-w-2xl mb-10">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="headline-sm tabular-nums">{value}</p>
      <p className="body-sm mt-1">{label}</p>
    </div>
  );
}

export function Chip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={!!active}
      onClick={onClick}
      className={`chip ${active ? 'chip-active' : 'chip-idle'}`}
    >
      {children}
    </button>
  );
}

export function OptionCard({
  title,
  body,
  active,
  onClick,
}: {
  title: string;
  body?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={!!active}
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-6 sm:p-8 border-2 transition-all ${
        active ? 'border-foreground bg-surface' : 'border-border bg-surface hover:border-foreground/30'
      }`}
    >
      <span className="headline-sm block">{title}</span>
      {body && <span className="body-sm block mt-1">{body}</span>}
    </button>
  );
}

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-text-tertiary"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="block mt-1.5 text-xs text-text-tertiary">{hint}</span>}
    </label>
  );
}

export const inputClass =
  'w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-text-tertiary focus:border-foreground/40';

export function Accordion({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((it) => (
        <details key={it.q} className="group py-5">
          <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
            <span className="font-medium text-foreground">{it.q}</span>
            <span className="text-text-tertiary transition-transform group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <p className="body-sm mt-3 pr-8">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
