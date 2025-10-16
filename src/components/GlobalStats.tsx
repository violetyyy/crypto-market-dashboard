"use client";

import React, { useMemo } from "react";
import { useBinanceData } from "@/hooks/useBinanceData";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/utils/formatters";

export default function GlobalStats() {
  const { data } = useBinanceData();

  const { totalQuoteVolume, btcQuoteVolume, btcDominance } = useMemo(() => {
    const usdt = data || [];
    const total = usdt.reduce((a, r) => a + Number(r.quoteVolume || 0), 0);
    const btc = usdt
      .filter((r) => r.symbol === "BTCUSDT")
      .reduce((a, r) => a + Number(r.quoteVolume || 0), 0);
    const dom = total > 0 ? (btc / total) * 100 : 0;
    return { totalQuoteVolume: total, btcQuoteVolume: btc, btcDominance: dom };
  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <div className="flex flex-col justify-center items-center h-full w-full px-6 py-4">
          <div className="text-xs text-muted-foreground">
            Total 24h Volume (USDT)
          </div>
          <div className="text-lg font-semibold">
            {formatNumber(totalQuoteVolume, 0)}
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex flex-col justify-center items-center h-full w-full">
          <div className="text-xs text-muted-foreground">
            BTC 24h Volume (USDT)
          </div>
          <div className="text-lg font-semibold">
            {formatNumber(btcQuoteVolume, 0)}
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex flex-col justify-center items-center h-full w-full">
          <div className="text-xs text-muted-foreground">BTC Dominance</div>
          <div className="text-lg font-semibold">
            {btcDominance.toFixed(2)}%
          </div>
        </div>
      </Card>
    </div>
  );
}
