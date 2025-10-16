// API Configuration
export const API_CONFIG = {
  BINANCE: {
    BASE_URL: "https://api.binance.com/api/v3",
    WS_URL: "wss://stream.binance.com:9443/ws/!ticker@arr",
    ENDPOINTS: {
      TICKER_24HR: "/ticker/24hr",
      KLINES: "/klines",
    },
  },
  COINGECKO: {
    BASE_URL: "https://api.coingecko.com/api/v3",
    ENDPOINTS: {
      SIMPLE_PRICE: "/simple/price",
    },
  },
} as const;

// WebSocket Configuration
export const WS_CONFIG = {
  THROTTLE_MS: 250,
  RECONNECT_INTERVAL: 5000,
  MAX_RECONNECT_ATTEMPTS: 5,
} as const;

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_VISIBLE_PAGES: 5,
} as const;

// Currency Configuration
export const CURRENCY_CONFIG = {
  SUPPORTED_CURRENCIES: ["USD", "EUR", "MNT"] as const,
  DEFAULT_CURRENCY: "USD" as const,
  PLACEHOLDER_RATES: {
    EUR: 0.85,
    MNT: 3500,
  },
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  DEFAULT_INTERVAL: "1h",
  DEFAULT_LIMIT: 24,
  SPARKLINE_HEIGHT: 28,
  SPARKLINE_WIDTH: 120,
  COLORS: {
    UP: "#22c55e",
    DOWN: "#ef4444",
  },
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  MARKET_CAP_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  PRICE_REFRESH_INTERVAL: 60 * 1000, // 1 minute
  STALE_TIME: 30 * 1000, // 30 seconds
} as const;
