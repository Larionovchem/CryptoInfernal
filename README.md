# CryptoDash

Real-time cryptocurrency dashboard built as a learning project to practice TypeScript, TanStack Query, and custom React hooks.

![dashboard](https://img.shields.io/badge/React-19-blue) ![ts](https://img.shields.io/badge/TypeScript-5-blue) ![query](https://img.shields.io/badge/TanStack_Query-5-red) ![tailwind](https://img.shields.io/badge/Tailwind_CSS-4-teal)

## Features

- **Market overview** — top 100 coins by market cap with sortable columns and search
- **Live prices** — real-time updates via Coinbase WebSocket (top 30 coins, throttled to 1 update/sec)
- **Price flash** — green/red highlight on price change in the table
- **Coin detail** — individual pages with 7/30/90-day price history charts
- **Global stats** — total market cap, 24h volume, BTC/ETH dominance
- **Responsive** — works on mobile and desktop

## Stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| Charts | Recharts |
| Styling | Tailwind CSS v4 |
| Build | Vite 8 |

## Architecture

### Data flow

```
CoinGecko REST API ──→ TanStack Query ──→ CryptoTable / CoinDetail
                                  (cached, deduplicated)

Coinbase WebSocket ──→ useWebSocket hook ──→ Zustand store ──→ TableRow (live price)
                        (batch flush 1s)
```

**TanStack Query** manages all REST calls: market list, global stats, coin details, price history. Responses are cached (`staleTime: 60s`) so the free CoinGecko tier is not rate-limited on normal usage.

**Zustand** only holds WebSocket price updates — it's the source of truth for live prices. The `useWebSocket` hook batches incoming tick messages into a map and flushes to the store once per second, preventing render flooding.

### Custom hooks

| Hook | Purpose |
|---|---|
| `useWebSocket(productIds)` | Manages Coinbase WS connection, batches updates |
| `useMarketList()` | TanStack Query wrapper for `/coins/markets` |
| `useGlobalStats()` | TanStack Query wrapper for `/global` |
| `useCoinDetail(id)` | TanStack Query wrapper for `/coins/:id` |
| `usePriceHistory(id, days)` | TanStack Query wrapper for `/coins/:id/market_chart` |

### Project structure

```
src/
  types/       — TypeScript interfaces (Coin, ChartDataPoint, …)
  utils/       — Pure functions: formatters, API data mappers
  store/       — Zustand store (WebSocket price state)
  hooks/       — Custom hooks (WebSocket + TanStack Query wrappers)
  components/
    layout/    — Navbar, Layout
    table/     — CryptoTable, TableRow
    chart/     — PriceChart (Recharts)
  pages/       — Dashboard, CoinDetail
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

```bash
npm run build      # production build
npm run typecheck  # TypeScript type check
```

## Notes

- Data from [CoinGecko public API](https://www.coingecko.com/en/api) (no key required, rate-limited)
- Live prices from [Coinbase Advanced Trade WebSocket](https://docs.cdp.coinbase.com/advanced-trade/docs/ws-overview) — public ticker channel, no auth
- WebSocket subscribes to top 30 coins only; coins outside that range show CoinGecko snapshot price
