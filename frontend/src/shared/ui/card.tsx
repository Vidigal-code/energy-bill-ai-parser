type CardProps = {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function Card({ title, children, actions }: CardProps) {
  return (
    <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-emerald-900">{title}</h2>
        {actions}
      </header>
      {children}
    </section>
  );
}
