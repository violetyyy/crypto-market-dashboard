"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useBinanceData } from "@/hooks/useBinanceData";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useMarketCap } from "@/hooks/useMarketCap";
import type { BinanceTicker24hr } from "@/types/binance";
import SearchBox from "@/components/SearchBox";
import Pagination from "@/components/Pagination";
import { formatNumber, formatPercent, formatPrice } from "@/utils/formatters";
import { useCurrency } from "@/context/CurrencyContext";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "./ui/button";
import SymbolSparkline from "@/components/SymbolSparkline";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Skeleton from "./ui/skeleton";

type SortKey = "symbol" | "lastPrice" | "priceChangePercent" | "volume";
type SortOrder = "asc" | "desc";

type MarketTableProps = {
  onSelectSymbol?: (symbol: string) => void;
};

// Component to render sort direction indicator
const SortIndicator = ({
  currentSortKey,
  sortKey,
  sortOrder,
}: {
  currentSortKey: SortKey;
  sortKey: SortKey;
  sortOrder: SortOrder;
}) => {
  if (currentSortKey !== sortKey) {
    return <ChevronDown className="h-4 w-4 opacity-30" />;
  }
  return sortOrder === "asc" ? (
    <ChevronUp className="h-4 w-4" />
  ) : (
    <ChevronDown className="h-4 w-4" />
  );
};

export default function MarketTable({ onSelectSymbol }: MarketTableProps) {
  const { data, isLoading } = useBinanceData();
  const { currency, convertFromUSD } = useCurrency();
  const { toggleFavorite, isFavorite, favorites } = useFavorites();
  const [query, setQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Get market cap data for current page items
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBox value={query} onChange={setQuery} />
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => {
              setShowFavoritesOnly(!showFavoritesOnly);
              setPage(1);
              if (!showFavoritesOnly) {
                setQuery("");
              }
            }}
            className="flex items-center gap-2 w-full sm:w-auto"
            disabled={favorites.length === 0 && !showFavoritesOnly}
          >
            ⭐{" "}
            {showFavoritesOnly ? "Show All" : `Favorites (${favorites.length})`}
          </Button>
        </div>

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
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, idx) => (
              <Skeleton key={idx} className="h-12 sm:h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead
                    className="cursor-pointer table-header-clickable stable-header table-header-spaced"
                    onClick={() => onSort("symbol")}
                  >
                    <div className="flex items-center gap-1">
                      Symbol
                      <SortIndicator
                        currentSortKey={sortKey}
                        sortKey="symbol"
                        sortOrder={sortOrder}
                      />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer table-header-clickable stable-header table-header-spaced"
                    onClick={() => onSort("lastPrice")}
                  >
                    <div className="flex items-center gap-1">
                      Price ({currency})
                      <SortIndicator
                        currentSortKey={sortKey}
                        sortKey="lastPrice"
                        sortOrder={sortOrder}
                      />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer table-header-clickable stable-header table-header-spaced"
                    onClick={() => onSort("priceChangePercent")}
                  >
                    <div className="flex items-center gap-1">
                      24h Change
                      <SortIndicator
                        currentSortKey={sortKey}
                        sortKey="priceChangePercent"
                        sortOrder={sortOrder}
                      />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer table-header-clickable stable-header table-header-spaced hidden md:table-cell"
                    onClick={() => onSort("volume")}
                  >
                    <div className="flex items-center gap-1">
                      24h Volume
                      <SortIndicator
                        currentSortKey={sortKey}
                        sortKey="volume"
                        sortOrder={sortOrder}
                      />
                    </div>
                  </TableHead>
                  <TableHead className="stable-header text-center table-header-spaced hidden lg:table-cell">
                    Market Cap
                  </TableHead>
                  <TableHead className="stable-header text-center table-header-spaced hidden sm:table-cell">
                    Sparkline
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((r) => {
                  const priceUSD = parseFloat(r.lastPrice);
                  const price = convertFromUSD(priceUSD);
                  const change = parseFloat(r.priceChangePercent);
                  const volume = parseFloat(r.quoteVolume || r.volume);
                  const isUp = change >= 0;
                  const marketCap = marketCapData[r.symbol];
                  const marketCapDisplay = marketCap
                    ? formatPrice(convertFromUSD(marketCap), currency)
                    : "—";
                  return (
                    <TableRow
                      key={r.symbol}
                      className="cursor-pointer transition-colors hover:bg-accent/50 animate-fade-in table-row-spaced"
                      onClick={() => onSelectSymbol?.(r.symbol)}
                    >
                      <TableCell className="font-medium flex items-center gap-1 sm:gap-2 stable-table-cell table-cell-spaced min-w-[120px]">
                        <Button
                          variant={isFavorite(r.symbol) ? "default" : "outline"}
                          size="icon"
                          className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            toggleFavorite(r.symbol);
                          }}
                          aria-label="toggle favorite"
                        >
                          ★
                        </Button>
                        <span className="text-xs sm:text-sm truncate">
                          {r.symbol.replace("USDT", "/USDT")}
                        </span>
                      </TableCell>
                      <TableCell className="stable-table-cell table-cell-spaced text-xs sm:text-sm">
                        {formatPrice(price, currency)}
                      </TableCell>
                      <TableCell
                        className={`stable-table-cell table-cell-spaced text-xs sm:text-sm ${
                          isUp ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {formatPercent(change)}
                      </TableCell>
                      <TableCell className="stable-table-cell table-cell-spaced hidden md:table-cell">
                        {formatNumber(volume, 0)}
                      </TableCell>
                      <TableCell className="stable-table-cell text-center table-cell-spaced hidden lg:table-cell">
                        {marketCapDisplay}
                      </TableCell>
                      <TableCell className="stable-table-cell text-center table-cell-spaced hidden sm:table-cell">
                        <div className="flex justify-center">
                          <SymbolSparkline symbol={r.symbol} isUp={isUp} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
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
}
