export function MarketOverview({ indices }: { indices: any[] }) {
  return (
    <div className="rounded-md bg-zinc-900 p-2">
      <h2 className="mb-2 text-sm font-semibold">Market Overview</h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
        {indices.map((index) => (
          <div key={index.symbol} className="rounded bg-zinc-800 p-2">
            <div className="text-xs text-zinc-400">{index.name}</div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{index.value.toFixed(2)}</span>
              <span
                className={`text-xs ${index.change >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {index.change >= 0 ? "+" : ""}
                {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
