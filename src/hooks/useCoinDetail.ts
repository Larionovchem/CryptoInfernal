import { useQuery } from '@tanstack/react-query';
import { mapCoinDetail } from '../utils/mapper';
import { COINGECKO_BASE } from '../utils/api';
import type { CoinDetail } from '../types/crypto';

async function fetchCoinDetail(id: string): Promise<CoinDetail> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
  );
  if (!res.ok) throw new Error(`Coin not found: ${id}`);
  const data = await res.json();
  return mapCoinDetail(data);
}

export function useCoinDetail(id: string) {
  return useQuery<CoinDetail>({
    queryKey: ['coin', id],
    queryFn: () => fetchCoinDetail(id),
    staleTime: 30_000,
    enabled: Boolean(id),
  });
}
