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
    <div className="w-[400px]">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="max-w-sm"
      />
    </div>
  );
}
