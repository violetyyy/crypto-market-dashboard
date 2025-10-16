"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SearchBox } from "../SearchBox";

type MarketTableFiltersProps = {
  query: string;
  setQuery: (query: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  setPage: (page: number) => void;
  favoritesCount: number;
};

export const MarketTableFilters = ({
  query,
  setQuery,
  showFavoritesOnly,
  setShowFavoritesOnly,
  setPage,
  favoritesCount,
}: MarketTableFiltersProps) => {
  const handleFavoritesToggle = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
    setPage(1);
    if (!showFavoritesOnly) {
      setQuery("");
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchBox value={query} onChange={setQuery} />
      <Button
        variant={showFavoritesOnly ? "default" : "outline"}
        onClick={handleFavoritesToggle}
        className="flex items-center gap-2 w-full sm:w-auto"
        disabled={favoritesCount === 0 && !showFavoritesOnly}
      >
        ⭐ {showFavoritesOnly ? "Show All" : `Favorites (${favoritesCount})`}
      </Button>
    </div>
  );
};
