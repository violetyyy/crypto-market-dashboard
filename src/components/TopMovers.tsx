"use client";

import React from "react";
import { useTopMovers } from "@/hooks/useTopMovers";
import { formatPercent, formatPrice } from "@/utils/formatters";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Skeleton from "./ui/skeleton";
import SymbolSparkline from "@/components/SymbolSparkline";

type TopMoversProps = {
  onSelectSymbol?: (symbol: string) => void;
};

export default function TopMovers({ onSelectSymbol }: TopMoversProps) {
  const { data, isLoading } = useTopMovers();
  const { currency, convertFromUSD } = useCurrency();

  const renderRows = (items: any[] | undefined) => {
    if (!items) return null;
    return items.map((i) => {
      const percent = parseFloat(i.priceChangePercent);
      const lastPrice = convertFromUSD(parseFloat(i.lastPrice));
      const isPositive = percent >= 0;
      return (
        <TableRow
          key={i.symbol}
          className="cursor-pointer transition-colors hover:bg-accent/50 animate-fade-in table-row-spaced"
          onClick={() => onSelectSymbol?.(i.symbol)}
        >
          <TableCell className="font-medium stable-table-cell table-cell-spaced text-xs sm:text-sm">
            {i.symbol.replace("USDT", "/USDT")}
          </TableCell>
          <TableCell className="stable-table-cell table-cell-spaced text-xs sm:text-sm">
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {formatPercent(percent)}
            </span>
          </TableCell>
          <TableCell className="text-right stable-table-cell table-cell-spaced text-xs sm:text-sm">
            {formatPrice(lastPrice, currency)}
          </TableCell>
          <TableCell className="stable-table-cell text-center table-cell-spaced hidden sm:table-cell">
            <div className="flex justify-center">
              <SymbolSparkline
                symbol={i.symbol}
                isUp={isPositive}
                height={28}
              />
            </div>
          </TableCell>
        </TableRow>
      );
    });
  };

  const LoadingTable = () => (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, idx) => (
        <Skeleton key={idx} className="h-6 w-full" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏆 Top Gainers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="stable-header table-header-spaced">
                      Symbol
                    </TableHead>
                    <TableHead className="stable-header table-header-spaced">
                      %
                    </TableHead>
                    <TableHead className="text-right stable-header table-header-spaced">
                      Price
                    </TableHead>
                    <TableHead className="stable-header text-center table-header-spaced hidden sm:table-cell">
                      Spark
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderRows(data?.gainers)}</TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📉 Top Losers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="stable-header table-header-spaced">
                      Symbol
                    </TableHead>
                    <TableHead className="stable-header table-header-spaced">
                      %
                    </TableHead>
                    <TableHead className="text-right stable-header table-header-spaced">
                      Price
                    </TableHead>
                    <TableHead className="stable-header text-center table-header-spaced hidden sm:table-cell">
                      Spark
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{renderRows(data?.losers)}</TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
