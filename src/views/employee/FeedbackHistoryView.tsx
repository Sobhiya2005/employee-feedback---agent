import React, { useEffect, useState } from "react";
import { Feedback } from "../../types";
import { api } from "../../services/api";
import { Eye, History, RefreshCw, Search } from "lucide-react";
import { SentimentBadge, SeverityBadge } from "../../components/Badges";

interface FeedbackHistoryViewProps {
  onOpenFeedback: (fb: Feedback) => void;
}

export const FeedbackHistoryView: React.FC<FeedbackHistoryViewProps> = ({
  onOpenFeedback,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterSentiment, setFilterSentiment] = useState("ALL");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
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

  const filtered = feedbacks.filter((f) => {
    if (filterCategory !== "ALL" && f.category !== filterCategory) return false;
    if (filterSentiment !== "ALL" && f.analysis?.sentiment !== filterSentiment) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            My Feedback Submissions & History
          </h2>
          <p className="text-xs text-slate-500">
            Review past submissions, inspect automated Gemini AI findings, and monitor HR resolution milestones
          </p>
        </div>
        <button
          onClick={loadHistory}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3 text-xs">
        <div>
          <label className="font-semibold text-slate-500 mr-2">Sentiment:</label>
          <select
            value={filterSentiment}
            onChange={(e) => setFilterSentiment(e.target.value)}
            className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium"
          >
            <option value="ALL">All Sentiments</option>
            <option value="POSITIVE">Positive</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="NEGATIVE">Negative</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-500 mr-2">Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="Workload">Workload</option>
            <option value="Management">Management</option>
            <option value="Work Environment">Work Environment</option>
            <option value="Salary & Benefits">Salary & Benefits</option>
            <option value="Career Growth">Career Growth</option>
            <option value="Team Collaboration">Team Collaboration</option>
            <option value="Workplace Facilities">Workplace Facilities</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Title & Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Sentiment</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading your submissions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No submissions found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((fb) => (
                  <tr
                    key={fb.id}
                    onClick={() => onOpenFeedback(fb)}
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-800 truncate">{fb.title}</div>
                      <div className="text-slate-500 text-[11px] truncate">
                        {fb.analysis?.summary || fb.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{fb.category}</td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {fb.createdAt.split("T")[0]}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <SentimentBadge sentiment={fb.analysis?.sentiment} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <SeverityBadge severity={fb.analysis?.severity} />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-700 whitespace-nowrap">
                      {fb.status.replace("_", " ")}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
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
