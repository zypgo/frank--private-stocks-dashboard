
import { useQuery } from "@tanstack/react-query";

const fetchFearGreedIndex = async () => {
  // 模拟API数据 - 实际应用中应该从恐惧贪婪指数API获取
  return {
    value: 73,
    classification: "贪婪",
    lastUpdate: "2024-12-18",
    history: [
      { date: "2024-12-17", value: 71 },
      { date: "2024-12-16", value: 68 },
      { date: "2024-12-15", value: 75 },
      { date: "2024-12-14", value: 69 },
      { date: "2024-12-13", value: 72 },
    ]
  };
};

const getClassification = (value: number) => {
  if (value >= 75) return { text: "极度贪婪", color: "text-red-400" };
  if (value >= 55) return { text: "贪婪", color: "text-orange-400" };
  if (value >= 45) return { text: "中性", color: "text-yellow-400" };
  if (value >= 25) return { text: "恐惧", color: "text-blue-400" };
  return { text: "极度恐惧", color: "text-purple-400" };
};

const FearGreedIndex = () => {
  const { data: fearGreed, isLoading } = useQuery({
    queryKey: ['fearGreedIndex'],
    queryFn: fetchFearGreedIndex,
    refetchInterval: 3600000, // 每小时刷新一次
  });

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-lg animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">恐惧贪婪指数</h2>
        <div className="animate-pulse">
          <div className="h-24 bg-muted rounded mb-4"></div>
          <div className="h-4 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const classification = getClassification(fearGreed?.value || 0);

  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">恐惧贪婪指数</h2>
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-secondary"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${(fearGreed?.value || 0) * 2.51} 251`}
              className={classification.color}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{fearGreed?.value}</div>
              <div className={`text-sm ${classification.color}`}>{classification.text}</div>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          更新时间: {fearGreed?.lastUpdate}
        </p>
      </div>
    </div>
  );
};

export default FearGreedIndex;
