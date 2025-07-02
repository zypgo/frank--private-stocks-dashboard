import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

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

// 模拟实时股票数据
const generateMockData = () => {
  return TRACKED_STOCKS.map(stock => {
    const basePrice = Math.random() * 500 + 50;
    const change = (Math.random() - 0.5) * 10;
    const changePercent = (change / basePrice) * 100;
    const volume = (Math.random() * 50 + 10).toFixed(1) + "B";
    
    return {
      ...stock,
      price: basePrice.toFixed(2),
      change: change.toFixed(2),
      changePercent: changePercent.toFixed(2),
      volume,
      isPositive: changePercent >= 0
    };
  });
};

const StockDashboard = () => {
  const [stockData, setStockData] = useState(generateMockData());

  // 每30秒更新一次数据
  useEffect(() => {
    const interval = setInterval(() => {
      setStockData(generateMockData());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">重点股票实时行情</h2>
      </div>
      
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
        <p className="text-xs text-muted-foreground text-center">
          数据每30秒自动更新 • 仅供参考，投资有风险
        </p>
      </div>
    </div>
  );
};

export default StockDashboard;