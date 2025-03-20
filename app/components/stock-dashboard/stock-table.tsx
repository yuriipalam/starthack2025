import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function StockTable({
  stocks,
  onSelectStock,
  selectedSymbol
}: {
  stocks: any[];
  onSelectStock: (stock: any) => void;
  selectedSymbol: string;
}) {
  const [sortField, setSortField] = useState("symbol");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold">Market Movers</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 text-xs text-zinc-400">
            <tr>
              <th
                className="cursor-pointer p-2 text-left"
                onClick={() => handleSort("symbol")}
              >
                <div className="flex items-center">
                  Symbol
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th
                className="cursor-pointer p-2 text-left"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th
                className="cursor-pointer p-2 text-right"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center justify-end">
                  Last
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th
                className="cursor-pointer p-2 text-right"
                onClick={() => handleSort("change")}
              >
                <div className="flex items-center justify-end">
                  Change
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th
                className="cursor-pointer p-2 text-right"
                onClick={() => handleSort("changePercent")}
              >
                <div className="flex items-center justify-end">
                  % Change
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th
                className="cursor-pointer p-2 text-right"
                onClick={() => handleSort("volume")}
              >
                <div className="flex items-center justify-end">
                  Volume
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
              <th
                className="cursor-pointer p-2 text-right"
                onClick={() => handleSort("marketCap")}
              >
                <div className="flex items-center justify-end">
                  Market Cap
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((stock) => (
              <tr
                key={stock.symbol}
                className={`cursor-pointer border-b border-zinc-800 hover:bg-zinc-800 ${selectedSymbol === stock.symbol ? "bg-zinc-800" : ""}`}
                onClick={() => onSelectStock(stock)}
              >
                <td className="p-2 font-medium">{stock.symbol}</td>
                <td className="p-2 text-zinc-400">{stock.name}</td>
                <td className="p-2 text-right">${stock.price.toFixed(2)}</td>
                <td
                  className={`p-2 text-right ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)}
                </td>
                <td
                  className={`p-2 text-right ${stock.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  <div className="flex items-center justify-end">
                    {stock.changePercent >= 0 ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                    {Math.abs(stock.changePercent).toFixed(2)}%
                  </div>
                </td>
                <td className="p-2 text-right">
                  {(stock.volume / 1000000).toFixed(1)}M
                </td>
                <td className="p-2 text-right">
                  ${(stock.marketCap / 1000000000).toFixed(1)}B
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
