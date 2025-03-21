import { TrendingUp, Building2, ArrowUp, ArrowDown, Info, HelpCircle, LineChart } from "lucide-react";
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
        selectedItem.scrollIntoView({ block: "end", behavior: "smooth" });
      } else if (selectedRect.top < containerRect.top) {
        // Scroll up if selected item is above viewport
        selectedItem.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  return (
    <div
      ref={containerRef}
      className="bg-popover absolute right-0 bottom-full left-0 mb-2 max-h-48 w-full min-w-[300px] overflow-y-auto rounded-md border shadow-md"
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={
            "question" in suggestion
              ? `${suggestion.name}-${suggestion.question}`
              : suggestion.name
          }
          ref={index === selectedIndex ? selectedItemRef : null}
          className={cn(
            "hover:bg-accent flex w-full items-center justify-between gap-2 px-3 py-2 text-sm whitespace-nowrap",
            index === selectedIndex && "bg-accent"
          )}
          onClick={() => onSelect(suggestion)}
        >
          <div className="flex min-w-0 items-center gap-2">
            {!("question" in suggestion) ? (
              <TrendingUp className="text-muted-foreground h-4 w-4 flex-shrink-0" />
            ) : (
              <HelpCircle className="text-muted-foreground h-4 w-4 flex-shrink-0" />
            )}
            <span className="truncate font-medium">
              {"question" in suggestion
                ? `why ${suggestion.name} ${suggestion.question}`
                : suggestion.name}
            </span>
          </div>
          <div className="flex min-w-0 flex-col items-end">
            {!("question" in suggestion) && (
              <>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Building2 className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{suggestion.sector}</span>
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    suggestion.change >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
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
