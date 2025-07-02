import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Coins, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 使用Metals-API获取真实贵金属数据
const fetchMetalsData = async (apiKey: string) => {
  if (!apiKey) {
    throw new Error('API Key is required');
  }

  try {
    const response = await fetch(
      `https://metals-api.com/api/latest?access_key=${apiKey}&base=USD&symbols=XAU,XAG`,
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
    
    if (!data.success) {
      throw new Error(data.error?.info || 'API request failed');
    }
    
    const results = [];
    
    // 处理黄金数据 (XAU price in USD per troy ounce)
    if (data.rates?.XAU) {
      const goldPricePerOunce = 1 / data.rates.XAU; // Convert to USD per ounce
      results.push({
        symbol: "XAU",
        name: "黄金",
        price: goldPricePerOunce,
        change: 0, // API doesn't provide change, would need historical data
        changePercent: 0,
        unit: "美元/盎司"
      });
    }
    
    // 处理白银数据 (XAG price in USD per troy ounce)
    if (data.rates?.XAG) {
      const silverPricePerOunce = 1 / data.rates.XAG; // Convert to USD per ounce
      results.push({
        symbol: "XAG",
        name: "白银",
        price: silverPricePerOunce,
        change: 0, // API doesn't provide change, would need historical data
        changePercent: 0,
        unit: "美元/盎司"
      });
    }

    return results;
  } catch (error) {
    console.error('Failed to fetch metals data:', error);
    throw error;
  }
};

const PreciousMetals = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('metals_api_key') || '');
  const [tempApiKey, setTempApiKey] = useState('');
  
  const { data: metalsData, isLoading, error, refetch } = useQuery({
    queryKey: ['metalsData', apiKey],
    queryFn: () => fetchMetalsData(apiKey),
    enabled: !!apiKey,
    refetchInterval: 300000, // 5分钟刷新一次，贵金属价格变化较慢
    retry: 1,
    staleTime: 60000,
  });

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('metals_api_key', tempApiKey);
    refetch();
  };

  if (!apiKey) {
    return (
      <div className="glass-card p-6 rounded-lg animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <Coins className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">贵金属行情</h2>
        </div>
        
        <div className="text-center py-8">
          <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-2">需要API密钥</h3>
          <p className="text-sm text-muted-foreground mb-4">
            请输入您的Metals API密钥来获取真实贵金属数据
          </p>
          <div className="max-w-sm mx-auto space-y-3">
            <Input
              type="password"
              placeholder="输入Metals API Key"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
            <Button onClick={handleSaveApiKey} disabled={!tempApiKey}>
              保存密钥
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            获取免费API密钥: <a 
              href="https://metals-api.com/pricing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              metals-api.com
            </a> (1000次/月免费)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Coins className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-semibold">贵金属行情</h2>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-16 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-20"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 bg-muted rounded w-20 mb-1"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 text-sm mb-2">数据获取失败</p>
          <p className="text-muted-foreground text-xs">
            贵金属数据服务暂时不可用
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {metalsData?.map((metal) => (
            <div key={metal.symbol} className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  metal.symbol === 'XAU' ? 'bg-yellow-500/20' : 'bg-gray-400/20'
                }`}>
                  <Coins className={`w-5 h-5 ${
                    metal.symbol === 'XAU' ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <p className="font-medium">{metal.name}</p>
                  <p className="text-sm text-muted-foreground">{metal.unit}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${metal.price.toFixed(2)}</p>
                <div className="flex items-center gap-1 justify-end">
                  {metal.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    metal.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metal.change >= 0 ? '+' : ''}{metal.change.toFixed(2)} ({metal.changePercent >= 0 ? '+' : ''}{metal.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-secondary/30">
        <p className="text-xs text-muted-foreground text-center">
          Metals-API • 真实贵金属数据 • 仅供参考，投资有风险
        </p>
      </div>
    </div>
  );
};

export default PreciousMetals;