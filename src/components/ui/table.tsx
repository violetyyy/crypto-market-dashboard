"use client";

import * as React from "react";

export function Table(props: React.HTMLAttributes<HTMLTableElement>) {
  return <table className="w-full caption-bottom text-sm" {...props} />;
}
export function TableHeader(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="[&_tr]:border-b" {...props} />;
}
export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className="[&_tr:last-child]:border-0" {...props} />;
}
export function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" {...props} />;
}
export function TableHead(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground" {...props} />;
}
export function TableCell(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className="p-2 align-middle" {...props} />;
}


