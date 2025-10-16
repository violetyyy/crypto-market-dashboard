"use client";

import TopMovers from "@/components/TopMovers";
import { MarketTable } from "@/components/table/marketTable/MarketTable";
import React from "react";
import { CoinDetailModal } from "@/components/table/CoinDetailModal";
import CurrencySwitcher from "@/components/headers/CurrencySwitcher";
import GlobalStats from "@/components/headers/GlobalStats";

function useSymbolSelection() {
  const [symbol, setSymbol] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const onSelect = (s: string) => {
    setSymbol(s);
    setOpen(true);
  };
  return { symbol, open, setOpen, onSelect };
}

export default function Home() {
  const { symbol, open, setOpen, onSelect } = useSymbolSelection();
  return (
    <main className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 space-y-3 sm:space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <GlobalStats />
        </div>
        <div className="flex justify-end">
          <CurrencySwitcher />
        </div>
      </div>
      <TopMovers onSelectSymbol={onSelect} />
      <MarketTable onSelectSymbol={onSelect} />
      <CoinDetailModal symbol={symbol} open={open} onOpenChange={setOpen} />
    </main>
  );
}
