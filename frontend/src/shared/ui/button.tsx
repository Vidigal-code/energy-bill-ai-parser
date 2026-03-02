import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
};

export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const base =
    'rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60';

  const styleByVariant = {
    primary:
      'bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-strong)]',
    ghost:
      'border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-2)]',
    danger: 'bg-[var(--danger)] text-white hover:bg-[var(--danger-strong)]',
  }[variant];

  return <button className={`${base} ${styleByVariant} ${className}`} {...props} />;
}
