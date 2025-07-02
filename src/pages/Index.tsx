
import MarketStats from "@/components/MarketStats";
import CryptoChart from "@/components/CryptoChart";
import PortfolioCard from "@/components/PortfolioCard";
import CryptoList from "@/components/CryptoList";
import TrendingSearch from "@/components/TrendingSearch";
import GainersLosers from "@/components/GainersLosers";
import CryptoSearch from "@/components/CryptoSearch";
import StockMarket from "@/components/StockMarket";
import PreciousMetals from "@/components/PreciousMetals";
import ConsumerGoods from "@/components/ConsumerGoods";
import TechStocks from "@/components/TechStocks";
import MedicalStocks from "@/components/MedicalStocks";
import StockDashboard from "@/components/StockDashboard";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Frank's仪表盘</h1>
            <p className="text-muted-foreground">美股组合 • 贵金属 • 加密货币</p>
          </div>
          <ThemeToggle />
        </header>
        
        {/* Frank's Portfolio - 最重要的放在最前面 */}
        <div className="mb-8">
          <StockDashboard />
        </div>
        
        {/* 美股组合区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <ConsumerGoods />
          </div>
          <div>
            <TechStocks />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <MedicalStocks />
          </div>
          <div>
            <StockMarket />
          </div>
        </div>

        {/* 贵金属区域 */}
        <div className="mb-8">
          <PreciousMetals />
        </div>

        {/* 加密货币区域 - 移到最后 */}
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
        
        {/* 功能区域 - 调整为2列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
