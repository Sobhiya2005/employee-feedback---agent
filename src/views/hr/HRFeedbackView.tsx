import React, { useEffect, useState } from "react";
import { Department, Feedback } from "../../types";
import { api } from "../../services/api";
import {
  AlertTriangle,
  Eye,
  Filter,
  MessageSquare,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { SentimentBadge, SeverityBadge, RiskBadge } from "../../components/Badges";

interface HRFeedbackViewProps {
  onOpenFeedback: (fb: Feedback) => void;
  departments: Department[];
}

export const HRFeedbackView: React.FC<HRFeedbackViewProps> = ({
  onOpenFeedback,
  departments,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState("ALL");
  const [risk, setRisk] = useState("ALL");
  const [departmentId, setDepartmentId] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    loadFeedbacks();
  }, [sentiment, risk, departmentId, category, status]);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await api.getAllFeedback({
        sentiment,
        risk,
        departmentId,
        category,
        status,
        search,
      });
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFeedbacks();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this feedback record?")) return;
    try {
      await api.deleteFeedback(id);
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert("Failed to delete feedback");
    }
  };

  const categories = [
    "Work Environment",
    "Management",
    "Workload",
    "Salary & Benefits",
    "Career Growth",
    "Team Collaboration",
    "Workplace Facilities",
    "Work-Life Balance",
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Employee Feedback Registry
          </h2>
          <p className="text-xs text-slate-500">
            Search, filter, inspect AI sentiment breakdown, and manage workplace resolution statuses
          </p>
        </div>
        <button
          onClick={loadFeedbacks}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Registry
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, employee name, issues, or AI summary..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 transition-all text-xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-2xs"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {/* Sentiment Filter */}
          <div>
            <label className="font-semibold text-slate-500 block mb-1">Sentiment</label>
            <select
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-xs"
            >
              <option value="ALL">All Sentiments</option>
              <option value="POSITIVE">Positive</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NEGATIVE">Negative</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="font-semibold text-slate-500 block mb-1">Risk Level</label>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-xs"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="CRITICAL">Critical Risk</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="font-semibold text-slate-500 block mb-1">Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-xs"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="font-semibold text-slate-500 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-xs"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="font-semibold text-slate-500 block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ANALYZED">ANALYZED</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="ACTION_TAKEN">ACTION TAKEN</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Feedback Title & Content</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Sentiment</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">AI Risk</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    Loading feedback entries...
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No feedback matching current filter criteria.
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr
                    key={fb.id}
                    onClick={() => onOpenFeedback(fb)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {fb.isAnonymous ? "Anonymous" : fb.employee?.name || "Employee"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {fb.department?.name || fb.departmentName || "General"}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-800 truncate">{fb.title}</p>
                      <p className="text-slate-500 truncate text-[11px]">{fb.description}</p>
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
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RiskBadge risk={fb.employeeRiskLevel} />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-700 whitespace-nowrap">
                      {fb.status.replace("_", " ")}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenFeedback(fb)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(fb.id, e)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                          title="Delete Feedback"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
