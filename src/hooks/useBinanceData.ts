import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { BinanceTicker24hr } from "@/types/binance";

export const useBinanceData = () => {
  return useQuery<BinanceTicker24hr[]>({
    queryKey: ["binance", "ticker24hr"],
    queryFn: async () => {
      const { data } = await axios.get<BinanceTicker24hr[]>(
        "https://api.binance.com/api/v3/ticker/24hr"
      );
      return data.filter((i) => i.symbol.endsWith("USDT"));
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
};
