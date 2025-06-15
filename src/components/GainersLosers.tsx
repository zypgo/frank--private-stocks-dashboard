
import { useQuery } from "@tanstack/react-query";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const fetchGainersLosers = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=50&page=1&sparkline=false');
  if (!response.ok) {
    throw new Error('Failed to fetch gainers and losers');
  }
  const data = await response.json();
  
  const gainers = data.filter((coin: any) => coin.price_change_percentage_24h > 0).slice(0, 5);
  const losers = data.filter((coin: any) => coin.price_change_percentage_24h < 0).slice(-5).reverse();
  
  return { gainers, losers };
};

const GainersLosers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['gainersLosers'],
    queryFn: fetchGainersLosers,
    refetchInterval: 60000, // 每分钟刷新一次
  });

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-lg animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">涨跌榜</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">涨跌榜</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-success font-medium mb-3 flex items-center gap-2">
            <ArrowUpIcon className="w-4 h-4" />
            今日涨幅榜
          </h3>
          <div className="space-y-2">
            {data?.gainers?.map((coin: any, index: number) => (
              <div key={coin.id} className="flex items-center justify-between p-2 rounded hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                  <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                  <span className="text-sm font-medium">{coin.symbol.toUpperCase()}</span>
                </div>
                <span className="text-success text-sm font-medium">
                  +{coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-warning font-medium mb-3 flex items-center gap-2">
            <ArrowDownIcon className="w-4 h-4" />
            今日跌幅榜
          </h3>
          <div className="space-y-2">
            {data?.losers?.map((coin: any, index: number) => (
              <div key={coin.id} className="flex items-center justify-between p-2 rounded hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                  <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                  <span className="text-sm font-medium">{coin.symbol.toUpperCase()}</span>
                </div>
                <span className="text-warning text-sm font-medium">
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GainersLosers;
