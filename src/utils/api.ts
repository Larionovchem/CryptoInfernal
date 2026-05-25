// В dev запросы идут через Vite proxy (обходим CORS localhost)
// В prod — напрямую к CoinGecko (они разрешают CORS для не-localhost доменов)
export const COINGECKO_BASE = import.meta.env.DEV
  ? '/coingecko'
  : 'https://api.coingecko.com/api/v3';
