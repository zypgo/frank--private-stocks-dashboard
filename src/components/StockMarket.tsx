import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

// 美股七巨头股票代码
const MAGNIFICENT_SEVEN = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "META", name: "Meta" },
];

// 使用Yahoo Finance API的替代方案 - 免费的financialmodelingprep API
const fetchStockData = async () => {
  try {
    const symbols = MAGNIFICENT_SEVEN.map(stock => stock.symbol).join(',');
    
    // 使用免费的mock数据作为演示
    const mockData = [
      { symbol: "AAPL", name: "Apple", price: 183.25, change: 1.25, changePercent: 0.68 },
      { symbol: "MSFT", name: "Microsoft", price: 415.30, change: -2.15, changePercent: -0.51 },
      { symbol: "GOOGL", name: "Alphabet", price: 161.50, change: 0.85, changePercent: 0.53 },
      { symbol: "AMZN", name: "Amazon", price: 145.75, change: 2.40, changePercent: 1.67 },
      { symbol: "NVDA", name: "NVIDIA", price: 865.20, change: 15.80, changePercent: 1.86 },
      { symbol: "TSLA", name: "Tesla", price: 245.60, change: -3.25, changePercent: -1.31 },
      { symbol: "META", name: "Meta", price: 485.90, change: 4.50, changePercent: 0.94 },
    ];
    
    return mockData;
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    return [];
  }
};

const StockMarket = () => {
  const { data: stockData, isLoading, error } = useQuery({
    queryKey: ['stockData'],
    queryFn: fetchStockData,
    refetchInterval: 60000, // 每分钟刷新一次
    retry: 1,
  });

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">美股七巨头</h2>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-16 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-12"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-muted rounded w-16 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 text-sm mb-2">数据获取失败</p>
          <p className="text-muted-foreground text-xs">
            股票数据服务暂时不可用
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {stockData?.map((stock) => (
            <div key={stock.symbol} className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {stock.symbol.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{stock.name}</p>
                  <p className="text-xs text-muted-foreground">{stock.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">${stock.price.toFixed(2)}</p>
                <div className="flex items-center gap-1">
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockMarket;