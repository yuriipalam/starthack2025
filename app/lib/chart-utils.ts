export function generateChartData(symbol: string, timeframe: string) {
  // This function generates mock chart data based on the symbol and timeframe
  // In a real application, this would fetch data from an API

  const seed = symbol
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed + 1) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  let dataPoints = 0;
  let startPrice = 0;
  let volatility = 0;
  let dates: string[] = [];

  // Set parameters based on timeframe
  switch (timeframe) {
    case "1D":
      dataPoints = 390; // One trading day (6.5 hours * 60 minutes)
      startPrice = random(100, 500);
      volatility = 0.001;
      dates = generateIntraDayDates();
      break;
    case "1W":
      dataPoints = 5 * 390; // 5 trading days
      startPrice = random(100, 500);
      volatility = 0.002;
      dates = generateDailyDates(5);
      break;
    case "1M":
      dataPoints = 21; // ~21 trading days in a month
      startPrice = random(100, 500);
      volatility = 0.01;
      dates = generateDailyDates(21);
      break;
    case "3M":
      dataPoints = 63; // ~63 trading days in 3 months
      startPrice = random(100, 500);
      volatility = 0.015;
      dates = generateDailyDates(63);
      break;
    case "1Y":
      dataPoints = 252; // ~252 trading days in a year
      startPrice = random(100, 500);
      volatility = 0.02;
      dates = generateDailyDates(252);
      break;
    case "5Y":
      dataPoints = 5 * 252; // ~252 trading days * 5 years
      startPrice = random(100, 500);
      volatility = 0.03;
      dates = generateDailyDates(5 * 252);
      break;
    default:
      dataPoints = 390;
      startPrice = random(100, 500);
      volatility = 0.001;
      dates = generateIntraDayDates();
  }

  // Generate price data
  const prices: number[] = [];
  let currentPrice = startPrice;

  for (let i = 0; i < dataPoints; i++) {
    prices.push(currentPrice);

    // Random walk with drift based on symbol
    const symbolEffect = ((symbol.charCodeAt(0) % 5) - 2) * 0.0001;
    const change =
      currentPrice * volatility * (Math.random() * 2 - 1 + symbolEffect);
    currentPrice += change;

    // Ensure price doesn't go negative
    if (currentPrice < 1) currentPrice = 1;
  }

  // For display purposes, we'll sample the data to a reasonable number of points
  const sampledPrices = sampleData(prices, Math.min(100, prices.length));
  const sampledDates = sampleData(dates, Math.min(100, dates.length));

  // Determine if the trend is positive
  const isPositive =
    sampledPrices[sampledPrices.length - 1] >= sampledPrices[0];

  return {
    prices: sampledPrices,
    dates: sampledDates,
    isPositive
  };
}

function sampleData<T>(data: T[], targetLength: number): T[] {
  if (data.length <= targetLength) return data;

  const result: T[] = [];
  const step = data.length / targetLength;

  for (let i = 0; i < targetLength; i++) {
    const index = Math.min(Math.floor(i * step), data.length - 1);
    result.push(data[index]);
  }

  // Always include the last point
  result[result.length - 1] = data[data.length - 1];

  return result;
}

function generateIntraDayDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  const marketOpen = new Date(now);

  marketOpen.setHours(9, 30, 0, 0); // Market opens at 9:30 AM

  for (let i = 0; i < 390; i++) {
    const time = new Date(marketOpen.getTime() + i * 60000); // Add minutes
    const hours = time.getHours();
    const minutes = time.getMinutes();

    // Format: "10:30 AM"
    const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
    dates.push(formattedTime);
  }

  return dates;
}

function generateDailyDates(days: number): string[] {
  const dates: string[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Format: "Jan 15"
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    dates.push(`${month} ${day}`);
  }

  return dates;
}
