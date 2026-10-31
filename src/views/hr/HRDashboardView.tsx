import React, { useEffect, useState } from "react";
import {
  AnalyticsSummary,
  Employee,
  Feedback,
  OrganizationalInsight,
} from "../../types";
import { api } from "../../services/api";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Flame,
  HeartHandshake,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
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
import { SentimentBadge, SeverityBadge, RiskBadge, GeminiAIPill } from "../../components/Badges";

interface HRDashboardViewProps {
  onOpenFeedback: (fb: Feedback) => void;
  onNavigate: (view: any) => void;
}

export const HRDashboardView: React.FC<HRDashboardViewProps> = ({
  onOpenFeedback,
  onNavigate,
}) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [sentimentData, setSentimentData] = useState<{ distribution: any[]; monthlyTrend: any[] } | null>(null);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<{ distribution: any[]; highRiskEmployees: any[] } | null>(null);
  const [insights, setInsights] = useState<OrganizationalInsight[]>([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sum, sent, depts, cats, risk, ins, fbs] = await Promise.all([
        api.getAnalyticsSummary(),
        api.getSentimentAnalytics(),
        api.getDepartmentAnalytics(),
        api.getCategoryAnalytics(),
        api.getRiskAnalytics(),
        api.getOrganizationalInsights(),
        api.getAllFeedback({}),
      ]);

      setSummary(sum);
      setSentimentData(sent);
      setDeptData(depts);
      setCategoryData(cats.slice(0, 5));
      setRiskData(risk);
      setInsights(ins.topIssues || []);
      setRecentFeedbacks(fbs.slice(0, 5));
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">
          Calculating organization metrics from MySQL database...
        </p>
      </div>
    );
  }

  const SENTIMENT_COLORS = ["#10b981", "#64748b", "#f43f5e"];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Alert if Critical Employees exist */}
      {summary.burnoutRiskEmployees > 0 && (
        <div className="p-4 bg-gradient-to-r from-rose-50 via-amber-50 to-white rounded-xl border border-rose-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-950 flex items-center gap-2">
                <span>Burnout & Flight Risk Detected</span>
                <span className="px-2 py-0.5 bg-rose-200 text-rose-800 rounded text-[11px] font-bold">
                  {summary.burnoutRiskEmployees} Employees
                </span>
              </h4>
              <p className="text-xs text-rose-700/90">
                Gemini AI flagged high negative sentiment velocity and repeated mentions of workload pressure.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("hr_risk")}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-1"
          >
            Review At-Risk Employees
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Employee Satisfaction */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Satisfaction Score</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">{summary.satisfactionScore}%</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +3.2%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
            <div style={{ width: `${summary.positivePercent}%` }} className="bg-emerald-500 h-full" />
            <div style={{ width: `${summary.neutralPercent}%` }} className="bg-slate-400 h-full" />
            <div style={{ width: `${summary.negativePercent}%` }} className="bg-rose-500 h-full" />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span className="text-emerald-600 font-semibold">{summary.positivePercent}% Pos</span>
            <span className="text-slate-500">{summary.neutralPercent}% Neu</span>
            <span className="text-rose-600 font-semibold">{summary.negativePercent}% Neg</span>
          </div>
        </div>

        {/* 2. Positive Feedback */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Positive Feedback</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{summary.positivePercent}%</span>
            <span className="text-[11px] text-slate-400">of total submissions</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Driven by praise for work-life culture & product leadership
          </p>
        </div>

        {/* 3. Negative Feedback */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Negative Feedback</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">{summary.negativePercent}%</span>
            <span className="text-[11px] text-slate-400">{summary.totalFeedback} total</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Primarily concerns sprint on-call & compensation benchmarks
          </p>
        </div>

        {/* 4. AI Risk Score */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Org AI Risk Index</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{summary.aiRiskScore}</span>
            <span className="text-xs text-slate-400">/100 (Moderate)</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Calculated across {summary.totalEmployees} employees in real time
          </p>
        </div>

        {/* 5. Burnout Risk Count */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Burnout At-Risk</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600">{summary.burnoutRiskEmployees}</span>
            <span className="text-[11px] text-slate-400">employees flagged</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Need urgent 1-on-1 check-ins & workload balancing
          </p>
        </div>

        {/* 6. Employee Engagement */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Engagement Score</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-600">{summary.engagementScore}%</span>
            <span className="text-[11px] font-bold text-emerald-600">+1.8% MoM</span>
          </div>
          <p className="text-[11px] text-slate-500">
            High participation across sprint and review cycles
          </p>
        </div>

        {/* 7. Top Performing Department */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Top Performing Dept</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-800 truncate">
              {summary.topPerformingDepartment}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Highest net positive feedback and satisfaction rating
          </p>
        </div>

        {/* 8. Total Volume */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Submissions</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">{summary.totalFeedback}</span>
            <span className="text-[11px] text-slate-400">100% analyzed</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Automated sentiment & issue classification active
          </p>
        </div>
      </div>

      {/* 4 Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Monthly Feedback Trend */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Monthly Feedback Trend
              </h3>
              <p className="text-xs text-slate-400">Positive vs Negative Volume & Engagement</p>
            </div>
            <span className="text-xs text-indigo-600 font-semibold">Q2 - Q3 2026</span>
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
                  name="Positive Feedback"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  name="Negative Feedback"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Sentiment Distribution Donut */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sentiment Distribution
              </h3>
              <p className="text-xs text-slate-400">Overall feedback tone distribution</p>
            </div>
            <GeminiAIPill />
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData?.distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentData?.distribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || SENTIMENT_COLORS[index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Department Comparison Bar Chart */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Department Comparison
              </h3>
              <p className="text-xs text-slate-400">Positive vs Negative breakdown by team</p>
            </div>
            <button
              onClick={() => onNavigate("hr_departments")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All
            </button>
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
                <Bar dataKey="negative" name="Negative" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Feedback Category Distribution Bar Chart */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Top Categories Distribution
              </h3>
              <p className="text-xs text-slate-400">Volume and friction areas</p>
            </div>
            <button
              onClick={() => onNavigate("hr_analytics")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Deep Dive
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  width={110}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="count" name="Total Feedbacks" fill="#6366f1" radius={[0, 4, 4, 0]} />
                <Bar dataKey="negativeCount" name="Negative Volume" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Organizational Insights Section */}
      <div className="p-6 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white rounded-2xl border border-indigo-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                AI Organizational Insights & Strategic Directives
              </h3>
              <p className="text-xs text-slate-500">
                Synthesized by Google Gemini from all logged workplace feedback
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("hr_assistant")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask HR AI Assistant
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5">{item.issue}</h4>
                </div>
                <SeverityBadge severity={item.severity} />
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  👥 {item.affectedEmployees} Employees affected
                </span>
                <span>•</span>
                <span className="text-rose-600 font-medium">📈 {item.trend}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
                <span className="font-semibold text-indigo-900 block mb-0.5">
                  AI Recommended Action:
                </span>
                <p className="leading-relaxed">{item.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feedback Feed */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Recent Employee Feedback</h3>
            <p className="text-xs text-slate-500">
              Latest submissions analyzed in real time with Google Gemini
            </p>
          </div>
          <button
            onClick={() => onNavigate("hr_feedback")}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All Feedback
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Employee</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Feedback Summary</th>
                <th className="py-2.5 px-3">Sentiment</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentFeedbacks.map((fb) => (
                <tr key={fb.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                    {fb.isAnonymous ? "Anonymous" : fb.employee?.name || "Employee"}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                    {fb.department?.name || fb.departmentName || "General"}
                  </td>
                  <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{fb.category}</td>
                  <td className="py-3 px-3 text-slate-700 max-w-sm truncate font-medium">
                    {fb.analysis?.summary || fb.title}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <SentimentBadge sentiment={fb.analysis?.sentiment} size="sm" />
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <SeverityBadge severity={fb.analysis?.severity} />
                  </td>
                  <td className="py-3 px-3 font-semibold text-indigo-700 whitespace-nowrap">
                    {fb.status}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onOpenFeedback(fb)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-md border border-indigo-200 transition-colors"
                    >
                      Inspect AI Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
