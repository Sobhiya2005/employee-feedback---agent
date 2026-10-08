import React from "react";
import { RiskLevel, Sentiment, Severity } from "../types";
import { AlertCircle, AlertTriangle, CheckCircle2, MinusCircle, ShieldAlert, Sparkles } from "lucide-react";

export const SentimentBadge: React.FC<{ sentiment?: Sentiment; size?: "sm" | "md" }> = ({
  sentiment = "NEUTRAL",
  size = "md",
}) => {
  const pad = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-semibold";
  switch (sentiment) {
    case "POSITIVE":
      return (
        <span
          id="badge-sentiment-positive"
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${pad}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Positive</span>
        </span>
      );
    case "NEGATIVE":
      return (
        <span
          id="badge-sentiment-negative"
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${pad}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Negative</span>
        </span>
      );
    case "NEUTRAL":
    default:
      return (
        <span
          id="badge-sentiment-neutral"
          className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${pad}`}
        >
          <MinusCircle className="w-3.5 h-3.5 text-slate-500" />
          <span>Neutral</span>
        </span>
      );
  }
};

export const SeverityBadge: React.FC<{ severity?: Severity }> = ({ severity = "LOW" }) => {
  switch (severity) {
    case "CRITICAL":
      return (
        <span
          id="badge-severity-critical"
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300"
        >
          <ShieldAlert className="w-3 h-3 text-red-600" />
          Critical
        </span>
      );
    case "HIGH":
      return (
        <span
          id="badge-severity-high"
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300"
        >
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          High
        </span>
      );
    case "MEDIUM":
      return (
        <span
          id="badge-severity-medium"
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
        >
          Medium
        </span>
      );
    case "LOW":
    default:
      return (
        <span
          id="badge-severity-low"
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"
        >
          Low
        </span>
      );
  }
};

export const RiskBadge: React.FC<{ risk?: RiskLevel; burnout?: boolean }> = ({
  risk = "LOW",
  burnout,
}) => {
  switch (risk) {
    case "CRITICAL":
      return (
        <span
          id="badge-risk-critical"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300"
        >
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          CRITICAL {burnout ? "• Burnout" : ""}
        </span>
      );
    case "HIGH":
      return (
        <span
          id="badge-risk-high"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300"
        >
          <span className="w-2 h-2 rounded-full bg-amber-600" />
          HIGH {burnout ? "• Risk" : ""}
        </span>
      );
    case "MEDIUM":
      return (
        <span
          id="badge-risk-medium"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-800 border border-yellow-200"
        >
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          MEDIUM
        </span>
      );
    case "LOW":
    default:
      return (
        <span
          id="badge-risk-low"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          LOW
        </span>
      );
  }
};

export const GeminiAIPill: React.FC = () => (
  <span
    id="badge-gemini-ai"
    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 rounded-md"
  >
    <Sparkles className="w-3 h-3 text-indigo-600" />
    Gemini 3.8 Flash
  </span>
);
