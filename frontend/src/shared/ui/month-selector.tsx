import { useMemo } from 'react';

type MonthSelectorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  startYear?: number;
  endYear?: number;
};

const months = [
  { value: '01', label: 'Jan' },
  { value: '02', label: 'Fev' },
  { value: '03', label: 'Mar' },
  { value: '04', label: 'Abr' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' },
  { value: '08', label: 'Ago' },
  { value: '09', label: 'Set' },
  { value: '10', label: 'Out' },
  { value: '11', label: 'Nov' },
  { value: '12', label: 'Dez' },
];

function parseYearMonth(value: string): { year: string; month: string } {
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return { year: '', month: '' };
  }
  return { year: match[1], month: match[2] };
}

function currentYearMonth() {
  const now = new Date();
  return {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, '0'),
  };
}

export function MonthSelector({
  label,
  value,
  onChange,
  startYear = 2020,
  endYear = new Date().getFullYear() + 2,
}: MonthSelectorProps) {
  const { year, month } = parseYearMonth(value);

  const years = useMemo(() => {
    const data: string[] = [];
    for (let y = endYear; y >= startYear; y -= 1) {
      data.push(String(y));
    }
    return data;
  }, [startYear, endYear]);

  function handleYearChange(nextYear: string) {
    if (!nextYear) {
      onChange('');
      return;
    }
    const fallback = currentYearMonth();
    onChange(`${nextYear}-${month || fallback.month}`);
  }

  function handleMonthChange(nextMonth: string) {
    if (!nextMonth) {
      onChange('');
      return;
    }
    const fallback = currentYearMonth();
    onChange(`${year || fallback.year}-${nextMonth}`);
  }

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--text-primary)]">
      <span>{label}</span>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <select
          value={month}
          onChange={(event) => handleMonthChange(event.target.value)}
          className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-1)] px-3 py-2 text-[var(--text-primary)]"
        >
          <option value="">Mes</option>
          {months.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(event) => handleYearChange(event.target.value)}
          className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface-1)] px-3 py-2 text-[var(--text-primary)]"
        >
          <option value="">Ano</option>
          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onChange('')}
          className="w-full rounded-lg border border-[var(--border-color)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-2)] sm:w-auto"
        >
          Limpar
        </button>
      </div>
    </label>
  );
}
