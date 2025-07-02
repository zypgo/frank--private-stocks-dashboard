import { useState } from "react";
import { Activity } from "lucide-react";
import TradingViewWidget from 'react-tradingview-widget';

// 美股七巨头股票代码和TradingView符号
const MAGNIFICENT_SEVEN = [
  { symbol: "AAPL", name: "Apple", tvSymbol: "NASDAQ:AAPL" },
  { symbol: "MSFT", name: "Microsoft", tvSymbol: "NASDAQ:MSFT" },
  { symbol: "GOOGL", name: "Alphabet", tvSymbol: "NASDAQ:GOOGL" },
  { symbol: "AMZN", name: "Amazon", tvSymbol: "NASDAQ:AMZN" },
  { symbol: "NVDA", name: "NVIDIA", tvSymbol: "NASDAQ:NVDA" },
  { symbol: "TSLA", name: "Tesla", tvSymbol: "NASDAQ:TSLA" },
  { symbol: "META", name: "Meta", tvSymbol: "NASDAQ:META" },
];

const StockMarket = () => {
  const [selectedStock, setSelectedStock] = useState(MAGNIFICENT_SEVEN[0]);

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">美股七巨头</h2>
      </div>
      
      {/* 股票选择器 */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {MAGNIFICENT_SEVEN.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => setSelectedStock(stock)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedStock.symbol === stock.symbol
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground'
              }`}
            >
              {stock.symbol}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          当前查看: {selectedStock.name} ({selectedStock.symbol})
        </p>
      </div>

      {/* TradingView 图表 */}
      <div className="h-[400px] w-full rounded-lg overflow-hidden">
        <TradingViewWidget
          key={selectedStock.symbol} // 确保组件在股票变化时重新渲染
          symbol={selectedStock.tvSymbol}
          theme="dark"
          locale="zh_CN"
          autosize
          hide_side_toolbar={false}
          allow_symbol_change={false}
          interval="D"
          toolbar_bg="#141413"
          enable_publishing={false}
          hide_top_toolbar={false}
          save_image={false}
          container_id={`tradingview_stock_${selectedStock.symbol}`}
          studies={[
            "MASimple@tv-basicstudies",
            "RSI@tv-basicstudies"
          ]}
        />
      </div>
      
      <div className="mt-4 pt-4 border-t border-secondary/30">
        <p className="text-xs text-muted-foreground text-center">
          TradingView • 真实股票数据 • 仅供参考，投资有风险
        </p>
      </div>
    </div>
  );
};

export default StockMarket;