import React, { useState } from "react";
import { Department, FeedbackAnalysis } from "../../types";
import { api } from "../../services/api";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Loader2,
  Lock,
  MessageSquarePlus,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SentimentBadge, SeverityBadge, GeminiAIPill } from "../../components/Badges";

interface SubmitFeedbackViewProps {
  departments: Department[];
  onNavigateHistory: () => void;
}

export const SubmitFeedbackView: React.FC<SubmitFeedbackViewProps> = ({
  departments,
  onNavigateHistory,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Workload");
  const [departmentId, setDepartmentId] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submittedAnalysis, setSubmittedAnalysis] = useState<FeedbackAnalysis | null>(null);
  const [submittedFeedback, setSubmittedFeedback] = useState<any | null>(null);
  const [error, setError] = useState("");

  const categories = [
    "Work Environment",
    "Management",
    "Workload",
    "Salary & Benefits",
    "Career Growth",
    "Team Collaboration",
    "Communication",
    "Workplace Facilities",
    "Technology",
    "Work-Life Balance",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please provide both a title and description for your feedback.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSubmittedAnalysis(null);

    try {
      const res = await api.submitFeedback({
        title: title.trim(),
        description: description.trim(),
        category,
        departmentId: departmentId || undefined,
        isAnonymous,
      });

      setSubmittedFeedback(res.feedback);
      setSubmittedAnalysis(res.analysis);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err.message || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedAnalysis(null);
    setSubmittedFeedback(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Submit Employee Feedback</span>
          <GeminiAIPill />
        </h2>
        <p className="text-xs text-slate-500">
          Share your workplace observations, team roadblocks, or praise. Google Gemini AI immediately synthesizes your message to alert HR leadership.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Main Grid: Form on Left, Real-Time AI Result on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Feedback Title *
              </label>
              <input
                id="input-feedback-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Weekend on-call alerts causing significant fatigue"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium transition-all"
              />
            </div>

            {/* Category & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Category *</label>
                <select
                  id="select-feedback-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium transition-all"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  Target Department (Optional)
                </label>
                <select
                  id="select-feedback-department"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-medium transition-all"
                >
                  <option value="">Default (My Department)</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">
                Detailed Feedback Description *
              </label>
              <textarea
                id="textarea-feedback-desc"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe specific scenarios, impacts on your work, and how leadership can assist..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-normal leading-relaxed transition-all"
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <label
                    htmlFor="checkbox-anonymous"
                    className="font-bold text-slate-800 cursor-pointer block"
                  >
                    Submit feedback anonymously
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Your name and employee profile will be hidden from the feedback card.
                  </p>
                </div>
              </div>
              <input
                id="checkbox-anonymous"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="btn-submit-feedback"
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing with Google Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit & Run Gemini AI Analysis</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Real-time AI Analysis Result Card on Right */}
        <div className="lg:col-span-5 flex flex-col">
          {submittedAnalysis ? (
            <div className="bg-gradient-to-br from-indigo-50/60 via-purple-50/30 to-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      AI Analysis Completed
                    </h3>
                    <p className="text-[11px] text-slate-500">Recorded in MySQL Database</p>
                  </div>
                </div>
                <GeminiAIPill />
              </div>

              {/* Status and Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Detected Sentiment
                  </span>
                  <div className="mt-1">
                    <SentimentBadge sentiment={submittedAnalysis.sentiment} />
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Severity Flag
                  </span>
                  <div className="mt-1">
                    <SeverityBadge severity={submittedAnalysis.severity} />
                  </div>
                </div>
              </div>

              {/* Detected Issues */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Detected Issues:
                </span>
                <div className="flex flex-wrap gap-1">
                  {submittedAnalysis.issues.map((issue, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white rounded-md text-[11px] font-semibold text-slate-700 border border-slate-200"
                    >
                      • {issue}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  AI Executive Summary:
                </span>
                <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed font-normal">
                  "{submittedAnalysis.summary}"
                </p>
              </div>

              {/* Recommendations */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Action Recommended to HR:
                </span>
                <div className="space-y-1">
                  {submittedAnalysis.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-white rounded-lg border border-emerald-100 text-[11px] text-slate-700 flex items-start gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Submit Another
                </button>
                <button
                  onClick={onNavigateHistory}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                >
                  View in History →
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] bg-slate-50/80 rounded-2xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h4 className="text-xs font-bold text-slate-800">
                  Instant Automated Gemini Analysis
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Upon clicking submit, Google Gemini AI analyzes sentiment, flags severity, extracts root-cause issues, and delivers executive recommendations directly to HR.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
