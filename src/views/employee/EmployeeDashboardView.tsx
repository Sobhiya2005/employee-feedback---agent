import React, { useEffect, useState } from "react";
import { Feedback } from "../../types";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartHandshake,
  MessageSquare,
  MessageSquarePlus,
  MinusCircle,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import { SentimentBadge, SeverityBadge } from "../../components/Badges";

interface EmployeeDashboardViewProps {
  onNavigate: (view: any) => void;
  onOpenFeedback: (fb: Feedback) => void;
}

export const EmployeeDashboardView: React.FC<EmployeeDashboardViewProps> = ({
  onNavigate,
  onOpenFeedback,
}) => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyFeedbacks();
  }, []);

  const loadMyFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await api.getMyFeedback();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total = feedbacks.length;
  const positive = feedbacks.filter((f) => f.analysis?.sentiment === "POSITIVE").length;
  const neutral = feedbacks.filter((f) => f.analysis?.sentiment === "NEUTRAL").length;
  const negative = feedbacks.filter((f) => f.analysis?.sentiment === "NEGATIVE").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Card */}
      <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            AI-Powered Voice of Employee
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Your Voice Drives Real Organizational Change
          </h2>
          <p className="text-xs md:text-sm text-indigo-100/80 leading-relaxed">
            Every submission is instantly synthesized by Google Gemini AI, ensuring HR leadership receives clear, constructive summaries and actionable recommendations.
          </p>
        </div>

        <button
          id="btn-quick-submit-feedback"
          onClick={() => onNavigate("emp_submit_feedback")}
          className="z-10 px-5 py-3 bg-white hover:bg-slate-50 text-indigo-900 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-102 shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4 text-indigo-600" />
          <span>Submit New Feedback</span>
          <ArrowRight className="w-4 h-4 text-indigo-600" />
        </button>

        {/* Decorative backdrop glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Submitted */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Submitted</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{total}</div>
          <p className="text-[11px] text-slate-400">Total logged observations</p>
        </div>

        {/* Positive */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Positive Feedback</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{positive}</div>
          <p className="text-[11px] text-slate-400">Celebrated successes & kudos</p>
        </div>

        {/* Neutral */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Neutral Feedback</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <MinusCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-700">{neutral}</div>
          <p className="text-[11px] text-slate-400">General workplace observations</p>
        </div>

        {/* Negative */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Constructive / Pain Points</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">{negative}</div>
          <p className="text-[11px] text-slate-400">Areas flagged for resolution</p>
        </div>
      </div>

      {/* Recent Feedback Feed */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">My Recent Submissions</h3>
            <p className="text-xs text-slate-500">
              Live updates on automated AI analysis and HR resolution progress
            </p>
          </div>
          <button
            onClick={() => onNavigate("emp_feedback_history")}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Full History
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Title & Summary</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">AI Sentiment</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Resolution Status</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading your feedback submissions...
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p>You haven't submitted any feedback yet.</p>
                    <button
                      onClick={() => onNavigate("emp_submit_feedback")}
                      className="mt-2 text-indigo-600 font-semibold hover:underline"
                    >
                      Submit your first feedback →
                    </button>
                  </td>
                </tr>
              ) : (
                feedbacks.slice(0, 5).map((fb) => (
                  <tr key={fb.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 max-w-sm">
                      <p className="font-bold text-slate-800 truncate">{fb.title}</p>
                      <p className="text-slate-500 truncate text-[11px]">
                        {fb.analysis?.summary || fb.description}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{fb.category}</td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {fb.createdAt.split("T")[0]}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <SentimentBadge sentiment={fb.analysis?.sentiment} size="sm" />
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <SeverityBadge severity={fb.analysis?.severity} />
                    </td>
                    <td className="py-3 px-3 font-semibold text-indigo-700 whitespace-nowrap">
                      {fb.status.replace("_", " ")}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onOpenFeedback(fb)}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-md border border-indigo-200 transition-colors"
                      >
                        Inspect AI
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
