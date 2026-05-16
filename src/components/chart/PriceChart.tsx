import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatPrice } from '../../utils/formatters';
import type { ChartDataPoint } from '../../types/crypto';

interface TooltipContentProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-[#2b2f36] bg-[#1e2026] px-3 py-2 text-sm shadow-lg">
      <p className="text-[#848e9c]">{label}</p>
      <p className="font-medium text-[#f0b90b]">{formatPrice(payload[0].value ?? 0)}</p>
    </div>
  );
}

interface Props {
  data: ChartDataPoint[];
  color?: string;
  positive?: boolean;
}

export default function PriceChart({ data, positive = true }: Props) {
  const lineColor = positive ? '#0ecb81' : '#f6465d';

  if (!data.length) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2b2f36" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#848e9c', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={['auto', 'auto']}
          tick={{ fill: '#848e9c', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => {
            if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
            return `$${v.toFixed(2)}`;
          }}
          width={60}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: '#848e9c', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
