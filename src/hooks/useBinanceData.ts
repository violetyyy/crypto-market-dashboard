import { useQuery } from "@tanstack/react-query";
import { BinanceService } from "@/services";
import { CACHE_CONFIG } from "@/config";
import type { BinanceTicker24hr } from "@/types/binance";

export const useBinanceData = () => {
  return useQuery<BinanceTicker24hr[]>({
    queryKey: ["binance", "ticker24hr"],
    queryFn: async () => {
      const data = await BinanceService.getTicker24hr();
      return BinanceService.filterUSDTpairs(data);
    },
    refetchInterval: CACHE_CONFIG.PRICE_REFRESH_INTERVAL,
    staleTime: CACHE_CONFIG.STALE_TIME,
  });
};
