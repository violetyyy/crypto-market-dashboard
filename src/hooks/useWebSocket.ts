import { useEffect, useRef } from "react";

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
  throttleMs = 250,
}: UseWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const lastEmitRef = useRef<number>(0);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const now = performance.now();
      if (now - lastEmitRef.current < throttleMs) return;
      lastEmitRef.current = now;
      try {
        const arr = JSON.parse(event.data) as any[];
        if (Array.isArray(arr)) {
          for (const item of arr) {
            const msg: TickerMessage = {
              s: item.s,
              c: item.c,
              P: item.P,
              v: item.v,
            };
            onTickerUpdate?.(msg);
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
