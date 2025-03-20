import React, { useRef, useEffect } from "react";
import { Input } from "@/ui/input";
import { TrendingUp, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";

// Mock stock data for autocomplete
const mockStocks = [
  { name: "Apple", sector: "Technology" },
  { name: "Google", sector: "Technology" },
  { name: "Microsoft", sector: "Technology" },
  { name: "Amazon", sector: "Consumer Discretionary" },
  { name: "Meta", sector: "Technology" },
  { name: "Tesla", sector: "Automotive" },
  { name: "NVIDIA", sector: "Technology" },
  { name: "JPMorgan", sector: "Financial" },
  { name: "Visa", sector: "Financial" },
  { name: "Walmart", sector: "Retail" },
  { name: "Johnson & Johnson", sector: "Healthcare" },
  { name: "Procter & Gamble", sector: "Consumer Goods" },
  { name: "Mastercard", sector: "Financial" },
  { name: "Home Depot", sector: "Retail" },
  { name: "Chevron", sector: "Energy" },
  { name: "Coca-Cola", sector: "Consumer Goods" },
  { name: "Pfizer", sector: "Healthcare" },
  { name: "Bank of America", sector: "Financial" },
  { name: "Pepsi", sector: "Consumer Goods" },
  { name: "Thermo Fisher", sector: "Healthcare" }
];

const whyQuestions = [
  "stocks go up?",
  "stocks go down?",
  "stock price is high?",
  "stock price is low?",
  "stock is volatile?",
  "stock is trending?",
  "stock is popular?",
  "stock is risky?",
  "stock is a good investment?",
  "stock is performing well?"
];

interface StockSuggestion {
  name: string;
  sector: string;
}

interface WhyQuestionSuggestion {
  name: string;
  question: string;
}

type Suggestion = StockSuggestion | WhyQuestionSuggestion;

interface InputCopilotProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: Suggestion) => void;
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
        (stock) => stock.name.toLowerCase().includes(searchTerm)
      );
      setSearchSuggestions(filteredStocks as StockSuggestion[]);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else if (newValue.toLowerCase().startsWith("why ")) {
      const searchTerm = newValue.slice(4).toLowerCase();
      const matchingStocks = mockStocks.filter(
        (stock) => stock.name.toLowerCase().includes(searchTerm)
      );
      
      if (matchingStocks.length > 0) {
        const suggestions = matchingStocks.flatMap(stock => 
          whyQuestions.map(question => ({
            name: stock.name,
            question: question
          }))
        );
        setSearchSuggestions(suggestions as WhyQuestionSuggestion[]);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } else {
        setShowSuggestions(false);
        setSearchSuggestions([]);
      }
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

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    if ('question' in suggestion) {
      onChange(`why ${suggestion.name} ${suggestion.question}`);
    } else {
      onChange(`@${suggestion.name} `);
    }
    setShowSuggestions(false);
    setSearchSuggestions([]);
    onSelect?.(suggestion);
  };

  return (
    <div className="relative flex-1" ref={inputRef}>
      <Input
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn("w-full", className)}
      />
      {showSuggestions && searchSuggestions.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md w-full min-w-[300px]">
          {searchSuggestions.map((suggestion, index) => (
            <button
              key={'question' in suggestion ? `${suggestion.name}-${suggestion.question}` : suggestion.name}
              className={cn(
                "flex w-full items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-accent whitespace-nowrap",
                index === selectedIndex && "bg-accent"
              )}
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="font-medium truncate">
                  {'question' in suggestion ? `why ${suggestion.name} ${suggestion.question}` : suggestion.name}
                </span>
              </div>
              <div className="flex flex-col items-end min-w-0">
                {!('question' in suggestion) && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{suggestion.sector}</span>
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
