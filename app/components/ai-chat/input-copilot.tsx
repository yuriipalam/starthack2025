import React, { useRef, useEffect } from "react";
import { Input } from "@/ui/input";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";
import type {
  StockSuggestion as IStockSuggestion,
  WhyQuestionSuggestion as IWhyQuestionSuggestion
} from "@/store";
import { stockData } from "@/lib/mock-data";
import { SuggestionPanel } from "./suggestion-panel";

type Suggestion = IStockSuggestion | IWhyQuestionSuggestion;

// Transform stock data for autocomplete
const mockStocks = stockData.map((stock) => ({
  name: stock.name.split(" ")[0], // Use first word of company name
  sector: "Technology", // Default sector since it's not in the data
  price: stock.price,
  change: stock.change,
  changePercent: stock.changePercent,
  symbol: stock.symbol
}));

interface InputCopilotProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: IStockSuggestion | IWhyQuestionSuggestion) => void;
  sendMessage: () => void;
  placeholder?: string;
  className?: string;
}

// Function to analyze stock performance and generate relevant questions
const generateStockQuestions = (
  stock: (typeof mockStocks)[0]
): IWhyQuestionSuggestion[] => {
  // Create base question object
  const createQuestion = (question: string) => ({
    name: stock.name,
    question,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    symbol: stock.symbol
  });

  const questions: IWhyQuestionSuggestion[] = [];

  // Price movement analysis
  if (stock.change > 0) {
    questions.push(
      createQuestion(
        `stock price increased by ${stock.changePercent.toFixed(2)}%?`
      )
    );
    if (stock.changePercent > 5) {
      questions.push(createQuestion("stock had such a significant rise?"));
    }
  } else if (stock.change < 0) {
    questions.push(
      createQuestion(
        `stock price decreased by ${Math.abs(stock.changePercent).toFixed(2)}%?`
      )
    );
    if (stock.changePercent < -5) {
      questions.push(createQuestion("stock had such a significant drop?"));
    }
  }

  // Price level analysis
  if (stock.price > 100) {
    questions.push(createQuestion("stock price is relatively high?"));
  } else if (stock.price < 20) {
    questions.push(createQuestion("stock price is relatively low?"));
  }

  // Volatility/trend questions
  if (stock.symbol === "NVDA") {
    questions.push(createQuestion("stock showing high volatility?"));
  }

  // Add general analysis questions
  questions.push(createQuestion("current market sentiment?"));

  return questions;
};

export function InputCopilot({
  value,
  onChange,
  onSelect,
  sendMessage,
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
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
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
    const atSymbolIndex = newValue.lastIndexOf("@");
    if (atSymbolIndex !== -1) {
      const searchTerm = newValue.slice(atSymbolIndex + 1).toLowerCase();
      const filteredStocks = mockStocks.filter(
        (stock) =>
          stock.name.toLowerCase().includes(searchTerm) ||
          stock.symbol.toLowerCase().includes(searchTerm)
      );
      setSearchSuggestions(filteredStocks);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      // Check for "why {stock}" pattern
      const whyMatch = newValue.toLowerCase().match(/^why\s+(\w+)\s*$/);
      if (whyMatch) {
        const stockName = whyMatch[1];
        const matchingStocks = mockStocks.filter(
          (stock) =>
            stock.name.toLowerCase() === stockName ||
            stock.symbol.toLowerCase() === stockName
        );

        if (matchingStocks.length > 0) {
          const suggestions = generateStockQuestions(matchingStocks[0]);
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions && e.key === "Enter") {
      sendMessage();
      return;
    }
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

  const handleSuggestionSelect = (
    suggestion: IStockSuggestion | IWhyQuestionSuggestion
  ) => {
    if ("question" in suggestion) {
      // Handle question suggestion
      onChange(`why ${suggestion.name} ${suggestion.question}`);
      setShowSuggestions(false);
      setSearchSuggestions([]);
    } else {
      // Handle stock suggestion
      const atSymbolIndex = value.lastIndexOf("@");
      if (atSymbolIndex !== -1) {
        const newValue = value.slice(0, atSymbolIndex) + `@${suggestion.name} `;
        onChange(newValue);

        // Show why questions after selecting a stock
        const stockData = mockStocks.find((s) => s.name === suggestion.name);
        if (stockData) {
          const suggestions = generateStockQuestions(stockData);
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
