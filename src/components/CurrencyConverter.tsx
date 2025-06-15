
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const fetchCryptoPrices = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false');
  if (!response.ok) {
    throw new Error('Failed to fetch crypto prices');
  }
  return response.json();
};

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState("bitcoin");
  const [toCurrency, setToCurrency] = useState("ethereum");
  const [amount, setAmount] = useState("1");
  const [convertedAmount, setConvertedAmount] = useState("0");

  const { data: cryptos, isLoading } = useQuery({
    queryKey: ['cryptoPrices'],
    queryFn: fetchCryptoPrices,
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (cryptos && amount) {
      const fromCrypto = cryptos.find((c: any) => c.id === fromCurrency);
      const toCrypto = cryptos.find((c: any) => c.id === toCurrency);
      
      if (fromCrypto && toCrypto) {
        const result = (parseFloat(amount) * fromCrypto.current_price) / toCrypto.current_price;
        setConvertedAmount(result.toFixed(8));
      }
    }
  }, [cryptos, fromCurrency, toCurrency, amount]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-lg animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">货币转换器</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-8 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">货币转换器</h2>
      
      <div className="space-y-4">
        {/* From Currency */}
        <div>
          <label className="block text-sm font-medium mb-2">从</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 px-3 py-2 bg-secondary/20 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="输入数量"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-3 py-2 bg-secondary/20 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm min-w-[120px]"
            >
              {cryptos?.map((crypto: any) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.symbol.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapCurrencies}
            className="p-2 bg-secondary/20 hover:bg-secondary/40 rounded-lg transition-colors"
          >
            <ArrowDownIcon className="w-4 h-4" />
          </button>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-medium mb-2">到</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={convertedAmount}
              readOnly
              className="flex-1 px-3 py-2 bg-secondary/10 border border-secondary rounded-lg text-sm"
              placeholder="转换结果"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="px-3 py-2 bg-secondary/20 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm min-w-[120px]"
            >
              {cryptos?.map((crypto: any) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.symbol.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conversion Rate */}
        {cryptos && (
          <div className="text-center text-sm text-muted-foreground p-3 bg-secondary/10 rounded-lg">
            1 {cryptos.find((c: any) => c.id === fromCurrency)?.symbol.toUpperCase()} = {" "}
            {cryptos.find((c: any) => c.id === fromCurrency) && cryptos.find((c: any) => c.id === toCurrency) ? 
              (cryptos.find((c: any) => c.id === fromCurrency).current_price / 
               cryptos.find((c: any) => c.id === toCurrency).current_price).toFixed(8) : 
              "0"
            } {cryptos.find((c: any) => c.id === toCurrency)?.symbol.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
