"use client";

import React from "react";
import Skeleton from "../../ui/skeleton";

export const MarketTableSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, idx) => (
        <Skeleton key={idx} className="h-12 sm:h-14 w-full" />
      ))}
    </div>
  );
};
