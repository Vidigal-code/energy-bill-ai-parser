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
    'rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60';

  const styleByVariant = {
    primary: 'bg-emerald-700 text-white hover:bg-emerald-800',
    ghost: 'border border-emerald-700 text-emerald-800 hover:bg-emerald-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[variant];

  return <button className={`${base} ${styleByVariant} ${className}`} {...props} />;
}
