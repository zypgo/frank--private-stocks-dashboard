# Frank's Portfolio Dashboard

一个现代化的金融投资组合仪表板，提供实时股票数据、加密货币信息和市场分析。

## 🌟 特性

### 股票投资组合
- **Frank's Portfolio**: 追踪个人股票投资组合
- **实时数据**: 集成 FMP (Financial Modeling Prep) API 获取实时股票价格
- **批量查询**: 一次请求获取多只股票数据，提高效率
- **数据源标识**: 清楚标识真实数据和模拟数据
- **手动刷新**: 点击刷新按钮获取最新数据

### 股票分类
- **七巨头科技股**: Apple, Alphabet 等
- **贵金属ETF**: SPDR黄金ETF (GLD), iShares黄金ETF (IAU)
- **消费品股票**: 好时、卡夫亨氏、亿滋、百事可乐等
- **科技股票**: 拼多多、美光科技、高通
- **医疗股票**: 联合健康
- **消费品专区**: 专门的消费品股票展示
- **医疗股专区**: 医疗相关股票展示  
- **贵金属专区**: 黄金相关投资展示

### 加密货币
- **市场概览**: 前5大加密货币市值排行
- **涨跌榜**: 24小时涨跌幅排行榜
- **趋势搜索**: 热门搜索加密货币
- **价格图表**: 比特币180天价格走势图
- **恐贪指数**: 市场情绪指标

### 用户体验
- **响应式设计**: 适配各种设备尺寸
- **暗黑模式**: 支持明暗主题切换
- **实时更新**: 数据实时刷新显示
- **优雅动画**: 流畅的用户界面动画
- **错误处理**: 完善的错误提示和降级方案

## 🛠️ 技术栈

- **Frontend**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS + shadcn/ui 组件库
- **图表**: Recharts + TradingView Widget
- **图标**: Lucide React
- **路由**: React Router Dom
- **状态管理**: React Hooks
- **API集成**: 
  - Financial Modeling Prep (FMP) - 股票数据
  - CoinGecko API - 加密货币数据
  - Alpha Vantage API - 备用股票数据源

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn 或 bun

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd franks-portfolio-dashboard
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
# 或
bun install
```

3. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
# 或
bun dev
```

4. **打开浏览器**
访问 `http://localhost:5173`

## 🔑 API 配置

### Financial Modeling Prep (FMP) API
为了获取真实的股票数据，您需要配置 FMP API 密钥：

1. 访问 [Financial Modeling Prep](https://financialmodelingprep.com) 注册免费账户
2. 获取您的 API 密钥
3. 在应用中点击设置按钮 (⚙️)
4. 输入您的 API 密钥并保存

**免费计划限制**:
- 每日 250 次 API 调用
- 历史数据访问
- 基础财务数据

### CoinGecko API
加密货币数据使用 CoinGecko 的免费 API，无需配置。

## 📱 使用指南

### 股票投资组合
1. **查看投资组合**: 主页显示 Frank's Portfolio 部分
2. **刷新数据**: 点击刷新按钮获取最新价格
3. **设置 API**: 点击设置按钮配置 FMP API 密钥
4. **数据标识**: 
   - 🟢 **FMP**: 真实数据来源于 FMP API
   - 🟠 **模拟**: 演示用模拟数据

### 加密货币
1. **市场概览**: 查看顶级加密货币
2. **涨跌榜**: 发现表现最佳的币种
3. **趋势分析**: 查看热门搜索和价格图表

### 主题切换
点击右上角的主题切换按钮在明暗模式间切换。

## 🏗️ 项目结构

```
src/
├── components/          # React 组件
│   ├── ui/             # shadcn/ui 基础组件
│   ├── StockDashboard.tsx    # 股票仪表板
│   ├── CryptoList.tsx        # 加密货币列表
│   ├── CryptoChart.tsx       # 加密货币图表
│   ├── ConsumerGoods.tsx     # 消费品股票
│   ├── MedicalStocks.tsx     # 医疗股票
│   ├── PreciousMetals.tsx    # 贵金属
│   └── ...
├── pages/              # 页面组件
├── hooks/              # 自定义 Hooks
├── lib/                # 工具函数
└── assets/             # 静态资源
```

## 🔧 开发

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 配置的代码规范
- 使用 Prettier 格式化代码

### 构建部署
```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📊 API 接口

### FMP API 示例
```javascript
// 批量获取股票报价
const url = `https://financialmodelingprep.com/api/v3/quote/AAPL,GOOGL,GLD?apikey=${API_KEY}`;

// 响应格式
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 209.95,
    "change": -3.60,
    "changePercentage": -1.6858,
    "volume": 50228984
  }
]
```

### CoinGecko API 示例
```javascript
// 获取市值排行榜
const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5';
```

## 🛡️ 安全性

- API 密钥存储在浏览器本地存储中
- 不在代码中硬编码敏感信息
- 支持 HTTPS 通信
- 输入验证和错误处理

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 这个项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

本应用仅供教育和演示目的。所有金融数据仅供参考，不构成投资建议。投资有风险，请根据自己的情况谨慎决策。

## 🙏 致谢

- [Financial Modeling Prep](https://financialmodelingprep.com) - 股票数据API
- [CoinGecko](https://coingecko.com) - 加密货币数据API
- [shadcn/ui](https://ui.shadcn.com) - UI 组件库
- [Lucide](https://lucide.dev) - 图标库
- [TradingView](https://tradingview.com) - 图表组件

---

**Made with ❤️ by Frank**