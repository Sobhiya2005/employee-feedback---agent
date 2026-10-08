import React, { useState } from "react";
import { Feedback } from "../types";
import { SentimentBadge, SeverityBadge, RiskBadge, GeminiAIPill } from "./Badges";
import {
  AlertTriangle,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Lightbulb,
  MessageSquare,
  Sparkles,
  User,
  X,
} from "lucide-react";

interface FeedbackDetailModalProps {
  feedback: Feedback | null;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: string, notes: string) => Promise<void>;
  isHR?: boolean;
}

export const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  feedback,
  onClose,
  onUpdateStatus,
  isHR = false,
}) => {
  if (!feedback) return null;

  const analysis = feedback.analysis;
  const [currentStatus, setCurrentStatus] = useState(feedback.status);
  const [actionNotes, setActionNotes] = useState(feedback.actionNotes || "");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    if (!onUpdateStatus) return;
    setSaving(true);
    try {
      await onUpdateStatus(feedback.id, currentStatus, actionNotes);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      id="feedback-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="feedback-detail-modal-card"
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Feedback & AI Analysis Record
              </h3>
              <p className="text-xs text-slate-500">ID: {feedback.id}</p>
            </div>
          </div>
          <button
            id="btn-close-feedback-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Meta strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Submitted By</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {feedback.isAnonymous ? "Anonymous" : feedback.employee?.name || "Employee"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Department</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {feedback.department?.name || feedback.departmentName || "General"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Date</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {feedback.createdAt.split("T")[0]}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Status</span>
              <span className="inline-block mt-0.5 font-bold text-indigo-700">
                {currentStatus.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Original Employee Feedback */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Original Employee Feedback
              </h4>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                {feedback.category}
              </span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm space-y-2">
              <h5 className="font-bold text-slate-800">{feedback.title}</h5>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {feedback.description}
              </p>
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="space-y-3 p-4 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Automated Gemini AI Analysis
                </h4>
              </div>
              <GeminiAIPill />
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block font-medium">Sentiment</span>
                <div className="mt-1">
                  <SentimentBadge sentiment={analysis?.sentiment} />
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block font-medium">AI Category</span>
                <span className="text-xs font-bold text-slate-800 block mt-1">
                  {analysis?.category || feedback.category}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                <span className="text-[11px] text-slate-400 block font-medium">Issue Severity</span>
                <div className="mt-1">
                  <SeverityBadge severity={analysis?.severity} />
                </div>
              </div>
            </div>

            {/* Detected Issues */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Detected Issues / Focus Points
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis?.issues && analysis.issues.length > 0 ? (
                  analysis.issues.map((issue, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white rounded-md text-xs font-medium text-slate-700 border border-slate-200/80 flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {issue}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No issues flagged.</span>
                )}
              </div>
            </div>

            {/* AI Summary */}
            <div className="space-y-1 pt-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Executive Summary
              </span>
              <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                "{analysis?.summary || "Analysis in progress..."}"
              </p>
            </div>

            {/* AI Recommendations */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Actionable HR Recommendations
              </span>
              <div className="space-y-1.5">
                {analysis?.recommendations?.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white rounded-lg border border-emerald-100 text-xs text-slate-700 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HR Management Action Controls */}
          {isHR && onUpdateStatus && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                HR Resolution & Follow-Up Action
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    Update Feedback Status
                  </label>
                  <select
                    id="select-feedback-status"
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value as any)}
                    className="w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  >
                    <option value="ANALYZED">ANALYZED</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="ACTION_TAKEN">ACTION TAKEN</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">
                    Internal HR Action Notes
                  </label>
                  <input
                    id="input-action-notes"
                    type="text"
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="e.g., Scheduled 1-on-1 with Engineering Lead"
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {saveSuccess ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Changes saved to MySQL!
                  </span>
                ) : <span />}
                <button
                  id="btn-save-feedback-status"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Status & Notes"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            id="btn-close-modal-footer"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/70 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
