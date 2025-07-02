import { useState } from "react";
import { Coins } from "lucide-react";
import TradingViewWidget from 'react-tradingview-widget';

// 贵金属交易符号
const PRECIOUS_METALS = [
  { symbol: "XAU", name: "黄金", tvSymbol: "TVC:GOLD", unit: "美元/盎司" },
  { symbol: "XAG", name: "白银", tvSymbol: "TVC:SILVER", unit: "美元/盎司" },
  { symbol: "XPT", name: "铂金", tvSymbol: "NYMEX:PL1!", unit: "美元/盎司" },
  { symbol: "XPD", name: "钯金", tvSymbol: "NYMEX:PA1!", unit: "美元/盎司" },
];

const PreciousMetals = () => {
  const [selectedMetal, setSelectedMetal] = useState(PRECIOUS_METALS[0]);

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Coins className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-semibold">贵金属行情</h2>
      </div>
      
      {/* 贵金属选择器 */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {PRECIOUS_METALS.map((metal) => (
            <button
              key={metal.symbol}
              onClick={() => setSelectedMetal(metal)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedMetal.symbol === metal.symbol
                  ? 'bg-yellow-500 text-yellow-50'
                  : 'bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground'
              }`}
            >
              {metal.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          当前查看: {selectedMetal.name} ({selectedMetal.unit})
        </p>
      </div>

      {/* TradingView 图表 */}
      <div className="h-[400px] w-full rounded-lg overflow-hidden">
        <TradingViewWidget
          key={selectedMetal.symbol} // 确保组件在贵金属变化时重新渲染
          symbol={selectedMetal.tvSymbol}
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
          container_id={`tradingview_metal_${selectedMetal.symbol}`}
          studies={[
            "MASimple@tv-basicstudies",
            "RSI@tv-basicstudies"
          ]}
        />
      </div>
      
      <div className="mt-4 pt-4 border-t border-secondary/30">
        <p className="text-xs text-muted-foreground text-center">
          TradingView • 真实贵金属数据 • 仅供参考，投资有风险
        </p>
      </div>
    </div>
  );
};

export default PreciousMetals;