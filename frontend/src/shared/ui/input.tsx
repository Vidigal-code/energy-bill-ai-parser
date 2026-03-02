import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--text-primary)]">
      <span>{label}</span>
      <input
        className={`rounded-lg border border-[var(--border-color)] bg-[var(--surface-1)] px-3 py-2 text-[var(--text-primary)] outline-none ring-[var(--accent)] transition focus:ring-2 ${className}`}
        {...props}
      />
    </label>
  );
}
