"use client";

import React, { useMemo } from "react";

type SparklineProps = {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  strokeWidth?: number;
};

export const Sparkline = ({
  data,
  color = "#22c55e",
  height = 32,
  width = 120,
  strokeWidth = 2,
}: SparklineProps) => {
  const points = useMemo(() => {
    if (!data || data.length === 0) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const stepX = width / Math.max(1, data.length - 1);
    return data
      .map((v, i) => {
        const x = i * stepX;
        const y = height - ((v - min) / span) * height;
        return `${x},${y}`;
      })
      .join(" ");
  }, [data, height, width]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        points={points}
      />
    </svg>
  );
};
