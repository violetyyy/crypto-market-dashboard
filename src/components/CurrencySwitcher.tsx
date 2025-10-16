"use client";

import React from "react";
import { useCurrency } from "@/context/CurrencyContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[120px] text-white">
          {currency}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setCurrency("USD")}>
          USD
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency("EUR")}>
          EUR
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency("MNT")}>
          MNT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
