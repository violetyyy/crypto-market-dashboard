export const formatPrice = (value: number, currency: string = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 8,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

export const formatNumber = (
  value: number,
  maximumFractionDigits: number = 2
) => {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(
    value
  );
};

export const formatPercent = (value: number) => {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};
