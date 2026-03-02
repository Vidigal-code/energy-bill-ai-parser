const DURATION_REGEX = /^(\d+)([smhd])$/i;

const UNIT_TO_SECONDS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
};

export function durationToSeconds(value: string): number {
  const match = value.trim().match(DURATION_REGEX);
  if (!match) {
    return 900;
  }

  const amount = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multiplier = UNIT_TO_SECONDS[unit];
  if (!amount || !multiplier) {
    return 900;
  }

  return amount * multiplier;
}
