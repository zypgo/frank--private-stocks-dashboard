
import { useQuery } from "@tanstack/react-query";
import { X, TrendingUp, TrendingDown } from "lucide-react";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  current_price?: number;
  price_change_percentage_24h?: number;
  market_cap?: number;
  market_cap_rank?: number;
  total_volume?: number;
}

interface CoinDetailCardProps {
  coinId: string;
  onClose: () => void;
}

const fetchCoinDetails = async (coinId: string) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
  if (!response.ok) {
    throw new Error('Failed to fetch coin details');
  }
  return response.json();
};

const CoinDetailCard = ({ coinId, onClose }: CoinDetailCardProps) => {
  const { data: coin, isLoading, error } = useQuery({
    queryKey: ['coinDetails', coinId],
    queryFn: () => fetchCoinDetails(coinId),
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="glass-card p-6 rounded-lg max-w-md w-full mx-4 animate-fade-in">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full"></div>
                <div>
                  <div className="h-5 bg-muted rounded w-24 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="glass-card p-6 rounded-lg max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-500">加载失败</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-muted-foreground">无法加载币种详情，请稍后重试。</p>
        </div>
      </div>
    );
  }

  const priceChange = coin?.market_data?.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="glass-card p-6 rounded-lg max-w-md w-full mx-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img 
              src={coin?.image?.large || coin?.image?.small} 
              alt={coin?.name} 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-xl font-bold">{coin?.name}</h3>
              <p className="text-muted-foreground">{coin?.symbol?.toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">当前价格</span>
            <span className="text-2xl font-bold">
              ${coin?.market_data?.current_price?.usd?.toLocaleString() || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">24小时变化</span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-semibold">
                {priceChange?.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">市值排名</span>
            <span className="font-semibold">
              #{coin?.market_cap_rank || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">市值</span>
            <span className="font-semibold">
              ${coin?.market_data?.market_cap?.usd?.toLocaleString() || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">24小时交易量</span>
            <span className="font-semibold">
              ${coin?.market_data?.total_volume?.usd?.toLocaleString() || 'N/A'}
            </span>
          </div>

          {coin?.description?.en && (
            <div className="pt-4 border-t border-secondary">
              <h4 className="font-semibold mb-2">简介</h4>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {coin.description.en.replace(/<[^>]*>/g, '')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinDetailCard;
