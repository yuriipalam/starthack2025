import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data for NVIDIA stock prices
const mockData = [
  { date: "2024-01", price: 480 },
  { date: "2024-02", price: 720 },
  { date: "2024-03", price: 890 },
  { date: "2024-04", price: 850 },
  { date: "2024-05", price: 920 },
  { date: "2024-06", price: 880 },
  { date: "2024-07", price: 940 },
].map((item) => ({
  ...item,
  price: Number(item.price.toFixed(2)),
}));

export const NvidiaStockChart = () => {
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
                if (active && payload?.[0]?.value !== undefined) {
                  const value = typeof payload[0].value === 'number' 
                    ? payload[0].value 
                    : parseFloat(payload[0].value);
                  
                  return (
                    <div className="rounded-lg bg-background p-2 shadow-lg">
                      <p className="text-sm font-medium">
                        ${value.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payload[0].payload.date}
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
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 