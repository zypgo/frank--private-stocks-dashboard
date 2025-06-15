
import { useQuery } from "@tanstack/react-query";

// 模拟新闻数据 - 在实际应用中应该从新闻API获取
const mockNews = [
  {
    id: 1,
    title: "Bitcoin Reaches New Monthly High Amid Institutional Adoption",
    summary: "Bitcoin continues its upward trend as more institutions announce crypto adoption plans.",
    timestamp: "2小时前",
    source: "CryptoNews"
  },
  {
    id: 2,
    title: "Ethereum 2.0 Staking Rewards Attract More Validators",
    summary: "The number of ETH validators continues to grow as staking rewards remain attractive.",
    timestamp: "4小时前",
    source: "DeFi Daily"
  },
  {
    id: 3,
    title: "Regulatory Clarity Boosts Crypto Market Confidence",
    summary: "New regulatory frameworks provide clearer guidelines for crypto operations.",
    timestamp: "6小时前",
    source: "Blockchain Times"
  },
  {
    id: 4,
    title: "DeFi TVL Reaches All-Time High",
    summary: "Total Value Locked in DeFi protocols surpasses previous records.",
    timestamp: "8小时前",
    source: "DeFi Pulse"
  }
];

const NewsFeed = () => {
  const { data: news, isLoading } = useQuery({
    queryKey: ['cryptoNews'],
    queryFn: async () => {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockNews;
    },
    refetchInterval: 300000, // 每5分钟刷新一次
  });

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-lg animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">最新资讯</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">最新资讯</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {news?.map((article) => (
          <div key={article.id} className="border-b border-secondary pb-4 last:border-b-0">
            <h3 className="font-medium text-sm mb-2 line-clamp-2">{article.title}</h3>
            <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{article.summary}</p>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{article.source}</span>
              <span>{article.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
