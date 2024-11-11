import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const cryptos = [
  { name: "Bitcoin", symbol: "BTC", price: 48250.20, change: 2.4, volume: "32.1B" },
  { name: "Ethereum", symbol: "ETH", price: 2890.15, change: -1.2, volume: "15.4B" },
  { name: "Binance Coin", symbol: "BNB", price: 312.50, change: 0.8, volume: "2.1B" },
  { name: "Cardano", symbol: "ADA", price: 1.20, change: -2.5, volume: "1.8B" },
  { name: "Solana", symbol: "SOL", price: 102.80, change: 5.2, volume: "3.2B" },
];

const CryptoList = () => {
  return (
    <div className="glass-card rounded-lg p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Top Cryptocurrencies</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="pb-4">Name</th>
              <th className="pb-4">Price</th>
              <th className="pb-4">24h Change</th>
              <th className="pb-4">Volume</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto) => (
              <tr key={crypto.symbol} className="border-t border-secondary">
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      {crypto.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">${crypto.price.toLocaleString()}</td>
                <td className="py-4">
                  <span
                    className={`flex items-center gap-1 ${
                      crypto.change >= 0 ? "text-success" : "text-warning"
                    }`}
                  >
                    {crypto.change >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3" />
                    )}
                    {Math.abs(crypto.change)}%
                  </span>
                </td>
                <td className="py-4">${crypto.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoList;