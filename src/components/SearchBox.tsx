"use client";

import React from "react";
import { Input } from "@/components/ui/input";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search symbol...",
}: SearchBoxProps) {
  return (
    <div className="w-full max-w-sm">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
}
