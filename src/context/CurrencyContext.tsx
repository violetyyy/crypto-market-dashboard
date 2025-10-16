"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import { CURRENCY_CONFIG } from "@/config";

type Currency = (typeof CURRENCY_CONFIG.SUPPORTED_CURRENCIES)[number];

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
  EUR: CURRENCY_CONFIG.PLACEHOLDER_RATES.EUR,
  MNT: CURRENCY_CONFIG.PLACEHOLDER_RATES.MNT,
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(
    CURRENCY_CONFIG.DEFAULT_CURRENCY
  );
  const [rates] = useState(DEFAULT_RATES);

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem("currency")
        : null;
    if (
      saved &&
      CURRENCY_CONFIG.SUPPORTED_CURRENCIES.includes(saved as Currency)
    ) {
      setCurrencyState(saved as Currency);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem("currency", c);
    } catch {}
  };

  const convertFromUSD = useCallback(
    (amountInUSD: number) => amountInUSD * rates[currency],
    [currency, rates]
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency, convertFromUSD, rates }),
    [currency, rates, convertFromUSD]
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
