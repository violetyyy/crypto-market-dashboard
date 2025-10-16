"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrencyProvider } from "@/context/CurrencyContext";

type ProvidersProps = {
  children: React.ReactNode;
};

// Create a single QueryClient instance for the app
const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>{children}</CurrencyProvider>
    </QueryClientProvider>
  );
}
