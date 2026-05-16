import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TableRow from './TableRow';
import type { Coin, SortKey, SortDir } from '../../types/crypto';

interface Props {
  coins: Coin[];
}

const SORT_LABELS: Record<SortKey, string> = {
  rank: '#',
  price: 'Price',
  change24h: '24h %',
  volume: 'Volume',
  marketCap: 'Mkt Cap',
};

function SortHeader({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <th
      className="cursor-pointer select-none px-4 py-3 text-left text-xs font-medium uppercase text-[#848e9c] hover:text-white"
      onClick={() => onSort(sortKey)}
    >
      {label}
      {active && <span className="ml-1">{dir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );
}

export default function CryptoTable({ coins }: Props) {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? coins.filter(
          (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
        )
      : coins;
  }, [coins, search]);

  const sorted = useMemo(() => {
    const multiplier = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => (a[sortKey] - b[sortKey]) * multiplier);
  }, [filtered, sortKey, sortDir]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Market</h2>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded bg-[#2b2f36] px-3 py-1.5 text-sm text-white placeholder-[#848e9c] outline-none focus:ring-1 focus:ring-[#f0b90b] md:hidden"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#2b2f36]">
        <table className="w-full text-sm">
          <thead className="border-b border-[#2b2f36] bg-[#1e2026]">
            <tr>
              <SortHeader label="#" sortKey="rank" current={sortKey} dir={sortDir} onSort={handleSort} />
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#848e9c]">
                Name
              </th>
              <SortHeader label="Price" sortKey="price" current={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader label="24h %" sortKey="change24h" current={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader
                label="Volume"
                sortKey="volume"
                current={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
              <SortHeader
                label="Mkt Cap"
                sortKey="marketCap"
                current={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
            </tr>
          </thead>
          <tbody>
            {sorted.map((coin) => (
              <TableRow key={coin.id} coin={coin} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-right text-xs text-[#848e9c]">
        {sorted.length} / {coins.length} coins — prices update every second via WebSocket
      </p>
    </div>
  );
}
