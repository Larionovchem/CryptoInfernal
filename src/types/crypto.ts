export interface Coin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  volume: number;
  change24h: number;
  marketCap: number;
  image: string;
  rank: number;
}

export interface CoinDetail extends Coin {
  circulatingSupply: number;
  totalSupply: number | null;
  ath: number;
  athDate: string;
  description: string;
}

// [timestamp, price]
export type PricePoint = [number, number];

export interface PriceHistory {
  prices: PricePoint[];
}

export interface ChartDataPoint {
  date: string;
  price: number;
}

export interface GlobalStats {
  totalMarketCap: number;
  btcDominance: number;
  ethDominance: number;
  totalVolume: number;
}

export interface CoinStoreEntry {
  price?: number;
  symbol?: string;
}

export type CoinStore = Record<string, CoinStoreEntry>;

export type SortKey = 'rank' | 'price' | 'change24h' | 'volume' | 'marketCap';
export type SortDir = 'asc' | 'desc';
