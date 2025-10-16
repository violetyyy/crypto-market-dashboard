export interface BinanceTicker24hr {
  symbol: string;
  priceChange: string; // absolute change
  priceChangePercent: string; // percent change
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string; // base asset volume
  quoteVolume: string; // quote asset volume
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export type Kline = [
  number, // Open time
  string, // Open price
  string, // High price
  string, // Low price
  string, // Close price
  string, // Volume
  number, // Close time
  string, // Quote asset volume
  number, // Number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string // Ignore
];

export interface TopMoversResult {
  gainers: BinanceTicker24hr[];
  losers: BinanceTicker24hr[];
}
