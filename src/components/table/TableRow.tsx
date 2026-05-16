import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCryptoStore } from '../../store/useCryptoStore';
import { formatPrice, formatChange, formatLargeNumber } from '../../utils/formatters';
import type { Coin } from '../../types/crypto';

interface Props {
  coin: Coin;
}

export default function TableRow({ coin }: Props) {
  const livePrice = useCryptoStore((s) => s.coins[coin.symbol]?.price);
  const displayPrice = livePrice ?? coin.price;
  const navigate = useNavigate();

  const prevRef = useRef(displayPrice);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (livePrice && livePrice !== prevRef.current) {
      setFlash(livePrice > prevRef.current ? 'up' : 'down');
      prevRef.current = livePrice;
      const t = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(t);
    }
  }, [livePrice]);

  const flashClass =
    flash === 'up'
      ? 'text-[#0ecb81]'
      : flash === 'down'
      ? 'text-[#f6465d]'
      : 'text-white';

  return (
    <tr
      onClick={() => navigate(`/coin/${coin.id}`)}
      className="cursor-pointer border-b border-[#2b2f36] transition-colors hover:bg-[#2b2f36]"
    >
      <td className="px-4 py-3 text-[#848e9c]">{coin.rank}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="h-7 w-7 rounded-full"
            loading="lazy"
          />
          <div>
            <span className="font-medium">{coin.name}</span>
            <span className="ml-2 text-sm text-[#848e9c]">{coin.symbol}</span>
          </div>
        </div>
      </td>
      <td className={`px-4 py-3 font-mono font-medium tabular-nums transition-colors duration-300 ${flashClass}`}>
        {formatPrice(displayPrice)}
      </td>
      <td
        className={`px-4 py-3 font-mono text-sm ${
          coin.change24h >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'
        }`}
      >
        {formatChange(coin.change24h)}
      </td>
      <td className="hidden px-4 py-3 text-right font-mono text-sm text-[#848e9c] md:table-cell">
        {formatLargeNumber(coin.volume)}
      </td>
      <td className="hidden px-4 py-3 text-right font-mono text-sm text-[#848e9c] lg:table-cell">
        {formatLargeNumber(coin.marketCap)}
      </td>
    </tr>
  );
}
