const monthByAlias: Record<string, number> = {
  jan: 1,
  fev: 2,
  mar: 3,
  abr: 4,
  mai: 5,
  jun: 6,
  jul: 7,
  ago: 8,
  set: 9,
  out: 10,
  nov: 11,
  dez: 12,
};

function parseMonthToken(rawMonth: string): number | null {
  const cleaned = rawMonth.trim().toLowerCase();

  if (!cleaned) {
    return null;
  }

  const numericMonth = Number.parseInt(cleaned, 10);
  if (
    Number.isInteger(numericMonth) &&
    numericMonth >= 1 &&
    numericMonth <= 12
  ) {
    return numericMonth;
  }

  return monthByAlias[cleaned.slice(0, 3)] ?? null;
}

/**
 * Parses month references from common invoice formats:
 * - MMM/YYYY (JAN/2024, set/2024)
 * - MM/YYYY (01/2024)
 * - YYYY-MM (2024-01)
 */
export function toMonthKey(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const yearMonthFormat = /^(\d{4})-(\d{1,2})$/;
  const slashFormat = /^([a-zA-Z]{3,}|\d{1,2})\/(\d{4})$/;

  const yearMonthMatch = normalized.match(yearMonthFormat);
  if (yearMonthMatch) {
    const year = Number.parseInt(yearMonthMatch[1], 10);
    const month = Number.parseInt(yearMonthMatch[2], 10);
    if (year >= 1900 && month >= 1 && month <= 12) {
      return year * 100 + month;
    }
    return null;
  }

  const slashMatch = normalized.match(slashFormat);
  if (!slashMatch) {
    return null;
  }

  const month = parseMonthToken(slashMatch[1]);
  const year = Number.parseInt(slashMatch[2], 10);

  if (!month || !Number.isInteger(year) || year < 1900) {
    return null;
  }

  return year * 100 + month;
}
