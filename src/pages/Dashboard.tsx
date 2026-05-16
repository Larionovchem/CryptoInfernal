import { useMemo } from 'react';
import { useMarketList, useGlobalStats } from '../hooks/useMarketData';
import useWebSocket from '../hooks/useWebSocket';
import CryptoTable from '../components/table/CryptoTable';
import { formatLargeNumber } from '../utils/formatters';

// Подписываемся на топ-30 монет по рыночной капитализации
const WS_LIMIT = 30;

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#2b2f36] bg-[#1e2026] px-5 py-4">
      <p className="text-xs text-[#848e9c]">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { data: coins, isLoading, error } = useMarketList();
  const { data: global } = useGlobalStats();

  const productIds = useMemo(() => {
    if (!coins) return [];
    return coins.slice(0, WS_LIMIT).map((c) => `${c.symbol}-USD`);
  }, [coins]);

  useWebSocket(productIds);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-[#1e2026]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[#f6465d] bg-[#1e2026] p-6 text-center">
        <p className="text-[#f6465d]">Failed to load market data.</p>
        <p className="mt-1 text-sm text-[#848e9c]">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {global && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Market Cap" value={formatLargeNumber(global.totalMarketCap)} />
          <StatCard label="24h Volume" value={formatLargeNumber(global.totalVolume)} />
          <StatCard label="BTC Dominance" value={`${global.btcDominance.toFixed(1)}%`} />
          <StatCard label="ETH Dominance" value={`${global.ethDominance.toFixed(1)}%`} />
        </div>
      )}

      {coins && <CryptoTable coins={coins} />}
    </div>
  );
}
