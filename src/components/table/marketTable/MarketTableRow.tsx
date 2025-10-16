"use client";

import React from "react";
import type { BinanceTicker24hr } from "@/types/binance";
import { formatNumber, formatPercent, formatPrice } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { SymbolSparkline } from "../../sparkline";

type MarketTableRowProps = {
  data: BinanceTicker24hr;
  currency: string;
  convertFromUSD: (amount: number) => number;
  marketCapData: Record<string, number>;
  isFavorite: (symbol: string) => boolean;
  toggleFavorite: (symbol: string) => void;
  onSelectSymbol?: (symbol: string) => void;
};

export const MarketTableRow = ({
  data,
  currency,
  convertFromUSD,
  marketCapData,
  isFavorite,
  toggleFavorite,
  onSelectSymbol,
}: MarketTableRowProps) => {
  const priceUSD = parseFloat(data.lastPrice);
  const price = convertFromUSD(priceUSD);
  const change = parseFloat(data.priceChangePercent);
  const volume = parseFloat(data.quoteVolume || data.volume);
  const isUp = change >= 0;
  const marketCap = marketCapData[data.symbol];
  const marketCapDisplay = marketCap
    ? formatPrice(convertFromUSD(marketCap), currency)
    : "—";

  return (
    <TableRow
      className="cursor-pointer transition-colors hover:bg-accent/50 animate-fade-in table-row-spaced"
      onClick={() => onSelectSymbol?.(data.symbol)}
    >
      <TableCell className="font-medium flex items-center gap-1 sm:gap-2 stable-table-cell table-cell-spaced min-w-[120px]">
        <Button
          variant={isFavorite(data.symbol) ? "default" : "outline"}
          size="icon"
          className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            toggleFavorite(data.symbol);
          }}
          aria-label="toggle favorite"
        >
          ★
        </Button>
        <span className="text-xs sm:text-sm truncate">
          {data.symbol.replace("USDT", "/USDT")}
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
          <SymbolSparkline symbol={data.symbol} isUp={isUp} />
        </div>
      </TableCell>
    </TableRow>
  );
};
