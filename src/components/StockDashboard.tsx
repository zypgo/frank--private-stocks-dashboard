import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// 所有追踪的股票
const TRACKED_STOCKS = [
  // 七巨头中的选定股票
  { symbol: "AAPL", name: "Apple", category: "七巨头" },
  { symbol: "GOOGL", name: "Alphabet", category: "七巨头" },
  // 消费品股票
  { symbol: "HSY", name: "好时", category: "消费品" },
  { symbol: "KHC", name: "卡夫亨氏", category: "消费品" },
  { symbol: "MDLZ", name: "亿滋", category: "消费品" },
  { symbol: "PEP", name: "百事可乐", category: "消费品" },
  { symbol: "STZ", name: "星座品牌", category: "消费品" },
  { symbol: "DEO", name: "帝亚吉欧", category: "消费品" },
  { symbol: "LVMUY", name: "路威酩轩", category: "消费品" },
  // 科技股票
  { symbol: "PDD", name: "拼多多", category: "科技" },
  { symbol: "MU", name: "美光科技", category: "科技" },
  { symbol: "QCOM", name: "高通", category: "科技" },
  // 医疗股票
  { symbol: "UNH", name: "联合健康", category: "医疗" },
];

// 使用Alpha Vantage API获取实时股票数据
const fetchRealTimeStockData = async (apiKey?: string) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  console.log('Fetching real-time data from Alpha Vantage with API key:', apiKey.substring(0, 8) + '...');

  const promises = TRACKED_STOCKS.map(async (stock) => {
    try {
      // 使用Alpha Vantage GLOBAL_QUOTE API获取实时数据
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${apiKey}`;
      console.log(`Fetching ${stock.symbol} from:`, url);
      
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`API request failed for ${stock.symbol}:`, response.status);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`Raw data for ${stock.symbol}:`, data);
      
      // Alpha Vantage全局报价响应格式
      const quote = data['Global Quote'];
      if (!quote || !quote['05. price']) {
        console.error(`No quote data available for ${stock.symbol}`, data);
        throw new Error('Invalid quote data');
      }

      const currentPrice = parseFloat(quote['05. price']);
      const change = parseFloat(quote['09. change']);
      const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
      const volume = quote['06. volume'];

      const result = {
        ...stock,
        price: currentPrice.toFixed(2),
        change: change.toFixed(2),
        changePercent: changePercent.toFixed(2),
        volume: formatVolume(volume),
        isPositive: change >= 0,
        timestamp: new Date().getTime()
      };
      
      console.log(`Processed data for ${stock.symbol}:`, result);
      return result;
    } catch (error) {
      console.error(`Error fetching data for ${stock.symbol}:`, error);
      throw error;
    }
  });

  const results = await Promise.all(promises);
  console.log('All fetched results:', results);
  return results;
};

// 格式化交易量显示
const formatVolume = (volume: string) => {
  const num = parseInt(volume);
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return volume;
};


const StockDashboard = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  // 从localStorage获取API key
  useEffect(() => {
    const savedKey = localStorage.getItem('alphavantage_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      // 提供默认的API key
      setApiKey('9D65JZM25N7RSKV6');
      localStorage.setItem('alphavantage_api_key', '9D65JZM25N7RSKV6');
    }
  }, []);

  // 保存API key
  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('alphavantage_api_key', tempApiKey.trim());
      setApiKey(tempApiKey.trim());
      setShowApiDialog(false);
      setTempApiKey('');
      // 重新加载数据
      loadStockData();
    }
  };

  // 获取数据的函数
  const loadStockData = async () => {
    try {
      setError(null);
      setLoading(true);
      const currentApiKey = apiKey || localStorage.getItem('alphavantage_api_key');
      
      if (!currentApiKey) {
        setError("需要Alpha Vantage API密钥");
        return;
      }
      
      const data = await fetchRealTimeStockData(currentApiKey);
      setStockData(data);
      setLastUpdate(new Date());
      console.log('Stock data loaded successfully:', data);
    } catch (err) {
      setError(`数据获取失败: ${err.message}`);
      console.error('Load stock data error:', err);
      setStockData([]); // Clear any existing data on error
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和定时刷新  
  useEffect(() => {
    if (apiKey) {
      loadStockData();
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey) {
      // 每1分钟更新一次（Alpha Vantage API限制）
      const interval = setInterval(loadStockData, 60000);
      return () => clearInterval(interval);
    }
  }, [apiKey]);

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-lg animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
          <h2 className="text-xl font-semibold">Frank's Portfolio</h2>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded bg-secondary/10 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                <div>
                  <div className="h-4 w-20 bg-primary/20 rounded mb-1"></div>
                  <div className="h-3 w-16 bg-primary/10 rounded"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 w-16 bg-primary/20 rounded mb-1"></div>
                <div className="h-3 w-12 bg-primary/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Frank's Portfolio</h2>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center gap-1 text-orange-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{error}</span>
            </div>
          )}
          <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alpha Vantage API Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">API Key</label>
                  <Input
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="Enter your Alpha Vantage API key"
                    type="password"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set'}
                  </p>
                </div>
                <Button onClick={saveApiKey} className="w-full">
                  Save API Key
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {stockData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>暂无可用的股票数据</p>
          <p className="text-xs mt-1">请稍后刷新重试</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary/30">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">名称</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">价格</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">24小时变化</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">交易量</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((stock, index) => (
                  <tr key={stock.symbol} className="border-b border-secondary/10 hover:bg-secondary/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {stock.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{stock.name}</div>
                          <div className="text-xs text-muted-foreground">{stock.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-2 font-medium">
                      ${stock.price}
                    </td>
                    <td className="text-right py-4 px-2">
                      <div className="flex items-center justify-end gap-1">
                        {stock.isPositive ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={stock.isPositive ? 'text-green-500' : 'text-red-500'}>
                          {stock.isPositive ? '+' : ''}{stock.changePercent}%
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-2 text-muted-foreground">
                      ${stock.volume}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 pt-4 border-t border-secondary/30">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                由 Alpha Vantage 提供实时数据 • 每1分钟更新 • 仅供参考，投资有风险
              </span>
              {lastUpdate && (
                <span>
                  最后更新: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StockDashboard;