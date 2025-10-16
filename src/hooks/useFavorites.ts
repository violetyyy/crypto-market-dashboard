"use client";

import { useEffect, useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("favorites");
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  const isFavorite = (symbol: string) => favorites.includes(symbol);

  return { favorites, toggleFavorite, isFavorite };
}
