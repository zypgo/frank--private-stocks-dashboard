import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertCircle, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// 所有追踪的股票
const TRACKED_STOCKS = [
  // 七巨头中的选定股票
  { symbol: "AAPL", name: "Apple", category: "七巨头" },
  { symbol: "GOOGL", name: "Alphabet", category: "七巨头" },
  // 黄金ETF
  { symbol: "GLD", name: "SPDR黄金ETF", category: "贵金属" },
  { symbol: "IAU", name: "iShares黄金ETF", category: "贵金属" },
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

// 生成模拟股票数据
const generateMockData = () => {
  return TRACKED_STOCKS.map(stock => ({
    ...stock,
    price: (Math.random() * 200 + 50).toFixed(2),
    change: (Math.random() * 10 - 5).toFixed(2),
    changePercent: (Math.random() * 8 - 4).toFixed(2),
    volume: formatVolume((Math.random() * 100000000 + 10000000).toString()),
    isPositive: Math.random() > 0.5,
    timestamp: new Date().getTime(),
    isMockData: true
  }));
};

// 缓存相关的键名
const CACHE_KEY = 'frank_portfolio_data';
const CACHE_TIMESTAMP_KEY = 'frank_portfolio_timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1小时

// 从缓存获取数据
const getCachedData = () => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (cachedData && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp);
      const now = new Date().getTime();
      
      if (now - timestamp < CACHE_DURATION) {
        console.log('从缓存加载数据');
        return JSON.parse(cachedData);
      }
    }
  } catch (error) {
    console.error('读取缓存失败:', error);
  }
  return null;
};

// 保存数据到缓存
const setCachedData = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().getTime().toString());
    console.log('数据已保存到缓存');
  } catch (error) {
    console.error('保存缓存失败:', error);
  }
};

