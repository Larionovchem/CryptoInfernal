import { useQuery } from '@tanstack/react-query';
import { mapCoin, mapGlobalStats } from '../utils/mapper';
import { COINGECKO_BASE } from '../utils/api';
import type { Coin, GlobalStats } from '../types/crypto';

async function fetchMarketList(): Promise<Coin[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
  );
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const data = await res.json();
  return (data as unknown[]).map(mapCoin);
}

async function fetchGlobalStats(): Promise<GlobalStats> {
  const res = await fetch(`${COINGECKO_BASE}/global`);
  if (!res.ok) throw new Error(`CoinGecko global error: ${res.status}`);
  const data = await res.json();
  return mapGlobalStats(data);
}

export function useMarketList() {
  return useQuery<Coin[]>({
    queryKey: ['market', 'list'],
    queryFn: fetchMarketList,
    staleTime: 60_000,
    // TODO: add refetch interval once rate limits are figured out
  });
}

export function useGlobalStats() {
  return useQuery<GlobalStats>({
    queryKey: ['market', 'global'],
    queryFn: fetchGlobalStats,
    staleTime: 5 * 60_000,
  });
}
