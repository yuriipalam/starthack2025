import { useState } from "react";
import { MarketOverview } from "./market-overview";
import { StockTable } from "./stock-table";
import { StockChart } from "./stock-chart";
import { WatchlistPanel } from "./watchlist-panel";
import { NewsPanel } from "./news-panel";
import { PortfolioSummary } from "./portfolio-summary";
import { Header } from "./header";
import {
  marketIndices,
  stockData,
  portfolioData,
  watchlistData,
  newsData
} from "@/lib/mock-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/ui/tooltip";
import { ArrowRightIcon, BotMessageSquare } from "lucide-react";
import { Button } from "@/ui/button";
import { useUiStore } from "@/store";

export function StockDashboard() {
  const [selectedStock, setSelectedStock] = useState(stockData[0]);
  const [timeframe, setTimeframe] = useState("1D");

  const handleStockSelect = (stock: any) => {
    setSelectedStock(stock);
  };
  const setSendMessage = useUiStore((state) => state.setSendMessage);

  return (
    <div className="flex flex-col">
      <Header />
      <div className="mt-[48px] grid flex-grow grid-cols-1 gap-2 overflow-hidden p-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-3">
          <MarketOverview indices={marketIndices} />
          <div className="flex-grow rounded-md bg-zinc-900 p-2">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <h2 className="text-lg font-bold">{selectedStock.symbol}</h2>
                  <TooltipProvider delayDuration={500}>
                    <Tooltip>
                      <TooltipTrigger className="ml-2">
                        <BotMessageSquare className="hover:text-primary size-4 cursor-pointer transition-colors" />{" "}
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-background flex flex-col items-start gap-2"
                        align="start"
                        side="right"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSendMessage({
                              question: `Explain the stock price of ${selectedStock.symbol}`,
                              stock: selectedStock
                            })
                          }
                        >
                          Explain the stock price of {selectedStock.symbol}{" "}
                          <ArrowRightIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSendMessage({
                              question: `Why does the stock price of ${selectedStock.symbol} keep going up?`,
                              stock: selectedStock
                            })
                          }
                        >
                          Why does the stock price of {selectedStock.symbol}{" "}
                          keep going up?
                          <ArrowRightIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSendMessage({
                              question: `What is the forecast for ${selectedStock.symbol}?`,
                              stock: selectedStock
                            })
                          }
                        >
                          What is the forecast for {selectedStock.symbol}?{" "}
                          <ArrowRightIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSendMessage({
                              question: `When did ${selectedStock.symbol} go public as IPO?`,
                              stock: selectedStock
                            })
                          }
                        >
                          When did {selectedStock.symbol} go public as IPO?{" "}
                          <ArrowRightIcon />
                        </Button>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold">
                    ${selectedStock.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm ${selectedStock.change >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {selectedStock.change >= 0 ? "+" : ""}
                    {selectedStock.change.toFixed(2)} (
                    {selectedStock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((period) => (
                  <button
                    key={period}
                    className={`rounded px-2 py-1 text-xs ${timeframe === period ? "bg-blue-600" : "bg-zinc-800"}`}
                    onClick={() => setTimeframe(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <StockChart symbol={selectedStock.symbol} timeframe={timeframe} />
          </div>
          <div className="overflow-auto rounded-md bg-zinc-900 p-2">
            <StockTable
              stocks={stockData}
              onSelectStock={handleStockSelect}
              selectedSymbol={selectedStock.symbol}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <PortfolioSummary portfolio={portfolioData} />
          <WatchlistPanel
            watchlist={watchlistData}
            onSelectStock={handleStockSelect}
          />
          <NewsPanel news={newsData} />
        </div>
      </div>
    </div>
  );
}
