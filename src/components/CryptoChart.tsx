import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "Jan", price: 42000 },
  { date: "Feb", price: 45000 },
  { date: "Mar", price: 48000 },
  { date: "Apr", price: 44000 },
  { date: "May", price: 46000 },
  { date: "Jun", price: 50000 },
  { date: "Jul", price: 49000 },
];

const CryptoChart = () => {
  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Bitcoin Price</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full text-sm bg-primary text-white">1D</button>
          <button className="px-3 py-1 rounded-full text-sm bg-secondary text-foreground">1W</button>
          <button className="px-3 py-1 rounded-full text-sm bg-secondary text-foreground">1M</button>
          <button className="px-3 py-1 rounded-full text-sm bg-secondary text-foreground">1Y</button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8989DE" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8989DE" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#8989DE"
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoChart;