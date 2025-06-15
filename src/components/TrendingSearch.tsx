
import { useQuery } from "@tanstack/react-query";
import { TrendingUpIcon } from "lucide-react";

const fetchTrendingCoins = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
  if (!response.ok) {
    throw new Error('Failed to fetch trending coins');
  }
  return response.json();
};

const TrendingSearch = () => {
  const { data: trending, isLoading } = useQuery({
    queryKey: ['trendingCoins'],
    queryFn: fetchTrendingCoins,
    refetchInterval: 300000, // 每5分钟刷新一次
  });

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-lg animate-fade-in">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUpIcon className="w-5 h-5" />
          热门搜索
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <TrendingUpIcon className="w-5 h-5" />
        热门搜索
      </h2>
      <div className="space-y-3">
        {trending?.coins?.slice(0, 7).map((coin: any, index: number) => (
          <div key={coin.item.id} className="flex items-center gap-3 p-2 rounded hover:bg-secondary/20 transition-colors cursor-pointer">
            <span className="text-muted-foreground text-sm w-6">{index + 1}</span>
            <img 
              src={coin.item.small} 
              alt={coin.item.name} 
              className="w-6 h-6 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{coin.item.name}</p>
              <p className="text-muted-foreground text-xs">{coin.item.symbol}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              #{coin.item.market_cap_rank || 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSearch;
