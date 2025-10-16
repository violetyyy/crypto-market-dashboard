import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type MarketCapData = Record<string, number>;

// Mapping from Binance symbols to CoinGecko IDs
const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
  BTCUSDT: "bitcoin",
  ETHUSDT: "ethereum",
  BNBUSDT: "binancecoin",
  SOLUSDT: "solana",
  XRPUSDT: "ripple",
  ADAUSDT: "cardano",
  DOGEUSDT: "dogecoin",
  DOTUSDT: "polkadot",
  MATICUSDT: "matic-network",
  AVAXUSDT: "avalanche-2",
  LINKUSDT: "chainlink",
  UNIUSDT: "uniswap",
  ATOMUSDT: "cosmos",
  LTCUSDT: "litecoin",
  ETCUSDT: "ethereum-classic",
  TRXUSDT: "tron",
  XLMUSDT: "stellar",
  NEARUSDT: "near",
  ALGOUSDT: "algorand",
  FILUSDT: "filecoin",
  SHIBUSDT: "shiba-inu",
  APTUSDT: "aptos",
  ARBUSDT: "arbitrum",
  OPUSDT: "optimism",
  LDOUSDT: "lido-dao",
  STXUSDT: "blockstack",
  INJUSDT: "injective-protocol",
  TIAUSDT: "celestia",
  SUIUSDT: "sui",
  PEPEUSDT: "pepe",
};

export function useMarketCap(symbols: string[]) {
  const { data: marketCapData = {} } = useQuery<MarketCapData>({
    queryKey: ["coingecko", "marketcap", symbols.sort().join(",")],
    queryFn: async () => {
      // Get CoinGecko IDs for the symbols
      const coinIds = symbols
        .map((symbol) => SYMBOL_TO_COINGECKO_ID[symbol])
        .filter(Boolean);

      if (coinIds.length === 0) {
        return {};
      }

      try {
        // Fetch market cap data from CoinGecko
        // Using the /simple/price endpoint with market_cap parameter
        // Note: CoinGecko free tier allows up to ~250 coins per request
        const { data } = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price",
          {
            params: {
              ids: coinIds.join(","),
              vs_currencies: "usd",
              include_market_cap: true,
            },
          }
        );

        // Map CoinGecko response back to Binance symbols
        const result: MarketCapData = {};
        symbols.forEach((symbol) => {
          const coinId = SYMBOL_TO_COINGECKO_ID[symbol];
          if (coinId && data[coinId]?.usd_market_cap) {
            result[symbol] = data[coinId].usd_market_cap;
          }
        });

        return result;
      } catch (error) {
        console.error("Error fetching market cap data from CoinGecko:", error);
        return {};
      }
    },
    refetchInterval: 300_000, // Refetch every 5 minutes
    staleTime: 120_000, // Consider data stale after 2 minutes
    enabled: symbols.length > 0,
  });

  return { marketCapData };
}
