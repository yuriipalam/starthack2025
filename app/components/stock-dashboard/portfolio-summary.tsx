export function PortfolioSummary({ portfolio }: { portfolio: any }) {
  const totalValue = portfolio.totalValue;
  const dailyChange = portfolio.dailyChange;
  const dailyChangePercent = portfolio.dailyChangePercent;

  return (
    <div className="rounded-md bg-zinc-900 p-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Portfolio</h2>
        <button className="text-xs text-zinc-400 hover:text-zinc-200">
          Details
        </button>
      </div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-xs text-zinc-400">Total Value</div>
          <div className="text-xl font-bold">
            ${totalValue.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-400">Today's Change</div>
          <div
            className={`text-sm font-semibold ${dailyChange >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {dailyChange >= 0 ? "+" : ""}
            {dailyChange.toFixed(2)} ({dailyChangePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative h-16 w-16">
          <PieChart holdings={portfolio.holdings} />
        </div>
        <div className="grid flex-grow grid-cols-2 gap-1">
          {portfolio.holdings.slice(0, 4).map((holding: any, index: number) => (
            <div key={index} className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: getColor(index) }}
              ></div>
              <div className="truncate text-xs">{holding.symbol}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PieChart({ holdings }: { holdings: any[] }) {
  // This is a simplified pie chart representation
  const total = holdings.reduce((sum, holding) => sum + holding.value, 0);
  let startAngle = 0;

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {holdings.map((holding, index) => {
        const percentage = holding.value / total;
        const endAngle = startAngle + percentage * 360;

        const x1 = 50 + 50 * Math.cos(((startAngle - 90) * Math.PI) / 180);
        const y1 = 50 + 50 * Math.sin(((startAngle - 90) * Math.PI) / 180);
        const x2 = 50 + 50 * Math.cos(((endAngle - 90) * Math.PI) / 180);
        const y2 = 50 + 50 * Math.sin(((endAngle - 90) * Math.PI) / 180);

        const largeArcFlag = percentage > 0.5 ? 1 : 0;

        const pathData = [
          `M 50 50`,
          `L ${x1} ${y1}`,
          `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
          `Z`
        ].join(" ");

        const path = <path key={index} d={pathData} fill={getColor(index)} />;

        startAngle = endAngle;
        return path;
      })}
    </svg>
  );
}

function getColor(index: number) {
  const colors = [
    "#3b82f6", // blue
    "#22c55e", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899" // pink
  ];

  return colors[index % colors.length];
}
