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

export interface TopMoversResult {
  gainers: BinanceTicker24hr[];
  losers: BinanceTicker24hr[];
}
