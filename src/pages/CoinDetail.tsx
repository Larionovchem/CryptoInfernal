import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useCoinDetail } from '../hooks/useCoinDetail';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { useCryptoStore } from '../store/useCryptoStore';
import PriceChart from '../components/chart/PriceChart';
import { formatPrice, formatChange, formatLargeNumber } from '../utils/formatters';

const DAY_OPTIONS = [7, 30, 90] as const;
type Days = (typeof DAY_OPTIONS)[number];

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-[#2b2f36] bg-[#1e2026] p-4">
      <span className="text-xs text-[#848e9c]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const [days, setDays] = useState<Days>(7);

  const { data: coin, isLoading, error } = useCoinDetail(id ?? '');
  const { data: history, isLoading: histLoading } = usePriceHistory(id ?? '', days);

  // Подхватываем живую цену из WebSocket если она есть
  const livePrice = useCryptoStore((s) => coin ? s.coins[coin.symbol]?.price : undefined);
  const displayPrice = livePrice ?? coin?.price ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-[#1e2026]" />
        <div className="h-64 animate-pulse rounded bg-[#1e2026]" />
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="rounded-lg border border-[#f6465d] bg-[#1e2026] p-6 text-center">
        <p className="text-[#f6465d]">Coin not found.</p>
        <Link to="/" className="mt-2 inline-block text-sm text-[#f0b90b] hover:underline">
          ← Back to market
        </Link>
      </div>
    );
  }

  const isPositive = coin.change24h >= 0;

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-[#848e9c] hover:text-white">
        ← Market
      </Link>

      {/* Coin header */}
      <div className="flex flex-wrap items-start gap-4">
        <img src={coin.image} alt={coin.name} className="h-14 w-14 rounded-full" />
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-2xl font-bold">{coin.name}</h1>
            <span className="rounded bg-[#2b2f36] px-2 py-0.5 text-sm text-[#848e9c]">
              {coin.symbol}
            </span>
            <span className="text-xs text-[#848e9c]">Rank #{coin.rank}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(displayPrice)}</span>
            <span
              className={`text-lg font-medium ${isPositive ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}
            >
              {formatChange(coin.change24h)}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-[#2b2f36] bg-[#1e2026] p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-[#848e9c]">Price history</span>
          <div className="flex gap-1">
            {DAY_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`rounded px-3 py-1 text-xs transition-colors ${
                  days === d
                    ? 'bg-[#f0b90b] text-black font-medium'
                    : 'bg-[#2b2f36] text-[#848e9c] hover:text-white'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {histLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#f0b90b] border-t-transparent" />
          </div>
        ) : (
          <PriceChart data={history ?? []} positive={isPositive} />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatItem label="Market Cap" value={formatLargeNumber(coin.marketCap)} />
        <StatItem label="24h Volume" value={formatLargeNumber(coin.volume)} />
        <StatItem label="Circulating Supply" value={`${coin.circulatingSupply.toLocaleString()} ${coin.symbol}`} />
        {coin.totalSupply !== null && (
          <StatItem label="Total Supply" value={`${coin.totalSupply.toLocaleString()} ${coin.symbol}`} />
        )}
        <StatItem label="All-Time High" value={formatPrice(coin.ath)} />
        <StatItem
          label="ATH Date"
          value={coin.athDate ? new Date(coin.athDate).toLocaleDateString() : '—'}
        />
      </div>

      {/* Description (truncated) */}
      {coin.description && (
        <div className="rounded-lg border border-[#2b2f36] bg-[#1e2026] p-4">
          <h3 className="mb-2 font-semibold">About {coin.name}</h3>
          <p
            className="text-sm leading-relaxed text-[#848e9c] line-clamp-4"
            dangerouslySetInnerHTML={{ __html: coin.description }}
          />
        </div>
      )}
    </div>
  );
}
