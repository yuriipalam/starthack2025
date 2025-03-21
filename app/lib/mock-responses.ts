interface StockResponse {
  response: string;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  sources?: string[];
}

type ResponseMapping = {
  [key: string]: (
    stockName: string,
    changePercent: number,
    price: number
  ) => StockResponse;
};

export const stockResponseMapping: ResponseMapping = {
  "stock price increased": (stockName, changePercent) => ({
    response: `${stockName}'s stock price increase of ${changePercent.toFixed(2)}% demonstrates robust fundamental strength. Key drivers include: 1) Quarterly earnings exceeded consensus by 15%, with revenue growth of 22% YoY and margin expansion of 250bps, 2) Strong free cash flow conversion at 85% indicates operational efficiency, 3) Market share gains in core segments (+5% YoY) reflect competitive advantages. Technical indicators suggest sustained momentum with RSI at 65 and positive MACD crossover. Institutional ownership has increased by 12% this quarter, indicating growing confidence. Consider this trajectory in the context of the sector's average growth of 8% YTD.`,
    sentiment: "positive",
    confidence: 0.85,
    sources: [
      "Quarterly Report",
      "Market Analysis",
      "Technical Indicators",
      "Institutional Ownership Data"
    ]
  }),

  "significant rise": (stockName) => ({
    response: `${stockName}'s remarkable performance is underpinned by multiple strategic advantages: 1) Industry-leading R&D investment ratio of 15% of revenue, resulting in 28 new patent filings, 2) Strategic acquisitions including the recent $2.5B deal expanding TAM by 40%, 3) Market share expansion from 23% to 31% in core segments. Key financial metrics show: Operating margin improvement of 400bps YoY, debt-to-EBITDA ratio reduction to 1.2x, and working capital optimization leading to 15% improvement in cash conversion cycle. The company's ESG initiatives and sustainable practices have also attracted significant institutional capital, with ESG-focused funds increasing their positions by 25%.`,
    sentiment: "positive",
    confidence: 0.9,
    sources: [
      "Market Analysis",
      "Industry Reports",
      "Patent Database",
      "ESG Performance Metrics"
    ]
  }),

  "stock price decreased": (stockName, changePercent) => ({
    response: `${stockName}'s stock price decline of ${Math.abs(changePercent).toFixed(2)}% warrants contextual analysis: 1) The decline occurs against a backdrop of sector-wide multiple compression (sector P/E down 15%), 2) Company's fundamentals remain strong with 18% ROE and 25% ROIC, significantly above peer average, 3) Balance sheet strength persists with $4.2B cash reserves and 2.5x interest coverage ratio. Technical analysis shows oversold conditions with RSI at 32, suggesting potential mean reversion. The current price level presents a compelling valuation at 0.8x PEG ratio compared to industry average of 1.2x. Consider this correction an opportunity to evaluate position sizing within risk parameters.`,
    sentiment: "neutral",
    confidence: 0.75,
    sources: [
      "Technical Analysis",
      "Market Reports",
      "Financial Metrics",
      "Peer Comparison Data"
    ]
  }),

  "significant drop": (stockName) => ({
    response: `${stockName}'s significant decline requires multi-factor analysis: 1) Supply chain disruptions have temporarily impacted gross margins (-300bps), but mitigation strategies including supplier diversification and inventory optimization are underway, 2) R&D setbacks in key projects have delayed product launches by 2 quarters, however, the pipeline remains robust with 15 projects in late-stage development, 3) Market share remains stable at 28% despite competitive pressures. Current valuation metrics (P/E: 12x, EV/EBITDA: 8x) are at 5-year lows, while the company maintains strong liquidity (current ratio: 2.5x) and minimal refinancing risk with no major debt maturities until 2026. Management's share buyback authorization of $5B signals confidence in long-term value.`,
    sentiment: "negative",
    confidence: 0.8,
    sources: [
      "Company Statements",
      "Industry Analysis",
      "Supply Chain Reports",
      "Valuation Metrics"
    ]
  }),

  "relatively high": (stockName, _, price) => ({
    response: `${stockName}'s premium valuation at $${price} is supported by compelling metrics: 1) Industry-leading EBITDA margins of 35% (+500bps vs peers), 2) Robust organic growth rate of 15% CAGR over 3 years, 3) High barriers to entry reinforced by 180+ patents and 65% market share in premium segments. Financial health indicators are exceptional: FCF yield of 6%, ROIC of 22%, and net cash position of $3.8B. The company's moat is widening through network effects, with customer acquisition costs decreasing 25% YoY while lifetime value increased 40%. Growth vectors include geographical expansion (35% international revenue target) and adjacent market opportunities ($50B TAM).`,
    sentiment: "positive",
    confidence: 0.85,
    sources: [
      "Valuation Analysis",
      "Financial Reports",
      "Patent Portfolio Analysis",
      "Market Expansion Strategy"
    ]
  }),

  "relatively low": (stockName, _, price) => ({
    response: `${stockName}'s current price of $${price} presents a compelling risk-reward proposition: 1) Trading at 0.7x PEG ratio versus historical average of 1.1x, 2) Strong fundamentals with 20% ROE and 30% gross margins remain intact, 3) Market uncertainty has created temporary dislocation - company's beta of 1.2 has led to oversized reaction to market volatility. Balance sheet strength (net cash position, 3x current ratio) provides downside protection and optionality for opportunistic M&A. The company's digital transformation initiatives target $500M in cost savings by 2025, while strategic investments in AI/ML capabilities position it well for next-generation product development.`,
    sentiment: "neutral",
    confidence: 0.7,
    sources: [
      "Value Analysis",
      "Market Research",
      "Digital Transformation Roadmap",
      "Strategic Planning Documents"
    ]
  }),

  "high volatility": (stockName) => ({
    response: `${stockName}'s volatility metrics require careful analysis: 1) 30-day realized volatility of 45% vs sector average of 28% reflects temporary market dynamics rather than fundamental issues, 2) Beta has increased to 1.4 from historical 1.1, creating hedging opportunities, 3) Options implied volatility skew suggests market uncertainty about near-term catalysts. Key stability factors include: Diversified revenue streams (no single customer >5% of revenue), geographical diversification (operations in 40+ countries), and strong working capital management (15% improvement in cash conversion cycle). Technical support levels exist at key moving averages (50-day MA: $X, 200-day MA: $Y).`,
    sentiment: "neutral",
    confidence: 0.75,
    sources: [
      "Volatility Analysis",
      "Market Data",
      "Technical Charts",
      "Risk Metrics"
    ]
  }),

  "market sentiment": (stockName) => ({
    response: `Current market sentiment for ${stockName} reflects a complex interplay of factors: 1) Analyst consensus shows 15 Buys, 5 Holds, 2 Sells with mean price target implying 23% upside, 2) Short interest at 4.2% (down from 7.8% QoQ) indicates declining bearish conviction, 3) Options market shows bullish sentiment with put/call ratio at 0.75. Institutional positioning remains constructive with 85% ownership and recent 13F filings showing increased positions from quality investors. Social sentiment analysis shows positive momentum with 72% favorable mentions among verified financial professionals. The company's recent investor day highlighted $10B in pipeline opportunities and 5-year targets exceeding street estimates.`,
    sentiment: "positive",
    confidence: 0.8,
    sources: [
      "Sentiment Analysis",
      "Analyst Reports",
      "Options Data",
      "13F Filings",
      "Social Media Analytics"
    ]
  }),

  "future growth potential": (stockName) => ({
    response: `${stockName}'s growth trajectory is supported by multiple vectors: 1) Expanding TAM from $50B to $80B through strategic initiatives in emerging markets (projected 25% CAGR), 2) R&D pipeline of 25 products with $15B revenue potential, including 5 potential blockbusters, 3) Digital transformation driving margin expansion (+200bps annually) and customer engagement (NPS increased from 45 to 62). Strategic investments in AI/ML capabilities ($2B committed over 3 years) target operational efficiency and product innovation. ESG leadership (top quartile ratings) positions the company well for sustainable growth, with 40% of new products addressing environmental challenges. Capital allocation strategy balances growth investments (60%), shareholder returns (30%), and strategic flexibility (10%).`,
    sentiment: "positive",
    confidence: 0.85,
    sources: [
      "Growth Analysis",
      "Strategic Reports",
      "Innovation Pipeline",
      "ESG Metrics",
      "Capital Allocation Strategy"
    ]
  }),

  "explain the stock price": (stockName, _, price) => ({
    response: `${stockName}'s current stock price of $${price} reflects several key factors: 1) Strong fundamentals with revenue growth of 18% YoY and operating margins of 25%, 2) Market position as industry leader with 35% market share in core segments, 3) Robust balance sheet featuring $2.8B in cash reserves and minimal debt (net debt/EBITDA of 0.3x). The company's valuation metrics (P/E: 22x, EV/EBITDA: 15x) are in line with premium growth peers. Recent catalysts include successful product launches (3 new offerings in Q4) and strategic partnerships expanding addressable market by 40%. Technical indicators show healthy momentum with price above key moving averages and strong institutional support (85% ownership).`,
    sentiment: "positive",
    confidence: 0.85,
    sources: [
      "Financial Reports",
      "Market Analysis",
      "Technical Indicators",
      "Company Filings"
    ]
  }),

  "why does the stock price of": (stockName) => ({
    response: `${stockName}'s sustained upward trajectory is driven by multiple factors: 1) Exceptional execution with 5 consecutive quarters of earnings beats, averaging 12% above consensus, 2) Strategic initiatives delivering results - digital transformation program achieving 30% cost reduction target, 3) Market expansion success with international revenue growing 45% YoY. Key growth drivers include: Strong product pipeline (15 new launches in 2024), expanding customer base (net customer additions +25% YoY), and increasing pricing power (gross margin expansion of 300bps). The company's competitive moat is strengthening through network effects and brand value appreciation. Institutional investors have increased positions by 20% this year, reflecting growing confidence in the growth story.`,
    sentiment: "positive",
    confidence: 0.9,
    sources: [
      "Quarterly Reports",
      "Growth Analysis",
      "Market Research",
      "Institutional Holdings"
    ]
  }),

  "what is the forecast": (stockName) => ({
    response: `${stockName}'s growth forecast remains robust across key metrics: 1) Revenue growth projected at 20-25% CAGR through 2026, driven by market expansion and new product launches, 2) Margin improvement trajectory targeting 300bps annual expansion through operational efficiency and scale benefits, 3) Strong free cash flow generation expected to reach $5B by 2025, supporting both growth investments and shareholder returns. Key catalysts include: Geographic expansion into 5 new markets, launch of 3 major product platforms, and strategic acquisitions in high-growth segments. Analyst consensus shows 85% Buy ratings with mean price target implying 35% upside. The company's innovation pipeline and market leadership position support sustainable long-term growth.`,
    sentiment: "positive",
    confidence: 0.8,
    sources: [
      "Analyst Reports",
      "Company Guidance",
      "Industry Forecasts",
      "Growth Strategy Documents"
    ]
  }),

  "go public as ipo": (stockName) => ({
    response: `${stockName} completed its initial public offering (IPO) on March 15, 2019, raising $2.5B at $45 per share, valuing the company at $18B. The IPO was oversubscribed 8x, reflecting strong investor demand. Key IPO highlights include: 1) Largest tech IPO of 2019, 2) Strong institutional participation with 85% allocation to long-term investors, 3) Initial market cap represented 3.5x revenue multiple. Since IPO, the stock has delivered 280% total return, significantly outperforming both the S&P 500 (+85%) and sector peers (+120%). The company has maintained consistent growth execution, expanding revenue 5x and market share from 15% to 35% in core segments.`,
    sentiment: "positive",
    confidence: 0.95,
    sources: ["IPO Prospectus", "SEC Filings", "Market Data", "Company History"]
  })
};

export function getStockResponse(
  question: string,
  stockName: string,
  changePercent: number,
  price: number
): StockResponse {
  console.log("DUDE", question, stockName, changePercent, price);
  // Check for invalid or unknown stock name
  if (!stockName || stockName.trim() === "") {
    console.log(!stockName, stockName.trim());
    return {
      response:
        "I'm sorry, but I don't know what your question refers to. If you have a specific question or need information related to companies, indexes, commodities, or exchange rates, please let me know!",
      sentiment: "neutral",
      confidence: 0.9,
      sources: ["Input Validation"]
    };
  }

  // Find the matching response template based on question keywords
  const matchingKey = Object.keys(stockResponseMapping).find((key) =>
    question.toLowerCase().includes(key.toLowerCase())
  );

  if (matchingKey) {
    return stockResponseMapping[matchingKey](stockName, changePercent, price);
  }

  // Default response if no specific match is found
  return {
    response:
      "I'm sorry, but I don't know what your question refers to. If you have a specific question or need information related to companies, indexes, commodities, or exchange rates, please let me know!",
    sentiment: "neutral",
    confidence: 0.9,
    sources: ["Input Validation"]
  };
}
