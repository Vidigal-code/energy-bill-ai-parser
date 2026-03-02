import { ReactNode } from 'react';

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center sm:p-6">
      <div className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--surface-1)] shadow-xl">
        <header className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[var(--border-color)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
          >
            Fechar
          </button>
        </header>
        <div className="px-4 py-4">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-[var(--border-color)] px-4 py-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
