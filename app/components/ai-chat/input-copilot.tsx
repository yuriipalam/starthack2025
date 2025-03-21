import React, { useRef, useEffect } from "react";
import { Input } from "@/ui/input";
import { cn } from "@/lib/utils";
import { useUiStore, StockSuggestion, WhyQuestionSuggestion } from "@/store";
import { stockData } from "@/lib/mock-data";
import { SuggestionPanel } from "./suggestion-panel";

type Suggestion = StockSuggestion | WhyQuestionSuggestion;

// Transform stock data for autocomplete
const mockStocks = stockData.map(stock => ({
  name: stock.name.split(' ')[0], // Use first word of company name
  sector: "Technology", // Default sector since it's not in the data
  price: stock.price,
  change: stock.change,
  changePercent: stock.changePercent,
  symbol: stock.symbol
}));

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

    // Check if there's an @ symbol anywhere in the string
    const atSymbolIndex = newValue.lastIndexOf('@');
    if (atSymbolIndex !== -1) {
      const searchTerm = newValue.slice(atSymbolIndex + 1).toLowerCase();
      const filteredStocks = mockStocks.filter(
        (stock) => stock.name.toLowerCase().includes(searchTerm)
      );
      setSearchSuggestions(filteredStocks);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else if (newValue.toLowerCase().startsWith("why ")) {
      const searchTerm = newValue.slice(4).toLowerCase();
      const matchingStocks = mockStocks.filter(
        (stock) => stock.name.toLowerCase() === searchTerm
      );
      
      if (matchingStocks.length > 0) {
        const suggestions = matchingStocks.flatMap(stock => 
          whyQuestions.map(question => ({
            name: stock.name,
            question: question,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changePercent,
            symbol: stock.symbol
          }))
        );
        setSearchSuggestions(suggestions);
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
      setShowSuggestions(false);
      setSearchSuggestions([]);
    } else {
      // Find the last @ symbol position
      const atSymbolIndex = value.lastIndexOf('@');
      if (atSymbolIndex !== -1) {
        // Replace everything after the @ symbol with the selected company
        const newValue = value.slice(0, atSymbolIndex) + `@${suggestion.name} `;
        onChange(newValue);
        
        // If this was after "why", show why questions
        if (newValue.toLowerCase().startsWith("why ")) {
          const suggestions = whyQuestions.map(question => ({
            name: suggestion.name,
            question: question,
            price: suggestion.price,
            change: suggestion.change,
            changePercent: suggestion.changePercent,
            symbol: suggestion.symbol
          }));
          setSearchSuggestions(suggestions);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } else {
          setShowSuggestions(false);
          setSearchSuggestions([]);
        }
      }
    }
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
      {showSuggestions && (
        <SuggestionPanel
          suggestions={searchSuggestions}
          selectedIndex={selectedIndex}
          onSelect={handleSuggestionSelect}
        />
      )}
    </div>
  );
}
