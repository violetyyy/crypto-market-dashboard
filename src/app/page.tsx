"use client";

import TopMovers from "@/components/TopMovers";
import MarketTable from "@/components/MarketTable";
import React from "react";
import CoinDetailModal from "@/components/CoinDetailModal";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import GlobalStats from "@/components/GlobalStats";

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
    <main className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <GlobalStats />
        <CurrencySwitcher />
      </div>
      <TopMovers onSelectSymbol={onSelect} />
      <MarketTable onSelectSymbol={onSelect} />
      <CoinDetailModal symbol={symbol} open={open} onOpenChange={setOpen} />
    </main>
  );
}
