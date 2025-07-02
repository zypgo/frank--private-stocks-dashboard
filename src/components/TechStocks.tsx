import { useState } from "react";
import { Cpu } from "lucide-react";
import TradingViewWidget from 'react-tradingview-widget';

// 科技股票代码和TradingView符号
const TECH_STOCKS = [
  { symbol: "PDD", name: "拼多多", tvSymbol: "NASDAQ:PDD" },
  { symbol: "MU", name: "美光科技", tvSymbol: "NASDAQ:MU" },
  { symbol: "QCOM", name: "高通", tvSymbol: "NASDAQ:QCOM" },
];

const TechStocks = () => {
  const [selectedStock, setSelectedStock] = useState(TECH_STOCKS[0]);

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Cpu className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-semibold">科技股票</h2>
      </div>
      
      {/* 股票选择器 */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {TECH_STOCKS.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => setSelectedStock(stock)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedStock.symbol === stock.symbol
                  ? 'bg-blue-500 text-blue-50'
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
      <div className="h-[400px] w-full rounded-lg overflow-hidden bg-background">
        <TradingViewWidget
          key={`tech_${selectedStock.symbol}_${Date.now()}`} // 强制重新渲染
          symbol={selectedStock.tvSymbol}
          theme="dark"
          locale="zh_CN"
          autosize={true}
          hide_side_toolbar={false}
          allow_symbol_change={true}
          interval="D"
          toolbar_bg="#141413"
          enable_publishing={false}
          hide_top_toolbar={false}
          save_image={false}
          container_id={`tradingview_tech_${selectedStock.symbol}`}
          studies={[
            "MASimple@tv-basicstudies"
          ]}
          width="100%"
          height="400"
          loading_screen={{ backgroundColor: "#131722" }}
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

export default TechStocks;