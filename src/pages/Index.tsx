
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">金融市场综合仪表板</h1>
          <p className="text-muted-foreground">加密货币 • 美股 • 贵金属 实时行情</p>
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
        
        {/* 功能区域 - 调整为2列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <TrendingSearch />
          </div>
          <div>
            <GainersLosers />
          </div>
        </div>

        {/* 股票和贵金属区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <StockMarket />
          </div>
          <div>
            <PreciousMetals />
          </div>
        </div>

        {/* 新增股票组件区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <ConsumerGoods />
          </div>
          <div>
            <TechStocks />
          </div>
        </div>

        {/* 医疗股票区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <MedicalStocks />
          </div>
          <div>
            <StockDashboard />
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
