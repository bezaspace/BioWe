"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  variant?: "navbar" | "default";
}

export function SearchInput({
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  className,
  autoFocus,
  variant = "default"
}: SearchInputProps) {
  const [value, setValue] = useState(controlledValue || "");

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  const clearSearch = () => {
    handleChange("");
  };

  return (
    <div className={cn(
      "relative flex items-center",
      variant === "navbar" ? "w-[200px] md:w-[300px]" : "w-full max-w-lg",
      className
    )}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          "pl-9 pr-9",
          value ? "rounded-r-none" : "",
          variant === "navbar" ? "h-9" : ""
        )}
      />
      {value && (
        <button
          onClick={clearSearch}
          className={cn(
            "absolute right-3 text-muted-foreground hover:text-foreground transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "h-4 w-4 rounded-sm"
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
}
