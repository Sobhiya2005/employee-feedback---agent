import React, { useEffect, useState } from "react";
import { Employee, Feedback, Goal } from "../types";
import { api } from "../services/api";
import {
  AlertTriangle,
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FolderGit2,
  GraduationCap,
  Mail,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  X,
} from "lucide-react";
import { RiskBadge, SentimentBadge, SeverityBadge } from "./Badges";

interface EmployeeProfileModalProps {
  employeeId: string | null;
  onClose: () => void;
  onOpenFeedback?: (fb: Feedback) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  employeeId,
  onClose,
  onOpenFeedback,
}) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;
    loadEmployee();
  }, [employeeId]);

  const loadEmployee = async () => {
    setLoading(true);
    try {
      const res = await api.getEmployeeById(employeeId!);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!employeeId) return null;

  return (
    <div
      id="employee-profile-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="employee-profile-modal-card"
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Employee Dossier & Feedback History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
            </div>
          ) : !data ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Employee record not found.
            </div>
          ) : (
            <>
              {/* Primary Identity Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-4">
                  <img
                    src={data.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                    alt={data.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">{data.name}</h2>
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                        {data.employeeCode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {data.designation} • {data.department?.name || "Engineering"}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {data.email}
                      </span>
                      <span>•</span>
                      <span>Reporting to: {data.managerName || "Vikram Malhotra"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 gap-1">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">
                    Risk Assessment
                  </span>
                  <RiskBadge level={data.risk?.riskLevel || "LOW"} />
                  <span className="text-xs font-bold text-slate-700 mt-1">
                    Performance: {data.performanceScore || 85}/100
                  </span>
                </div>
              </div>

              {/* AI Risk & Wellness Analysis */}
              {data.risk && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      Gemini AI Risk Assessment
                    </h4>
                    <span className="text-xs font-bold text-slate-700">
                      Risk Score: {data.risk.riskScore}/100
                    </span>
                  </div>

                  {data.risk.burnoutRisk && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Burnout Warning:</span> AI analysis detected elevated fatigue and repetitive on-call friction patterns across multiple submissions.
                      </div>
                    </div>
                  )}

                  {data.risk.recommendations && data.risk.recommendations.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Recommended HR Interventions:
                      </span>
                      {data.risk.recommendations.map((rec: string, i: number) => (
                        <div
                          key={i}
                          className="text-xs text-slate-600 flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Submissions by this Employee */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    Feedback History ({data.feedbacks?.length || 0})
                  </h4>
                </div>

                {!data.feedbacks || data.feedbacks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                    No individual non-anonymous feedback submitted yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {data.feedbacks.map((fb: Feedback) => (
                      <div
                        key={fb.id}
                        className="p-3.5 bg-white border border-slate-200 hover:border-indigo-200 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {fb.analysis && <SentimentBadge sentiment={fb.analysis.sentiment} />}
                            {fb.analysis?.severity && <SeverityBadge severity={fb.analysis.severity} />}
                            <span className="text-[11px] font-semibold text-slate-500">
                              {fb.category}
                            </span>
                            <span className="text-[11px] text-slate-400">•</span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(fb.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-800 truncate">{fb.title}</h5>
                          <p className="text-xs text-slate-500 line-clamp-1">{fb.description}</p>
                        </div>

                        {onOpenFeedback && (
                          <button
                            onClick={() => onOpenFeedback(fb)}
                            className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 self-start sm:self-auto shrink-0"
                          >
                            View Analysis
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Goals & Deliverables */}
              {data.goals && data.goals.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-600" />
                    Active Objectives & Goals ({data.goals.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.goals.map((g: Goal) => (
                      <div
                        key={g.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 truncate">{g.title}</span>
                          <span className="font-bold text-indigo-600">{g.progress}%</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{g.description}</p>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600"
                            style={{ width: `${g.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-400">FeedPulse AI Enterprise Dossier</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
