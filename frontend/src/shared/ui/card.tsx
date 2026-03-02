type CardProps = {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function Card({ title, children, actions }: CardProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--surface-1)] p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
        {actions}
      </header>
      {children}
    </section>
  );
}
