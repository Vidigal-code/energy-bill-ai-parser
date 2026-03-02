import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-emerald-950">
      <span>{label}</span>
      <input
        className={`rounded-lg border border-emerald-200 px-3 py-2 outline-none ring-emerald-500 transition focus:ring-2 ${className}`}
        {...props}
      />
    </label>
  );
}
