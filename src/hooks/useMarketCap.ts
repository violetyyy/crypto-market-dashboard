import { useQuery } from "@tanstack/react-query";
import { CoinGeckoService } from "@/services";
import { CACHE_CONFIG } from "@/config";

type MarketCapData = Record<string, number>;

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
      const coinIds = symbols
        .map((symbol) => SYMBOL_TO_COINGECKO_ID[symbol])
        .filter(Boolean);

      if (coinIds.length === 0) {
        return {};
      }

      try {
        const data = await CoinGeckoService.getMarketCaps(coinIds);

        const result: MarketCapData = {};
        symbols.forEach((symbol) => {
          const coinId = SYMBOL_TO_COINGECKO_ID[symbol];
          if (coinId && data[coinId]?.usd) {
            result[symbol] = data[coinId].usd;
          }
        });

        return result;
      } catch (error) {
        console.error("Error fetching market cap data from CoinGecko:", error);
        return {};
      }
    },
    refetchInterval: CACHE_CONFIG.MARKET_CAP_REFRESH_INTERVAL,
    staleTime: CACHE_CONFIG.STALE_TIME,
    enabled: symbols.length > 0,
  });

  return { marketCapData };
}
