
import MarketStats from "@/components/MarketStats";
import CryptoChart from "@/components/CryptoChart";
import PortfolioCard from "@/components/PortfolioCard";
import CryptoList from "@/components/CryptoList";
import FearGreedIndex from "@/components/FearGreedIndex";
import TrendingSearch from "@/components/TrendingSearch";
import GainersLosers from "@/components/GainersLosers";
import CryptoSearch from "@/components/CryptoSearch";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crypto Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your portfolio</p>
        </header>
        
        <MarketStats />
        
        {/* 主要图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <CryptoChart />
          </div>
          <div>
            <PortfolioCard />
          </div>
        </div>
        
        {/* 功能区域 - 调整为3列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <FearGreedIndex />
          </div>
          <div>
            <TrendingSearch />
          </div>
          <div>
            <GainersLosers />
          </div>
        </div>

        {/* 搜索区域 */}
        <div className="mb-8">
          <CryptoSearch />
        </div>
        
        <CryptoList />
      </div>
    </div>
  );
};

export default Index;
