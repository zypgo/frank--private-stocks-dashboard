import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Activity, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

// 使用Alpha Vantage API获取真实股票数据
const fetchStockData = async (apiKey: string) => {
  if (!apiKey) {
    throw new Error('API Key is required');
  }

  try {
    const promises = MAGNIFICENT_SEVEN.map(async (stock) => {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${apiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data['Error Message'] || data['Note']) {
        throw new Error(data['Error Message'] || 'API limit reached');
      }
      
      const quote = data['Global Quote'];
      if (!quote) {
        throw new Error('No quote data received');
      }
      
      return {
        symbol: stock.symbol,
        name: stock.name,
        price: parseFloat(quote['05. price']) || 0,
        change: parseFloat(quote['09. change']) || 0,
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')) || 0
      };
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    throw error;
  }
};

const StockMarket = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('alphavantage_api_key') || '');
  const [tempApiKey, setTempApiKey] = useState('');
  
  const { data: stockData, isLoading, error, refetch } = useQuery({
    queryKey: ['stockData', apiKey],
    queryFn: () => fetchStockData(apiKey),
    enabled: !!apiKey,
    refetchInterval: 60000, // Alpha Vantage有调用限制，降低频率
    retry: 1,
    staleTime: 30000,
  });

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('alphavantage_api_key', tempApiKey);
    refetch();
  };

  if (!apiKey) {
    return (
      <div className="glass-card p-6 rounded-lg animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">美股七巨头</h2>
        </div>
        
        <div className="text-center py-8">
          <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">需要API密钥</h3>
          <p className="text-sm text-muted-foreground mb-4">
            请输入您的Alpha Vantage API密钥来获取真实股票数据
          </p>
          <div className="max-w-sm mx-auto space-y-3">
            <Input
              type="password"
              placeholder="输入Alpha Vantage API Key"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
            <Button onClick={handleSaveApiKey} disabled={!tempApiKey}>
              保存密钥
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            获取免费API密钥: <a 
              href="https://www.alphavantage.co/support/#api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              alphavantage.co
            </a>
          </p>
        </div>
      </div>
    );
  }

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
      
      <div className="mt-4 pt-4 border-t border-secondary/30">
        <p className="text-xs text-muted-foreground text-center">
          Alpha Vantage API • 真实股票数据 • 仅供参考，投资有风险
        </p>
      </div>
    </div>
  );
};

export default StockMarket;