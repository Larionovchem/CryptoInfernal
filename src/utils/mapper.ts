import type { Coin, CoinDetail, CoinStore, GlobalStats, PriceHistory, ChartDataPoint } from '../types/crypto';
import { formatDate } from './formatters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapCoin(raw: any): Coin {
  return {
    id: raw.id,
    symbol: raw.symbol?.toUpperCase() ?? '',
    name: raw.name ?? '',
    price: raw.current_price ?? 0,
    volume: raw.total_volume ?? 0,
    change24h: raw.price_change_percentage_24h ?? 0,
    marketCap: raw.market_cap ?? 0,
    image: raw.image ?? '',
    rank: raw.market_cap_rank ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapCoinDetail(raw: any): CoinDetail {
  return {
    id: raw.id,
    symbol: raw.symbol?.toUpperCase() ?? '',
    name: raw.name ?? '',
    price: raw.market_data?.current_price?.usd ?? 0,
    volume: raw.market_data?.total_volume?.usd ?? 0,
    change24h: raw.market_data?.price_change_percentage_24h ?? 0,
    marketCap: raw.market_data?.market_cap?.usd ?? 0,
    image: raw.image?.large ?? '',
    rank: raw.market_cap_rank ?? 0,
    circulatingSupply: raw.market_data?.circulating_supply ?? 0,
    totalSupply: raw.market_data?.total_supply ?? null,
    ath: raw.market_data?.ath?.usd ?? 0,
    athDate: raw.market_data?.ath_date?.usd ?? '',
    description: raw.description?.en ?? '',
  };
}

export function normalizeCoins(coins: unknown[]): CoinStore {
  return (coins as Parameters<typeof mapCoin>[0][]).reduce<CoinStore>((acc, raw) => {
    const coin = mapCoin(raw);
    acc[coin.symbol] = { price: coin.price, symbol: coin.symbol };
    return acc;
  }, {});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapSocketData(data: any): { symbol: string; data: { price: number } } | null {
  const ticker = data.events?.[0]?.tickers?.[0];
  if (!ticker) return null;
  return {
    symbol: ticker.product_id.split('-')[0],
    data: { price: Number(ticker.price) },
  };
}

export function mapPriceHistory(history: PriceHistory): ChartDataPoint[] {
  return history.prices.map(([timestamp, price]) => ({
    date: formatDate(timestamp),
    price: Math.round(price * 100) / 100,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapGlobalStats(raw: any): GlobalStats {
  return {
    totalMarketCap: raw.data?.total_market_cap?.usd ?? 0,
    btcDominance: raw.data?.market_cap_percentage?.btc ?? 0,
    ethDominance: raw.data?.market_cap_percentage?.eth ?? 0,
    totalVolume: raw.data?.total_volume?.usd ?? 0,
  };
}
