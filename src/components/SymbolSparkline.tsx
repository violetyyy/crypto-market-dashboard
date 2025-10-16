"use client";

import React from "react";
import Sparkline from "@/components/Sparkline";
import { useSparkline } from "@/hooks/useSparkline";

type Props = {
  symbol: string;
  colorUp?: string;
  colorDown?: string;
  isUp?: boolean;
  height?: number;
};

export default function SymbolSparkline({
  symbol,
  isUp = true,
  colorUp = "#22c55e",
  colorDown = "#ef4444",
  height = 28,
}: Props) {
  const { data } = useSparkline(symbol);
  if (!data) return null;
  return (
    <Sparkline data={data} color={isUp ? colorUp : colorDown} height={height} />
  );
}
