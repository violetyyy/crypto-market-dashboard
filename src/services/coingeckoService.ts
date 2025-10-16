import axios from "axios";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export interface CoinGeckoPrice {
  [coinId: string]: {
    usd: number;
    eur?: number;
    mnt?: number;
  };
}

export interface CoinGeckoMarketCap {
  [coinId: string]: {
    usd: number;
  };
}

export class CoinGeckoService {
  /**
   * Fetch current price data for multiple coins
   */
  static async getPrices(
    coinIds: string[],
    currencies: string[] = ["usd", "eur", "mnt"]
  ): Promise<CoinGeckoPrice> {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/simple/price`, {
        params: {
          ids: coinIds.join(","),
          vs_currencies: currencies.join(","),
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching CoinGecko price data:", error);
      throw error;
    }
  }

  /**
   * Fetch market cap data for multiple coins
   */
  static async getMarketCaps(coinIds: string[]): Promise<CoinGeckoMarketCap> {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/simple/price`, {
        params: {
          ids: coinIds.join(","),
          vs_currencies: "usd",
          include_market_cap: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching CoinGecko market cap data:", error);
      throw error;
    }
  }

  /**
   * Map Binance symbols to CoinGecko coin IDs
   */
  static mapSymbolToCoinId(symbol: string): string {
    // Remove USDT suffix and convert to lowercase
    const baseSymbol = symbol.replace("USDT", "").toLowerCase();

    // Handle special cases
    const symbolMap: Record<string, string> = {
      btc: "bitcoin",
      eth: "ethereum",
      bnb: "binancecoin",
      ada: "cardano",
      sol: "solana",
      xrp: "ripple",
      dot: "polkadot",
      doge: "dogecoin",
      matic: "matic-network",
      avax: "avalanche-2",
      link: "chainlink",
      uni: "uniswap",
      ltc: "litecoin",
      atom: "cosmos",
      ftm: "fantom",
      near: "near",
      algo: "algorand",
      vet: "vechain",
      icp: "internet-computer",
      fil: "filecoin",
    };

    return symbolMap[baseSymbol] || baseSymbol;
  }
}
