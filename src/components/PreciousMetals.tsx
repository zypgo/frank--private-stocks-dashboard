import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";

// 贵金属数据获取
const fetchMetalsData = async () => {
  try {
    // 使用免费的mock数据作为演示
    const mockData = [
      { 
        symbol: "XAU", 
        name: "黄金", 
        price: 2065.40, 
        change: 12.30, 
        changePercent: 0.60,
        unit: "美元/盎司"
      },
      { 
        symbol: "XAG", 
        name: "白银", 
        price: 24.85, 
        change: -0.15, 
        changePercent: -0.60,
        unit: "美元/盎司"
      },
    ];
    
    return mockData;
  } catch (error) {
    console.error('Failed to fetch metals data:', error);
    return [];
  }
};

const PreciousMetals = () => {
  const { data: metalsData, isLoading, error } = useQuery({
    queryKey: ['metalsData'],
    queryFn: fetchMetalsData,
    refetchInterval: 60000, // 每分钟刷新一次
    retry: 1,
  });

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
          数据仅供参考，投资有风险
        </p>
      </div>
    </div>
  );
};

export default PreciousMetals;