function fmtNum(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  const k = n / 1_000;
  return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
}

export function formatSalary(
  min?: number | null,
  max?: number | null,
  currency?: string | null,
): string {
  if (!min && !max) return 'По договоренности';

  const isUSD = currency === 'USD';

  if (isUSD) {
    const fmtUsd = (n: number) => `$${n.toLocaleString('en')}`;
    if (min && max) return `${fmtUsd(min)} – ${fmtUsd(max)}`;
    if (min) return `от ${fmtUsd(min)}`;
    return `до ${fmtUsd(max!)}`;
  }

  if (min && max) return `${fmtNum(min)} – ${fmtNum(max)} ₸`;
  if (min) return `от ${fmtNum(min)} ₸`;
  return `до ${fmtNum(max!)} ₸`;
}
