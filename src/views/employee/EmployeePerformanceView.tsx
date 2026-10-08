import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Award,
  BarChart3,
  CheckCircle2,
  LineChart,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const EmployeePerformanceView: React.FC = () => {
  const { user } = useAuth();

  const radarData = [
    { subject: "Technical Craft", score: 96, fullMark: 100 },
    { subject: "Delivery Speed", score: 92, fullMark: 100 },
    { subject: "Collaboration", score: 94, fullMark: 100 },
    { subject: "AI Automation", score: 98, fullMark: 100 },
    { subject: "Mentorship", score: 88, fullMark: 100 },
    { subject: "Problem Solving", score: 95, fullMark: 100 },
  ];

  const quarterlyHistory = [
    { quarter: "Q3 2024", score: 89, rating: "Exceeds Expectations" },
    { quarter: "Q4 2024", score: 91, rating: "Exceeds Expectations" },
    { quarter: "Q1 2025", score: 93, rating: "Outstanding" },
    { quarter: "Q2 2025", score: 94, rating: "Outstanding" },
    { quarter: "Q3 2025", score: 96, rating: "Role Model" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Performance & Evaluation Dossier
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time competency scoring, quarterly evaluation trends, and AI-assisted performance benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-right">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">
              Current Rating
            </span>
            <span className="text-2xl font-black text-emerald-700">
              96<span className="text-xs text-emerald-600 font-normal"> / 100</span>
            </span>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-right">
            <span className="text-[11px] font-bold text-indigo-800 uppercase block">
              Department Rank
            </span>
            <span className="text-2xl font-black text-indigo-700">
              Top 5<span className="text-xs text-indigo-600 font-normal">%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Competency Radar & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart: 360 Competency */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                360° Competency Radar
              </h3>
              <p className="text-[11px] text-slate-400">
                Evaluation across leadership, technical velocity, and cross-team collaboration
              </p>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              <Sparkles className="w-3 h-3" />
              Gemini Benchmarked
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#4f46e5"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evaluation Progression Over Time */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Evaluation Growth Trend
              </h3>
              <p className="text-[11px] text-slate-400">
                Consistent quarter-over-quarter score escalation
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              +7.8% YOY
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyHistory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="quarter" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis domain={[80, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]}>
                  {quarterlyHistory.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === quarterlyHistory.length - 1 ? "#10b981" : "#6366f1"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Review Feedback & Management Commendations */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Latest Management Review Summary
        </h3>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800">Reviewer: Vikram Malhotra (VP of Engineering)</span>
            <span className="text-[11px] text-slate-400">Published September 2025</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            "{user?.name || "Sobhiya Logu"} continues to demonstrate remarkable technical excellence and proactive ownership. Their instrumental contributions in automating feedback sentiment analysis pipelines have catalyzed real organizational impact. Consistently acts as a trusted anchor for the team."
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700">
              🌟 Role Model Execution
            </span>
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700">
              💡 Innovation Champion
            </span>
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700">
              🤝 Exceptional Mentorship
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
