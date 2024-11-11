import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Bitcoin", value: 45 },
  { name: "Ethereum", value: 30 },
  { name: "Others", value: 25 },
];

const COLORS = ["#8989DE", "#7EBF8E", "#D2886F"];

const PortfolioCard = () => {
  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Portfolio Distribution</h2>
      <div className="flex items-center justify-between">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;