import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Kline = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string
];

export function useSparkline(
  symbol: string | undefined,
  enabled: boolean = true
) {
  return useQuery<number[]>({
    queryKey: ["sparkline", symbol],
    enabled: Boolean(symbol) && enabled,
    queryFn: async () => {
      const { data } = await axios.get<Kline[]>(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=50`
      );
      return data.map((k) => Number(k[4])); // close prices
    },
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
}
