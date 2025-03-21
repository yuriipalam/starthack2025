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

// Mock data for NVIDIA stock prices
const mockData = [
  { date: "2024-01", price: 480, high: 495, low: 470 },
  { date: "2024-02", price: 720, high: 735, low: 710 },
  { date: "2024-03", price: 890, high: 905, low: 875 },
  { date: "2024-04", price: 850, high: 865, low: 835 },
  { date: "2024-05", price: 920, high: 945, low: 905 },
  { date: "2024-06", price: 880, high: 895, low: 865 },
  { date: "2024-07", price: 940, high: 960, low: 925 },
].map((item) => ({
  ...item,
  price: Number(item.price.toFixed(2)),
  high: Number(item.high.toFixed(2)),
  low: Number(item.low.toFixed(2)),
}));

export const NvidiaStockChart = () => {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  const handleHighPointClick = (index: number) => {
    setSelectedPoint(index);
    // Here you would typically make an API request with the selected data point
    console.log(`Clicked on data point: ${mockData[index].date} - High: ${mockData[index].high}`);
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
    </div>
  );
}; 