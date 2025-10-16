import { useQuery } from "@tanstack/react-query";
import { BinanceService } from "@/services";

export function useSparkline(
  symbol: string | undefined,
  enabled: boolean = true
) {
  return useQuery<number[]>({
    queryKey: ["sparkline", symbol],
    enabled: Boolean(symbol) && enabled,
    queryFn: async () => {
      if (!symbol) return [];
      const data = await BinanceService.getKlines(symbol, "5m", 50);
      return data.map((k) => Number(k[4])); // close prices
    },
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
}
