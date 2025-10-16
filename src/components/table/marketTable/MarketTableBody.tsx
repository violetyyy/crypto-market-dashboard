"use client";

import React from "react";
import type { BinanceTicker24hr } from "@/types/binance";
import { TableBody } from "../../ui/table";
import { MarketTableRow } from "./MarketTableRow";

type MarketTableBodyProps = {
  data: BinanceTicker24hr[];
  currency: string;
  convertFromUSD: (amount: number) => number;
  marketCapData: Record<string, number>;
  isFavorite: (symbol: string) => boolean;
  toggleFavorite: (symbol: string) => void;
  onSelectSymbol?: (symbol: string) => void;
};

export const MarketTableBody = ({
  data,
  currency,
  convertFromUSD,
  marketCapData,
  isFavorite,
  toggleFavorite,
  onSelectSymbol,
}: MarketTableBodyProps) => {
  return (
    <TableBody>
      {data.map((row) => (
        <MarketTableRow
          key={row.symbol}
          data={row}
          currency={currency}
          convertFromUSD={convertFromUSD}
          marketCapData={marketCapData}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          onSelectSymbol={onSelectSymbol}
        />
      ))}
    </TableBody>
  );
};
