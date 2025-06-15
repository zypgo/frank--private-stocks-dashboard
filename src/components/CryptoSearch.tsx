
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";

const searchCrypto = async (query: string) => {
  if (!query || query.length < 2) return [];
  
  const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search crypto');
  }
  const data = await response.json();
  return data.coins.slice(0, 10);
};

const CryptoSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['cryptoSearch', searchQuery],
    queryFn: () => searchCrypto(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  return (
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
              setIsOpen(e.target.value.length >= 2);
            }}
            onFocus={() => setIsOpen(searchQuery.length >= 2)}
            className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-secondary rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
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
            ) : searchResults && searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((coin: any) => (
                  <div
                    key={coin.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 cursor-pointer transition-colors"
                    onClick={() => {
                      console.log('Selected coin:', coin.name);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <img 
                      src={coin.thumb || coin.large} 
                      alt={coin.name} 
                      className="w-8 h-8 rounded-full"
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
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CryptoSearch;
