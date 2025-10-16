import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { BinanceTicker24hr, TopMoversResult } from "@/types/binance";

export const useTopMovers = () => {
  return useQuery<TopMoversResult>({
    queryKey: ["topMovers"],
    queryFn: async () => {
      const { data } = await axios.get<BinanceTicker24hr[]>(
        "https://api.binance.com/api/v3/ticker/24hr"
      );

      const usdtPairs = data.filter((i) => i.symbol.endsWith("USDT"));
      const sortedByPercentDesc = [...usdtPairs].sort(
        (a, b) =>
          parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
      );

      return {
        gainers: sortedByPercentDesc.slice(0, 10),
        losers: sortedByPercentDesc.slice(-10).reverse(),
      };
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
};
