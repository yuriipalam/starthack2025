import React, { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceDot,
} from "recharts";
import { HelpCircle, TrendingUp, ArrowLeftRight } from "lucide-react";
import { Button } from "@/ui/button";

// Mock data for NVIDIA stock prices with additional context
const mockData = [
  { 
    date: "2024-01", 
    price: 480, 
    high: 495, 
    low: 470,
    events: "AI chip demand surge",
    volume: "15.2M"
  },
  { 
    date: "2024-02", 
    price: 720, 
    high: 735, 
    low: 710,
    events: "New GPU launch",
    volume: "18.5M"
  },
  { 
    date: "2024-03", 
    price: 890, 
    high: 905, 
    low: 875,
    events: "Q4 earnings beat",
    volume: "22.1M"
  },
  { 
    date: "2024-04", 
    price: 850, 
    high: 865, 
    low: 835,
    events: "Market correction",
    volume: "16.8M"
  },
  { 
    date: "2024-05", 
    price: 920, 
    high: 945, 
    low: 905,
    events: "AI partnership announcement",
    volume: "25.3M"
  },
  { 
    date: "2024-06", 
    price: 880, 
    high: 895, 
    low: 865,
    events: "Competitor product launch",
    volume: "17.9M"
  },
  { 
    date: "2024-07", 
    price: 940, 
    high: 960, 
    low: 925,
    events: "New AI chip reveal",
    volume: "23.7M"
  },
].map((item) => ({
  ...item,
  price: Number(item.price.toFixed(2)),
  high: Number(item.high.toFixed(2)),
  low: Number(item.low.toFixed(2)),
}));

// Mock market sentiment data
const marketSentiment = {
  "2024-01": { bullish: 75, bearish: 25, catalysts: ["AI adoption", "Gaming market growth"] },
  "2024-02": { bullish: 85, bearish: 15, catalysts: ["Product innovation", "Market leadership"] },
  "2024-03": { bullish: 90, bearish: 10, catalysts: ["Strong financials", "Industry dominance"] },
  "2024-04": { bullish: 65, bearish: 35, catalysts: ["Market volatility", "Profit taking"] },
  "2024-05": { bullish: 88, bearish: 12, catalysts: ["Strategic partnerships", "AI momentum"] },
  "2024-06": { bullish: 70, bearish: 30, catalysts: ["Competition concerns", "Market share"] },
  "2024-07": { bullish: 82, bearish: 18, catalysts: ["Innovation pipeline", "AI demand"] },
};

