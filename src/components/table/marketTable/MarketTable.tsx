"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useBinanceData } from "@/hooks/useBinanceData";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useMarketCap } from "@/hooks/useMarketCap";
import type { BinanceTicker24hr } from "@/types/binance";
import { useCurrency } from "@/context/CurrencyContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Table } from "../../ui/table";
import { MarketTableHeader } from "./MarketTableHeader";
import { MarketTableBody } from "./MarketTableBody";
import { MarketTableFilters } from "./MarketTableFilters";
import { MarketTableSkeleton } from "./MarketTableSkeleton";
import { Pagination } from "../Pagination";

type SortKey = "symbol" | "lastPrice" | "priceChangePercent" | "volume";
type SortOrder = "asc" | "desc";

type MarketTableProps = {
  onSelectSymbol?: (symbol: string) => void;
};

export const MarketTable = ({ onSelectSymbol }: MarketTableProps) => {
  const { data, isLoading } = useBinanceData();
  const { currency, convertFromUSD } = useCurrency();
  const { toggleFavorite, isFavorite, favorites } = useFavorites();
  const [query, setQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const symbols = useMemo(() => data?.map((r) => r.symbol) || [], [data]);
  const { marketCapData } = useMarketCap(symbols);

  const [liveMap, setLiveMap] = useState<
    Record<string, { c: string; P: string; v: string }>
  >({});

  const onTickerUpdate = useCallback(
    (msg: { s: string; c: string; P: string; v: string }) => {
      if (!msg.s.endsWith("USDT")) return;
      setLiveMap((prev) => ({
        ...prev,
        [msg.s]: { c: msg.c, P: msg.P, v: msg.v },
      }));
    },
    []
  );

  useWebSocket({ onTickerUpdate, throttleMs: 250 });

  const merged: BinanceTicker24hr[] = useMemo(() => {
    if (!data) return [] as BinanceTicker24hr[];
    return data.map((row) => {
      const live = liveMap[row.symbol];
      if (!live) return row;
      return {
        ...row,
        lastPrice: live.c ?? row.lastPrice,
        priceChangePercent: live.P ?? row.priceChangePercent,
        volume: live.v ?? row.volume,
      } as BinanceTicker24hr;
    });
  }, [data, liveMap]);

  const filtered = useMemo(() => {
    let result = merged;

    if (showFavoritesOnly) {
      result = result.filter((r) => isFavorite(r.symbol));
    }

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter((r) => r.symbol.toLowerCase().includes(q));
    }

    return result;
  }, [merged, query, showFavoritesOnly, isFavorite]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let va: number = 0;
      let vb: number = 0;
      if (sortKey === "symbol") {
        return sortOrder === "asc"
          ? a.symbol.localeCompare(b.symbol)
          : b.symbol.localeCompare(a.symbol);
      }
      if (sortKey === "lastPrice") {
        va = parseFloat(a.lastPrice);
        vb = parseFloat(b.lastPrice);
      } else if (sortKey === "priceChangePercent") {
        va = parseFloat(a.priceChangePercent);
        vb = parseFloat(b.priceChangePercent);
      } else if (sortKey === "volume") {
        va = parseFloat(a.quoteVolume || a.volume);
        vb = parseFloat(b.quoteVolume || b.volume);
      }
      return sortOrder === "asc" ? va - vb : vb - va;
    });
    return list;
  }, [filtered, sortKey, sortOrder]);

  const total = sorted.length;
  const start = (page - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Market Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <MarketTableFilters
          query={query}
          setQuery={setQuery}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          setPage={setPage}
          favoritesCount={favorites.length}
        />

        {showFavoritesOnly && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              ⭐ Showing {filtered.length} favorite coin
              {filtered.length !== 1 ? "s" : ""}
            </span>
            {filtered.length === 0 && (
              <span className="text-orange-500">• No favorites found</span>
            )}
          </div>
        )}

        {isLoading ? (
          <MarketTableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <MarketTableHeader
                currency={currency}
                sortKey={sortKey}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <MarketTableBody
                data={pageItems}
                currency={currency}
                convertFromUSD={convertFromUSD}
                marketCapData={marketCapData}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                onSelectSymbol={onSelectSymbol}
              />
            </Table>
          </div>
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
};
