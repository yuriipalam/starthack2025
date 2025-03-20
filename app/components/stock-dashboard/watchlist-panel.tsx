import { Star, ChevronDown, ChevronUp } from "lucide-react";

export function WatchlistPanel({
  watchlist,
  onSelectStock
}: {
  watchlist: any[];
  onSelectStock: (stock: any) => void;
}) {
  return (
    <div className="flex-grow rounded-md bg-zinc-900 p-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Watchlist</h2>
        <button className="text-xs text-zinc-400 hover:text-zinc-200">
          Edit
        </button>
      </div>
      <div className="space-y-1">
        {watchlist.map((item) => (
          <div
            key={item.symbol}
            className="flex cursor-pointer items-center justify-between rounded p-1.5 hover:bg-zinc-800"
            onClick={() => onSelectStock(item)}
          >
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <div>
                <div className="text-sm font-medium">{item.symbol}</div>
                <div className="text-xs text-zinc-400">{item.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm">${item.price.toFixed(2)}</div>
              <div
                className={`flex items-center justify-end text-xs ${item.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {item.changePercent >= 0 ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                {Math.abs(item.changePercent).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
