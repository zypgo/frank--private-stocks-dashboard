
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import CoinDetailCard from "./CoinDetailCard";

const searchCrypto = async (query: string) => {
  if (!query || query.length < 2) return [];
  
  console.log('Searching for:', query);
  
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      console.error('Search API failed with status:', response.status);
      throw new Error(`Search failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Search results:', data.coins?.length || 0, 'coins found');
    return data.coins?.slice(0, 10) || [];
  } catch (error) {
    console.error('Search error:', error);
    // Return some mock data as fallback
    if (query.toLowerCase().includes('btc') || query.toLowerCase().includes('bitcoin')) {
      return [{
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        market_cap_rank: 1,
        thumb: 'https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png'
      }];
    }
    return [];
  }
};

const CryptoSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['cryptoSearch', searchQuery],
    queryFn: () => searchCrypto(searchQuery),
    enabled: searchQuery.length >= 2,
    retry: 1,
    retryDelay: 2000,
  });

  // 当币种详情卡片打开时，关闭搜索下拉菜单
  useEffect(() => {
    if (selectedCoinId) {
      setIsOpen(false);
    }
  }, [selectedCoinId]);

  const handleCoinSelect = (coinId: string) => {
    console.log('Selected coin:', coinId);
    setSelectedCoinId(coinId);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <div className="glass-card p-6 rounded-lg animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">搜索加密货币</h2>
        
        <div className="relative">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="搜索币种名称或符号..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // 只有在没有选中币种时才显示搜索结果
                setIsOpen(e.target.value.length >= 2 && !selectedCoinId);
              }}
              onFocus={() => setIsOpen(searchQuery.length >= 2 && !selectedCoinId)}
              className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          {/* 只有在没有选中币种时才显示搜索结果 */}
          {isOpen && !selectedCoinId && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-secondary rounded-lg shadow-lg z-40 max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-4">
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="p-4 text-center">
                  <p className="text-red-500 text-sm mb-2">搜索服务暂时不可用</p>
                  <p className="text-muted-foreground text-xs">
                    请尝试直接输入常见币种如 "bitcoin", "ethereum"
                  </p>
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((coin: any) => (
                    <div
                      key={coin.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 cursor-pointer transition-colors"
                      onClick={() => handleCoinSelect(coin.id)}
                    >
                      <img 
                        src={coin.thumb || coin.large} 
                        alt={coin.name} 
                        className="w-8 h-8 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{coin.name}</p>
                        <p className="text-muted-foreground text-xs">{coin.symbol}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        #{coin.market_cap_rank || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  未找到相关币种
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* 点击外部关闭搜索结果 */}
        {isOpen && !selectedCoinId && (
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* 显示币种详情卡片 */}
      {selectedCoinId && (
        <CoinDetailCard 
          coinId={selectedCoinId}
          onClose={() => setSelectedCoinId(null)}
        />
      )}
    </>
  );
};

export default CryptoSearch;
