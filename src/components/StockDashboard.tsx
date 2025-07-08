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

// 使用FMP API获取实时股票数据 (批量请求)
const fetchRealTimeStockData = async (apiKey?: string) => {
  if (!apiKey) {
    throw new Error('FMP API key is required');
  }

  console.log('开始获取FMP批量数据，API密钥:', apiKey.substring(0, 8) + '...');

  try {
    // 创建股票符号列表 (逗号分隔)
    const symbolList = TRACKED_STOCKS.map(stock => stock.symbol).join(',');
    
    // FMP批量查询API端点
    const url = `https://financialmodelingprep.com/api/v3/quote/${symbolList}?apikey=${apiKey}`;
    
    console.log('FMP批量请求URL:', url);
    console.log('请求的股票符号:', symbolList);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`FMP API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('FMP原始数据:', data);
    
    // 检查是否有错误信息
    if (data.error || (Array.isArray(data) && data.length === 0)) {
      throw new Error('FMP API返回空数据或错误');
    }
    
    // 检查API限制 (FMP的错误格式)
    if (data.message && data.message.includes('limit')) {
      throw new Error('FMP_API_LIMIT_REACHED');
    }

    // 处理FMP返回的数据
    const processedResults = [];
    
    // 遍历追踪的股票列表
    for (const trackedStock of TRACKED_STOCKS) {
      // 在FMP数据中查找对应的股票数据
      const fmpData = Array.isArray(data) ? 
        data.find(item => item.symbol === trackedStock.symbol) : null;
      
      if (fmpData && fmpData.price !== null && fmpData.price !== undefined) {
        // 使用FMP API数据
        const change = fmpData.change || 0;
        const changePercent = fmpData.changePercentage || 0;
        
        processedResults.push({
          ...trackedStock,
          price: parseFloat(fmpData.price).toFixed(2),
          change: parseFloat(change).toFixed(2),
          changePercent: parseFloat(changePercent).toFixed(2),
          volume: fmpData.volume ? formatVolume(fmpData.volume.toString()) : 'N/A',
          isPositive: change >= 0,
          timestamp: new Date().getTime(),
          dataSource: 'FMP' // 标识数据源为FMP
        });
        
        console.log(`${trackedStock.symbol}: 成功获取FMP数据`);
      } else {
        // 如果FMP没有该股票数据，生成模拟数据
        const mockData = {
          ...trackedStock,
          price: (Math.random() * 200 + 50).toFixed(2),
          change: (Math.random() * 10 - 5).toFixed(2),
          changePercent: (Math.random() * 8 - 4).toFixed(2),
          volume: formatVolume((Math.random() * 100000000 + 10000000).toString()),
          isPositive: Math.random() > 0.5,
          timestamp: new Date().getTime(),
          isMockData: true,
          dataSource: 'Mock' // 标识数据源
        };
        
        processedResults.push(mockData);
        console.log(`${trackedStock.symbol}: 使用模拟数据 (FMP无数据)`);
      }
    }

    console.log('FMP批量处理完成，获取数据:', processedResults);
    return processedResults;

  } catch (error) {
    console.error('FMP API请求失败:', error);
    
    // 如果FMP API失败，为所有股票生成模拟数据
    const mockResults = TRACKED_STOCKS.map(stock => ({
      ...stock,
      price: (Math.random() * 200 + 50).toFixed(2),
      change: (Math.random() * 10 - 5).toFixed(2),
      changePercent: (Math.random() * 8 - 4).toFixed(2),
      volume: formatVolume((Math.random() * 100000000 + 10000000).toString()),
      isPositive: Math.random() > 0.5,
      timestamp: new Date().getTime(),
      isMockData: true,
      dataSource: 'Mock'
    }));

    console.log('FMP API失败，使用全模拟数据');
    throw error; // 重新抛出错误以便上层处理
  }
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
    const savedKey = localStorage.getItem('fmp_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      // 提供默认的FMP API key (demo key)
      setApiKey('demo');
      localStorage.setItem('fmp_api_key', 'demo');
    }
  }, []);

  // 保存API key
  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('fmp_api_key', tempApiKey.trim());
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
      
      const currentApiKey = apiKey || localStorage.getItem('fmp_api_key');
      
      if (!currentApiKey) {
        setError("需要FMP API密钥");
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
                <DialogTitle>FMP API Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">FMP API Key</label>
                  <Input
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="Enter your FMP API key"
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
                           <div className="flex items-center gap-2">
                             <span className="font-medium">{stock.name}</span>
                             {(stock.isMockData || stock.dataSource === 'Mock') && (
                               <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-md dark:bg-orange-900/20 dark:text-orange-400">
                                 模拟
                               </span>
                             )}
                              {stock.dataSource === 'FMP' && (
                                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-md dark:bg-green-900/20 dark:text-green-400">
                                  FMP
                                </span>
                              )}
                           </div>
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
                由 FMP 提供数据 • 每小时自动更新 • 免费版250次/日限制 • 仅供参考，投资有风险
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