import { useQuery } from '@tanstack/react-query';
import { mapPriceHistory } from '../utils/mapper';
import { COINGECKO_BASE } from '../utils/api';
import type { ChartDataPoint } from '../types/crypto';

async function fetchPriceHistory(id: string, days: number): Promise<ChartDataPoint[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error(`History fetch failed for ${id}`);
  const data = await res.json();
  return mapPriceHistory(data);
}

export function usePriceHistory(id: string, days = 7) {
  return useQuery<ChartDataPoint[]>({
    queryKey: ['coin', id, 'history', days],
    queryFn: () => fetchPriceHistory(id, days),
    staleTime: 5 * 60_000,
    enabled: Boolean(id),
  });
}
