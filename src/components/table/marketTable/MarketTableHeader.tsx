"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SortKey = "symbol" | "lastPrice" | "priceChangePercent" | "volume";
type SortOrder = "asc" | "desc";

type MarketTableHeaderProps = {
  currency: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSort: (key: SortKey) => void;
};

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

export const MarketTableHeader = ({
  currency,
  sortKey,
  sortOrder,
  onSort,
}: MarketTableHeaderProps) => {
  return (
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
  );
};
