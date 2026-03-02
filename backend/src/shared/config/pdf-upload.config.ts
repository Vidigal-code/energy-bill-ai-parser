const DEFAULT_PDF_MAX_FILE_SIZE_MB = 50;
const BYTES_IN_MB = 1024 * 1024;

export function resolvePdfMaxFileSizeMb(rawValue?: string | number): number {
  const numericValue =
    typeof rawValue === 'number'
      ? rawValue
      : Number.parseFloat(String(rawValue ?? ''));

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return DEFAULT_PDF_MAX_FILE_SIZE_MB;
  }

  return numericValue;
}

export function resolvePdfMaxFileSizeBytes(rawValue?: string | number): number {
  const mb = resolvePdfMaxFileSizeMb(rawValue);
  return Math.floor(mb * BYTES_IN_MB);
}