export const NvidiaStockChart = () => {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleHighPointClick = (index: number) => {
    setSelectedPoint(index);
    setResponse(null);
    console.log(`Clicked on data point: ${mockData[index].date} - High: ${mockData[index].high}`);
  };

  const getMarketContext = (date: string, currentPrice: number, previousPrice?: number) => {
    const sentiment = marketSentiment[date];
    const priceChange = previousPrice ? ((currentPrice - previousPrice) / previousPrice * 100).toFixed(1) : "N/A";
    return {
      sentiment,
      priceChange,
    };
  };

  const handleQuestionClick = async (question: string) => {
    if (selectedPoint === null) {
      setResponse("Please select a data point first by clicking on one of the high points in the chart.");
      return;
    }

    setLoading(true);
    try {
      const selectedData = mockData[selectedPoint];
      const previousData = selectedPoint > 0 ? mockData[selectedPoint - 1] : null;
      const nextData = selectedPoint < mockData.length - 1 ? mockData[selectedPoint + 1] : null;
      const context = getMarketContext(selectedData.date, selectedData.high, previousData?.high);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
      
      let simulatedResponse = "";
      switch(question) {
        case "why":
          simulatedResponse = `Analysis for ${selectedData.date}:\n\n` +
            `The stock reached a high of $${selectedData.high} primarily due to ${selectedData.events}. ` +
            `Trading volume was ${selectedData.volume}, with market sentiment being ${context.sentiment.bullish}% bullish. ` +
            `Key catalysts included ${context.sentiment.catalysts.join(" and ")}. ` +
            `The price range for this period was $${selectedData.low} to $${selectedData.high}, ` +
            `showing ${context.sentiment.bullish > 75 ? "strong" : "moderate"} market confidence.`;
          break;
        case "compare":
          if (previousData) {
            const priceChange = ((selectedData.high - previousData.high) / previousData.high * 100).toFixed(1);
            const volumeChange = ((parseInt(selectedData.volume) - parseInt(previousData.volume)) / parseInt(previousData.volume) * 100).toFixed(1);
            simulatedResponse = `Month-over-Month Comparison:\n\n` +
              `• Price Change: ${priceChange}% (${previousData.high} → ${selectedData.high})\n` +
              `• Volume Change: ${volumeChange}% (${previousData.volume} → ${selectedData.volume})\n` +
              `• Previous Event: ${previousData.events}\n` +
              `• Current Event: ${selectedData.events}\n` +
              `• Sentiment Shift: ${previousData.date}'s ${marketSentiment[previousData.date].bullish}% bullish → ` +
              `${selectedData.date}'s ${context.sentiment.bullish}% bullish`;
          } else {
            simulatedResponse = "This is the earliest data point available. No previous data for comparison.";
          }
          break;
        case "predict":
          const trend = selectedPoint > 0 
            ? (selectedData.high > mockData[selectedPoint - 1].high ? "upward" : "downward")
            : "neutral";
          const sentiment = context.sentiment.bullish > 70 ? "bullish" : "neutral";
          simulatedResponse = `Forecast Analysis for ${selectedData.date}:\n\n` +
            `Based on the current ${trend} trend and ${sentiment} market sentiment (${context.sentiment.bullish}% bullish), ` +
            `the following factors could influence future movement:\n\n` +
            `• Market Catalysts: ${context.sentiment.catalysts.join(", ")}\n` +
            `• Trading Volume: ${selectedData.volume} (${parseInt(selectedData.volume) > 20000000 ? "High" : "Moderate"} activity)\n` +
            `• Event Impact: ${selectedData.events}\n` +
            `• Price Support Level: $${selectedData.low}\n` +
            `• Resistance Level: $${selectedData.high}`;
          break;
      }
      setResponse(simulatedResponse);
    } catch (error) {
      setResponse("Failed to get analysis. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-lg bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">NVIDIA Stock Price</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="nvidiaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#76A9FA" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#76A9FA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg bg-background p-2 shadow-lg">
                      <p className="text-sm font-medium">
                        Price: ${data.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-green-500">
                        High: ${data.high.toFixed(2)}
                      </p>
                      <p className="text-xs text-red-500">
                        Low: ${data.low.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.date}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#76A9FA"
              fillOpacity={1}
              fill="url(#nvidiaGradient)"
            />
            {/* High points with hover effect */}
            {mockData.map((entry, index) => (
              <ReferenceDot
                key={`high-${index}`}
                x={entry.date}
                y={entry.high}
                r={4}
                fill={selectedPoint === index ? "#22c55e" : "#76A9FA"}
                stroke="white"
                strokeWidth={2}
                className="cursor-pointer transition-all hover:r-6 hover:fill-green-500"
                onClick={() => handleHighPointClick(index)}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Analysis Section */}
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleQuestionClick("why")}
            variant="outline"
            disabled={loading}
          >
            <HelpCircle className="h-4 w-4" />
            Why this change?
          </Button>
          <Button
            onClick={() => handleQuestionClick("compare")}
            variant="outline"
            disabled={loading}
          >
            <ArrowLeftRight className="h-4 w-4" />
            Compare to Previous
          </Button>
        </div>

        {/* Response Display */}
        {loading && (
          <div className="text-sm text-muted-foreground">
            Loading analysis...
          </div>
        )}
        {response && (
          <div className="rounded-lg bg-background p-4 shadow-sm">
            <p className="text-sm whitespace-pre-line">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}; 