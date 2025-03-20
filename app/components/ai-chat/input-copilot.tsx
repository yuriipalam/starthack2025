import React, { useRef, useEffect } from "react";
import { Input } from "@/ui/input";
import { TrendingUp, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";

// Mock stock data for autocomplete
const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Discretionary" },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology" },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial" },
  { symbol: "V", name: "Visa Inc.", sector: "Financial" },
  { symbol: "WMT", name: "Walmart Inc.", sector: "Retail" }
];

interface InputCopilotProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (stock: { symbol: string; name: string; sector: string }) => void;
  placeholder?: string;
  className?: string;
}

export function InputCopilot({
  value,
  onChange,
  onSelect,
  placeholder = "Type @ to search stocks...",
  className
}: InputCopilotProps) {
  const {
    searchQuery,
    searchSuggestions,
    showSuggestions,
    setSearchQuery,
    setSearchSuggestions,
    setShowSuggestions
  } = useUiStore();

  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSearchQuery(newValue);

    if (newValue.startsWith("@")) {
      const searchTerm = newValue.slice(1).toLowerCase();
      const filteredStocks = mockStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchTerm) ||
          stock.name.toLowerCase().includes(searchTerm) ||
          stock.sector.toLowerCase().includes(searchTerm)
      );
      setSearchSuggestions(filteredStocks);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchSuggestions.length) {
          handleSuggestionSelect(searchSuggestions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionSelect = (stock: { symbol: string; name: string; sector: string }) => {
    onChange(`@${stock.symbol} `);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    onSelect?.(stock);
  };

  return (
    <div className="relative" ref={inputRef}>
      <Input
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn("w-full", className)}
      />
      {showSuggestions && searchSuggestions.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md w-full min-w-[300px]">
          {searchSuggestions.map((stock, index) => (
            <button
              key={stock.symbol}
              className={cn(
                "flex w-full items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-accent whitespace-nowrap",
                index === selectedIndex && "bg-accent"
              )}
              onClick={() => handleSuggestionSelect(stock)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="font-medium truncate">{stock.symbol}</span>
              </div>
              <div className="flex flex-col items-end min-w-0">
                <span className="text-xs font-medium truncate">{stock.name}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{stock.sector}</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
