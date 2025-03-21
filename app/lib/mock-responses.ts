interface StockResponse {
  response: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  sources?: string[];
}

type ResponseMapping = {
  [key: string]: (stockName: string, changePercent: number, price: number) => StockResponse;
};

export const stockResponseMapping: ResponseMapping = {
  "stock price increased": (stockName, changePercent) => ({
    response: `${stockName}'s stock price increase of ${changePercent.toFixed(2)}% can be attributed to strong quarterly earnings, positive market sentiment, and successful product launches. The company has shown robust revenue growth and exceeded analyst expectations.`,
    sentiment: 'positive',
    confidence: 0.85,
    sources: ['Quarterly Report', 'Market Analysis']
  }),

  "significant rise": (stockName) => ({
    response: `${stockName}'s significant rise is driven by multiple factors including industry leadership in innovation, strategic acquisitions, and expanding market share. The company has also benefited from favorable market conditions and increased institutional investment.`,
    sentiment: 'positive',
    confidence: 0.9,
    sources: ['Market Analysis', 'Industry Reports']
  }),

  "stock price decreased": (stockName, changePercent) => ({
    response: `${stockName}'s stock price decline of ${Math.abs(changePercent).toFixed(2)}% reflects temporary market volatility, broader sector challenges, and profit-taking by investors. However, the company's fundamentals remain strong.`,
    sentiment: 'neutral',
    confidence: 0.75,
    sources: ['Technical Analysis', 'Market Reports']
  }),

  "significant drop": (stockName) => ({
    response: `${stockName}'s significant drop is primarily due to market overreaction to short-term challenges, including supply chain disruptions and temporary setbacks in product development. The company's long-term growth strategy remains intact.`,
    sentiment: 'negative',
    confidence: 0.8,
    sources: ['Company Statements', 'Industry Analysis']
  }),

  "relatively high": (stockName, _, price) => ({
    response: `${stockName}'s relatively high stock price of $${price} reflects its strong market position, consistent financial performance, and high barriers to entry in its core markets. The valuation is supported by robust fundamentals and growth prospects.`,
    sentiment: 'positive',
    confidence: 0.85,
    sources: ['Valuation Analysis', 'Financial Reports']
  }),

  "relatively low": (stockName, _, price) => ({
    response: `${stockName}'s current stock price of $${price} presents a potential value opportunity. The lower price reflects market uncertainty rather than fundamental issues, as the company maintains healthy financials and growth prospects.`,
    sentiment: 'neutral',
    confidence: 0.7,
    sources: ['Value Analysis', 'Market Research']
  }),

  "high volatility": (stockName) => ({
    response: `${stockName}'s recent volatility is primarily driven by market sentiment shifts, macroeconomic factors, and sector-wide dynamics. The company's underlying business model and operational execution remain solid.`,
    sentiment: 'neutral',
    confidence: 0.75,
    sources: ['Volatility Analysis', 'Market Data']
  }),

  "market sentiment": (stockName) => ({
    response: `Current market sentiment for ${stockName} is cautiously optimistic. Analysts highlight the company's competitive advantages, innovation pipeline, and ability to navigate market challenges, while acknowledging short-term uncertainties.`,
    sentiment: 'positive',
    confidence: 0.8,
    sources: ['Sentiment Analysis', 'Analyst Reports']
  }),

  "future growth potential": (stockName) => ({
    response: `${stockName}'s future growth potential is promising, supported by its strategic initiatives in emerging markets, R&D investments, and digital transformation efforts. The company is well-positioned to capitalize on industry trends and expand its market presence.`,
    sentiment: 'positive',
    confidence: 0.85,
    sources: ['Growth Analysis', 'Strategic Reports']
  })
};

export function getStockResponse(question: string, stockName: string, changePercent: number, price: number): StockResponse {
  // Find the matching response template based on question keywords
  const matchingKey = Object.keys(stockResponseMapping).find(key => 
    question.toLowerCase().includes(key.toLowerCase())
  );

  if (matchingKey) {
    return stockResponseMapping[matchingKey](stockName, changePercent, price);
  }

  // Default response if no specific match is found
  return {
    response: `Based on our analysis, ${stockName} shows mixed indicators. We recommend monitoring the stock's performance and consulting financial advisors for personalized advice.`,
    sentiment: 'neutral',
    confidence: 0.6,
    sources: ['General Analysis']
  };
} 