"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Tooltip,
} from "recharts";
import { formatNumber, formatPrice } from "@/utils/formatters";
import axios from "axios";

type CoinDetailModalProps = {
  symbol: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

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

export const CoinDetailModal = ({
  symbol,
  open,
  onOpenChange,
}: CoinDetailModalProps) => {
  const [loading, setLoading] = useState(false);
  const [klines, setKlines] = useState<Kline[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!symbol) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get<Kline[]>(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=15m&limit=96`
        );
        if (!cancelled) setKlines(data);
      } catch {
        if (!cancelled) setError("Failed to load chart");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  const chartData = useMemo(() => {
    return klines.map((k) => ({ time: k[0], close: Number(k[4]) }));
  }, [klines]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {symbol ? symbol.replace("USDT", "/USDT") : ""}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                >
                  <YAxis
                    domain={["auto", "auto"]}
                    width={56}
                    tickFormatter={(v) => formatNumber(Number(v), 4)}
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      });
                    }}
                  />
                  <Tooltip
                    formatter={(v: number) => formatPrice(Number(v), "USD")}
                    labelFormatter={() => ""}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#22c55e"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {/* Simple stats */}
          {!loading && !error && klines.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Stat
                label="24h High"
                value={formatPrice(
                  Math.max(...klines.map((k) => Number(k[2]))),
                  "USD"
                )}
              />
              <Stat
                label="24h Low"
                value={formatPrice(
                  Math.min(...klines.map((k) => Number(k[3]))),
                  "USD"
                )}
              />
              <Stat
                label="24h Volume"
                value={formatNumber(
                  klines.reduce((a, k) => a + Number(k[7]), 0),
                  0
                )}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gray-700 bg-gray-900 p-3">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  );
}
