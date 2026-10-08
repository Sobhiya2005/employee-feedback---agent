import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Goal } from "../../types";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

export const EmployeeGoalsView: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);

  // New goal form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("2026-12-31");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const data = await api.getMyGoals();
      setGoals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      const newGoal = await api.addGoal({ title, description, targetDate });
      setGoals([newGoal, ...goals]);
      setTitle("");
      setDescription("");
      setShowAddGoal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProgress = async (id: string, newProgress: number) => {
    try {
      const updated = await api.updateGoal(id, {
        progress: newProgress,
        status: newProgress >= 100 ? "COMPLETED" : "IN_PROGRESS",
      });
      setGoals(goals.map((g) => (g.id === id ? updated : g)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            My Performance Goals & OKRs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your professional milestones, sprint objectives, and personal development targets.
          </p>
        </div>
        <button
          id="btn-open-add-goal"
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Goal
        </button>
      </div>

      {/* Add Goal Form Drawer/Modal */}
      {showAddGoal && (
        <form
          onSubmit={handleCreateGoal}
          className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-lg space-y-4 animate-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Create New Individual Milestone
            </h3>
            <button
              type="button"
              onClick={() => setShowAddGoal(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Goal Title *
              </label>
              <input
                id="input-goal-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Kubernetes Operators and Cluster Mesh"
                required
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Completion Date
              </label>
              <input
                id="input-goal-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Success Metric *
            </label>
            <textarea
              id="input-goal-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline specific measurable deliverables..."
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddGoal(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              id="btn-submit-goal"
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Create Goal"}
            </button>
          </div>
        </form>
      )}

      {/* Goals List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No active goals yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Set your first quarterly goal or align deliverables with your team.
          </p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100"
          >
            Create First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const isDone = goal.status === "COMPLETED" || goal.progress >= 100;
            return (
              <div
                key={goal.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isDone
                    ? "bg-emerald-50/30 border-emerald-200"
                    : "bg-white border-slate-200 hover:border-indigo-200 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isDone
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                      }`}
                    >
                      {isDone ? "COMPLETED" : "IN PROGRESS"}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{goal.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">{goal.progress}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4">{goal.description}</p>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isDone ? "bg-emerald-500" : "bg-indigo-600"
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    Target: {goal.targetDate}
                  </div>
                  <div className="flex items-center gap-1">
                    {[25, 50, 75, 100].map((step) => (
                      <button
                        key={step}
                        onClick={() => handleUpdateProgress(goal.id, step)}
                        className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                          goal.progress === step
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {step}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
