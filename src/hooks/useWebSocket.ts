import { useEffect, useRef } from "react";
import { BinanceService } from "@/services";
import { WS_CONFIG } from "@/config";

type TickerMessage = {
  s: string; // symbol
  c: string; // last price
  P: string; // price change percent
  v: string; // base volume
};

type UseWebSocketProps = {
  onTickerUpdate?: (message: TickerMessage) => void;
  throttleMs?: number;
};

export function useWebSocket({
  onTickerUpdate,
  throttleMs = WS_CONFIG.THROTTLE_MS,
}: UseWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const lastEmitRef = useRef<number>(0);

  useEffect(() => {
    const ws = new WebSocket(BinanceService.getWebSocketUrl());
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const now = performance.now();
      if (now - lastEmitRef.current < throttleMs) return;
      lastEmitRef.current = now;
      try {
        const arr = JSON.parse(event.data) as unknown[];
        if (Array.isArray(arr)) {
          for (const item of arr) {
            if (
              typeof item === "object" &&
              item !== null &&
              "s" in item &&
              "c" in item &&
              "P" in item &&
              "v" in item
            ) {
              const msg: TickerMessage = {
                s: (item as { s: string }).s,
                c: (item as { c: string }).c,
                P: (item as { P: string }).P,
                v: (item as { v: string }).v,
              };
              onTickerUpdate?.(msg);
            }
          }
        }
      } catch {
        // ignore malformed
      }
    };

    ws.onerror = () => {
      // allow effect cleanup to recreate on error in future mounts
    };

    return () => {
      try {
        ws.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    };
  }, [onTickerUpdate, throttleMs]);
}
