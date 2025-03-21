import { TrendingUp, Building2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Suggestion } from "@/store";
import { useEffect, useRef } from "react";

interface SuggestionPanelProps {
  suggestions: Suggestion[];
  selectedIndex: number;
  onSelect: (suggestion: Suggestion) => void;
}

export function SuggestionPanel({
  suggestions,
  selectedIndex,
  onSelect
}: SuggestionPanelProps) {
  if (!suggestions.length) return null;

  const containerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (containerRef.current && selectedItemRef.current) {
      const container = containerRef.current;
      const selectedItem = selectedItemRef.current;

      const containerRect = container.getBoundingClientRect();
      const selectedRect = selectedItem.getBoundingClientRect();

      if (selectedRect.bottom > containerRect.bottom) {
        // Scroll down if selected item is below viewport
        selectedItem.scrollIntoView({ block: 'end', behavior: 'smooth' });
      } else if (selectedRect.top < containerRect.top) {
        // Scroll up if selected item is above viewport
        selectedItem.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-full left-0 right-0 mb-2 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-md w-full min-w-[300px]"
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={'question' in suggestion ? `${suggestion.name}-${suggestion.question}` : suggestion.name}
          ref={index === selectedIndex ? selectedItemRef : null}
          className={cn(
            "flex w-full items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-accent whitespace-nowrap",
            index === selectedIndex && "bg-accent"
          )}
          onClick={() => onSelect(suggestion)}
        >
          <div className="flex items-center gap-2 min-w-0">
            <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium truncate">
              {'question' in suggestion ? `why ${suggestion.name} ${suggestion.question}` : suggestion.name}
            </span>
          </div>
          <div className="flex flex-col items-end min-w-0">
            {!('question' in suggestion) && (
              <>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{suggestion.sector}</span>
                </span>
                <span className={cn(
                  "flex items-center gap-1 text-xs",
                  suggestion.change >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {suggestion.change >= 0 ? (
                    <ArrowUp className="h-3 w-3 flex-shrink-0" />
                  ) : (
                    <ArrowDown className="h-3 w-3 flex-shrink-0" />
                  )}
                  <span>{suggestion.changePercent.toFixed(2)}%</span>
                </span>
              </>
            )}
          </div>
        </button>
      ))}
    </div>
  );
} 