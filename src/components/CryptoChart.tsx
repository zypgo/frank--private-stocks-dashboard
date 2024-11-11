import TradingViewWidget from 'react-tradingview-widget';

const CryptoChart = () => {
  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Bitcoin Price</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full text-sm bg-primary text-white">1D</button>
          <button className="px-3 py-1 rounded-full text-sm bg-secondary text-foreground">1W</button>
          <button className="px-3 py-1 rounded-full text-sm bg-secondary text-foreground">1M</button>
          <button className="px-3 py-1 rounded-full text-sm bg-secondary text-foreground">1Y</button>
        </div>
      </div>
      <div className="h-[400px] w-full">
        <TradingViewWidget
          symbol="BINANCE:BTCUSDT"
          theme="light"
          locale="en"
          autosize
          hide_side_toolbar={false}
          allow_symbol_change={true}
          interval="D"
          toolbar_bg="#FAFAF8"
          enable_publishing={false}
          hide_top_toolbar={false}
          save_image={false}
          container_id="tradingview_chart"
        />
      </div>
    </div>
  );
};

export default CryptoChart;