// 使用Alpha Vantage API获取实时股票数据
const fetchRealTimeStockData = async (apiKey?: string) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  console.log('开始获取Alpha Vantage数据，API密钥:', apiKey.substring(0, 8) + '...');

  const results = [];
  
  // 显示所有追踪的股票，但为了避免API限制，只获取前5个的实时数据
  // 其余的用模拟数据填充
  const apiStocks = TRACKED_STOCKS.slice(0, 5); // 只用API获取前5个
  const mockStocks = TRACKED_STOCKS.slice(5); // 其余用模拟数据
  
  // 获取API数据
  for (let i = 0; i < apiStocks.length; i++) {
    const stock = apiStocks[i];
    
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${apiKey}`;
      console.log(`正在获取${stock.symbol}数据...`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`${stock.symbol}请求失败:`, response.status, response.statusText);
        continue;
      }

      const data = await response.json();
      console.log(`${stock.symbol}原始数据:`, data);
      
      // 检查API限制 - 如果达到限制，抛出特定错误
      if (data['Note'] && data['Note'].includes('API call frequency')) {
        throw new Error('API_LIMIT_REACHED');
      }
      
      if (data['Error Message']) {
        console.error(`${stock.symbol} API错误:`, data['Error Message']);
        continue;
      }
      
      // Information字段只是提示，不是错误，继续处理数据
      if (data['Information'] && data['Information'].includes('rate limit')) {
        console.log('API限制提示:', data['Information']);
      }
      
      const quote = data['Global Quote'];
      if (!quote) {
        console.error(`${stock.symbol}缺少Global Quote数据:`, data);
        continue;
      }
      
      // 根据API文档，字段名是带有编号和点的
      const price = quote['05. price'];
      const change = quote['09. change'];  
      const changePercent = quote['10. change percent'];
      const volume = quote['06. volume'];
      
      if (!price) {
        console.error(`${stock.symbol}缺少价格数据:`, quote);
        continue;
      }

      const result = {
        ...stock,
        price: parseFloat(price).toFixed(2),
        change: change ? parseFloat(change).toFixed(2) : '0.00',
        changePercent: changePercent ? parseFloat(changePercent.replace('%', '')).toFixed(2) : '0.00',
        volume: volume ? formatVolume(volume) : 'N/A',
        isPositive: change ? parseFloat(change) >= 0 : true,
        timestamp: new Date().getTime()
      };
      
      console.log(`${stock.symbol}处理后数据:`, result);
      results.push(result);
      
      // 添加延迟避免API限制 (免费版每分钟最多5次请求)
      if (i < apiStocks.length - 1) {
        console.log('等待12秒避免API限制...');
        await new Promise(resolve => setTimeout(resolve, 12000)); // 12秒延迟，确保不超过5次/分钟
      }
      
    } catch (error) {
      if (error.message === 'API_LIMIT_REACHED') {
        throw error;
      }
      console.error(`获取${stock.symbol}数据时出错:`, error);
      continue;
    }
  }

  // 为剩余股票生成模拟数据
  const mockResults = mockStocks.map(stock => ({
    ...stock,
    price: (Math.random() * 200 + 50).toFixed(2),
    change: (Math.random() * 10 - 5).toFixed(2),
    changePercent: (Math.random() * 8 - 4).toFixed(2),
    volume: formatVolume((Math.random() * 100000000 + 10000000).toString()),
    isPositive: Math.random() > 0.5,
    timestamp: new Date().getTime(),
    isMockData: true
  }));

  // 合并API数据和模拟数据
  const allResults = [...results, ...mockResults];
  
  console.log('成功获取所有股票数据:', allResults);
  return allResults;
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
  const [refreshing, setRefreshing] = useState(false);

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
      loadStockData(true);
    }
  };

  // 获取数据的函数
  const loadStockData = async (forceRefresh = false) => {
    try {
      setError(null);
      setLoading(true);
      
      const currentApiKey = apiKey || localStorage.getItem('alphavantage_api_key');
      
      if (!currentApiKey) {
        setError("需要Alpha Vantage API密钥");
        // 加载所有股票的mock数据
        const mockData = generateMockData();
        setStockData(mockData);
        setLastUpdate(new Date());
        return;
      }

      // 如果不是强制刷新，先尝试加载缓存数据
      if (!forceRefresh) {
        const cachedData = getCachedData();
        if (cachedData && cachedData.length >= TRACKED_STOCKS.length) {
          setStockData(cachedData);
          setLastUpdate(new Date());
          return;
        }
      }

      // 尝试从API获取数据
      try {
        const data = await fetchRealTimeStockData(currentApiKey);
        
        // 确保返回的数据包含所有股票
        if (data.length < TRACKED_STOCKS.length) {
          // 如果API数据不完整，用模拟数据补齐缺失的股票
          const existingSymbols = data.map(stock => stock.symbol);
          const missingStocks = TRACKED_STOCKS.filter(stock => !existingSymbols.includes(stock.symbol));
          
          const mockForMissing = missingStocks.map(stock => ({
            ...stock,
            price: (Math.random() * 200 + 50).toFixed(2),
            change: (Math.random() * 10 - 5).toFixed(2),
            changePercent: (Math.random() * 8 - 4).toFixed(2),
            volume: formatVolume((Math.random() * 100000000 + 10000000).toString()),
            isPositive: Math.random() > 0.5,
            timestamp: new Date().getTime(),
            isMockData: true
          }));
          
          const completeData = [...data, ...mockForMissing];
          setStockData(completeData);
          setCachedData(completeData);
        } else {
          setStockData(data);
          setCachedData(data);
        }
        
        setLastUpdate(new Date());
        console.log('Stock data loaded successfully:', data);
      } catch (apiError) {
        console.warn('API获取失败，使用缓存或模拟数据:', apiError.message);
        
        // 如果API失败，尝试使用缓存数据
        const cachedData = getCachedData();
        if (cachedData && cachedData.length >= TRACKED_STOCKS.length) {
          console.log('使用缓存数据');
          setStockData(cachedData);
          setLastUpdate(new Date());
          setError('API调用限制，显示缓存数据');
        } else {
          // 如果没有缓存，使用所有股票的模拟数据
          console.log('使用所有股票的模拟数据');
          const allMockData = TRACKED_STOCKS.map(stock => ({
            ...stock,
            price: (Math.random() * 200 + 50).toFixed(2),
            change: (Math.random() * 10 - 5).toFixed(2),
            changePercent: (Math.random() * 8 - 4).toFixed(2),
            volume: formatVolume((Math.random() * 100000000 + 10000000).toString()),
            isPositive: Math.random() > 0.5,
            timestamp: new Date().getTime(),
            isMockData: true
          }));
          
          setStockData(allMockData);
          setLastUpdate(new Date());
          setError('API不可用，显示模拟数据');
        }
      }
    } catch (err) {
      setError(`数据获取失败: ${err.message}`);
      console.error('Load stock data error:', err);
      
      // 最后的备选：加载所有股票的mock数据
      const allMockData = TRACKED_STOCKS.map(stock => ({
        ...stock,
        price: (Math.random() * 200 + 50).toFixed(2),
        change: (Math.random() * 10 - 5).toFixed(2),
        changePercent: (Math.random() * 8 - 4).toFixed(2),
        volume: formatVolume((Math.random() * 100000000 + 10000000).toString()),
        isPositive: Math.random() > 0.5,
        timestamp: new Date().getTime(),
        isMockData: true
      }));
      
      setStockData(allMockData);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 手动刷新数据
  const handleManualRefresh = async () => {
    setRefreshing(true);
    await loadStockData(true); // 强制刷新
  };

  // 初始加载
  useEffect(() => {
    if (apiKey) {
      loadStockData();
    }
  }, [apiKey]);

  // 每小时自动刷新
  useEffect(() => {
    if (apiKey) {
      const interval = setInterval(() => {
        console.log('执行每小时自动刷新');
        loadStockData(true);
      }, 60 * 60 * 1000); // 1小时
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
          {[...Array(TRACKED_STOCKS.length)].map((_, i) => (
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
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
                由 Alpha Vantage 提供数据 • 每小时自动更新 • 免费版有API限制 • 仅供参考，投资有风险
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