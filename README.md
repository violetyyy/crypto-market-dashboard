## Crypto Market Dashboard

Modern, responsive crypto dashboard built with Next.js (TypeScript), Tailwind CSS, shadcn-style UI primitives, React Query, axios, native WebSocket, and Recharts.

### Features

- Real-time market overview table (USDT pairs)
- Live price updates via Binance WebSocket
- Sorting, search, pagination
- Coin Detail modal with 24h line chart (Recharts)
- Top Gainers & Top Losers section
- Favorites (localStorage)
- Currency switcher (USD/EUR/MNT)
- Global stats (total 24h volume, BTC dominance)
- Mini sparklines per symbol
- Loading skeletons and subtle animations

### Getting Started

1. Install deps:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

3. Open http://localhost:3000

### Data Sources

- REST: `https://api.binance.com/api/v3/ticker/24hr` (filtered to USDT)
- WS: `wss://stream.binance.com:9443/ws/!ticker@arr`

### Structure

- `src/app/` — pages and providers
- `src/components/` — UI components
- `src/hooks/` — data hooks (`useBinanceData`, `useTopMovers`, `useWebSocket`, `useSparkline`, `useFavorites`)
- `src/context/` — `CurrencyContext`
- `src/utils/` — formatters
- `src/types/` — Binance types

Note: EUR/MNT rates are placeholders; swap with a real FX source if needed.
