"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Currency = "USD" | "EUR" | "MNT";

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convertFromUSD: (amountInUSD: number) => number;
  rates: Record<Currency, number>; // relative to USD
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined
);

const DEFAULT_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  MNT: 3450,
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [rates] = useState(DEFAULT_RATES);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem("currency")
        : null;
    if (saved === "USD" || saved === "EUR" || saved === "MNT") {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem("currency", c);
    } catch {}
  };

  const convertFromUSD = (amountInUSD: number) => amountInUSD * rates[currency];

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency, convertFromUSD, rates }),
    [currency, rates]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
