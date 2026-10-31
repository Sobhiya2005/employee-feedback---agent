import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Bot, Download, Sparkles, TrendingUp } from "lucide-react";
import { GeminiAIPill } from "../../components/Badges";

export const HRAnalyticsView: React.FC = () => {
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllAnalytics();
  }, []);

  const loadAllAnalytics = async () => {
    setLoading(true);
    try {
      const [sent, depts, cats, risk] = await Promise.all([
        api.getSentimentAnalytics(),
        api.getDepartmentAnalytics(),
        api.getCategoryAnalytics(),
        api.getRiskAnalytics(),
      ]);
      setSentimentData(sent);
      setDeptData(depts);
      setCategoryData(cats);
      setRiskData(risk);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const engagementTrend = [
    { month: "Jan", engagement: 74, benchmark: 72 },
    { month: "Feb", engagement: 76, benchmark: 72 },
    { month: "Mar", engagement: 75, benchmark: 73 },
    { month: "Apr", engagement: 79, benchmark: 73 },
    { month: "May", engagement: 82, benchmark: 74 },
    { month: "Jun", engagement: 80, benchmark: 74 },
    { month: "Jul", engagement: 78, benchmark: 75 },
    { month: "Aug", engagement: 81, benchmark: 75 },
    { month: "Sep", engagement: 85, benchmark: 76 },
  ];

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center text-xs text-slate-500">
        Aggregating deep cross-departmental sentiment analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Organizational Analytics & Trend Intelligence</span>
            <GeminiAIPill />
          </h2>
          <p className="text-xs text-slate-500">
            Real-time calculations across satisfaction, sentiment velocity, risk distribution, and departmental benchmarks
          </p>
        </div>
      </div>

      {/* Grid of 7 Deep Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Monthly Feedback Trend */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              1. Monthly Feedback Trend (Volume & Sentiment)
            </h3>
            <span className="text-xs text-slate-400">Line Chart</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData?.monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line
                  type="monotone"
                  dataKey="positive"
                  name="Positive Submissions"
                  stroke="#10b981"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  name="Negative Submissions"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  name="Neutral Submissions"
                  stroke="#94a3b8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Department Comparison Bar Chart */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              2. Department Comparison (Positive vs Negative)
            </h3>
            <span className="text-xs text-slate-400">Stacked Bar</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="code" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="positive" name="Positive" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="neutral" name="Neutral" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="negative" name="Negative" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Sentiment Distribution Pie Chart */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              3. Sentiment Distribution (Pie Chart)
            </h3>
            <span className="text-xs text-slate-400">Proportions</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData?.distribution || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sentimentData?.distribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Feedback Category Distribution Bar Chart */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              4. Category Distribution & Negative Friction
            </h3>
            <span className="text-xs text-slate-400">Horizontal Bar</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  width={110}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="count" name="Total Feedbacks" fill="#6366f1" radius={[0, 4, 4, 0]} />
                <Bar dataKey="negativeCount" name="Negative Issues" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Employee Risk Distribution Donut Chart */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              5. Employee Risk Distribution (AI Risk Model)
            </h3>
            <span className="text-xs text-slate-400">Donut Chart</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData?.distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData?.distribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Monthly Employee Engagement Line Chart */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              6. Monthly Employee Engagement Score
            </h3>
            <span className="text-xs text-slate-400">Engagement % vs Target</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  name="Engagement %"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  name="Industry Benchmark"
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 7. Department Satisfaction Bar Chart (Full Width) */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              7. Department Satisfaction Scores (% Net Positive)
            </h3>
            <p className="text-xs text-slate-400">Directly computed from verified employee feedback sentiments</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip />
              <Bar dataKey="satisfactionScore" name="Satisfaction Score (%)" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                {deptData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.satisfactionScore > 75 ? "#10b981" : entry.satisfactionScore > 60 ? "#3b82f6" : "#f59e0b"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
