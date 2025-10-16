import axios from "axios";
import type { BinanceTicker24hr, Kline } from "@/types/binance";

const BINANCE_BASE_URL = "https://api.binance.com/api/v3";

export class BinanceService {
  /**
   * Fetch 24hr ticker statistics for all symbols
   */
  static async getTicker24hr(): Promise<BinanceTicker24hr[]> {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/ticker/24hr`);
      return response.data;
    } catch (error) {
      console.error("Error fetching Binance ticker data:", error);
      throw error;
    }
  }

  /**
   * Fetch historical kline/candlestick data for a symbol
   */
  static async getKlines(
    symbol: string,
    interval: string = "1h",
    limit: number = 24
  ): Promise<Kline[]> {
    try {
      const response = await axios.get(`${BINANCE_BASE_URL}/klines`, {
        params: {
          symbol,
          interval,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching klines for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get WebSocket URL for ticker stream
   */
  static getWebSocketUrl(): string {
    return "wss://stream.binance.com:9443/ws/!ticker@arr";
  }

  /**
   * Filter symbols to only USDT pairs
   */
  static filterUSDTpairs(data: BinanceTicker24hr[]): BinanceTicker24hr[] {
    return data.filter((item) => item.symbol.endsWith("USDT"));
  }
}
