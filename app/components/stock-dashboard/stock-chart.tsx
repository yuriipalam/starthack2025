import { useEffect, useRef } from "react";
import { generateChartData } from "@/lib/chart-utils";

export function StockChart({
  symbol,
  timeframe
}: {
  symbol: string;
  timeframe: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = 300;

      drawChart(ctx, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [symbol, timeframe]);

  const drawChart = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Generate mock data based on symbol and timeframe
    const { prices, dates, isPositive } = generateChartData(symbol, timeframe);

    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find min and max values
    const minPrice = Math.min(...prices) * 0.995;
    const maxPrice = Math.max(...prices) * 1.005;

    // Draw axes
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Draw price labels
    ctx.fillStyle = "#999";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const priceStep = (maxPrice - minPrice) / 5;
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - i * priceStep;
      const y = padding.top + (i / 5) * chartHeight;

      ctx.fillText(price.toFixed(2), padding.left - 5, y);

      // Grid line
      ctx.beginPath();
      ctx.strokeStyle = "#333";
      ctx.setLineDash([2, 2]);
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw date labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const labelCount = Math.min(6, dates.length);
    for (let i = 0; i < labelCount; i++) {
      const index = Math.floor((i * (dates.length - 1)) / (labelCount - 1));
      const x = padding.left + (index / (dates.length - 1)) * chartWidth;

      ctx.fillText(dates[index], x, height - padding.bottom + 5);
    }

    // Draw price line
    ctx.beginPath();
    ctx.strokeStyle = isPositive ? "#22c55e" : "#ef4444";
    ctx.lineWidth = 2;

    for (let i = 0; i < prices.length; i++) {
      const x = padding.left + (i / (prices.length - 1)) * chartWidth;
      const y =
        padding.top +
        ((maxPrice - prices[i]) / (maxPrice - minPrice)) * chartHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw area under the line
    ctx.lineTo(padding.left + chartWidth, height - padding.bottom);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(
      0,
      padding.top,
      0,
      height - padding.bottom
    );
    gradient.addColorStop(
      0,
      isPositive ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"
    );
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fill();
  };

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
