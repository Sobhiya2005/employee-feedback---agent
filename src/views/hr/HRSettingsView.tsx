import React, { useState } from "react";
import { CheckCircle2, Database, Key, Lock, Shield, Sparkles } from "lucide-react";
import { GeminiAIPill } from "../../components/Badges";

export const HRSettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [geminiModel, setGeminiModel] = useState("gemini-3.8-flash");
  const [autoEscalateCritical, setAutoEscalateCritical] = useState(true);
  const [anonymousAllowed, setAnonymousAllowed] = useState(true);
  const [burnoutThreshold, setBurnoutThreshold] = useState("70");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">System & AI Configuration</h2>
        <p className="text-xs text-slate-500">
          Configure Google Gemini AI models, automated escalation thresholds, and database policies
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings updated and persisted successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Gemini Model Config */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                AI Engine Parameters
              </h3>
            </div>
            <GeminiAIPill />
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Gemini Model Architecture
              </label>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended, Fast Reasoning)</option>
                <option value="gemini-3.8-pro">gemini-3.8-pro (Deep Complex Analysis)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Utilizes Google GenAI TypeScript SDK with structured schema validation.
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Burnout Risk Calculation Threshold (0 - 100)
              </label>
              <input
                type="number"
                value={burnoutThreshold}
                onChange={(e) => setBurnoutThreshold(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Employees scoring above this threshold trigger automatic HR alert notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Governance & Privacy */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Governance & Whistleblower Privacy
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymousAllowed}
                onChange={(e) => setAnonymousAllowed(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-semibold text-slate-800 block">
                  Permit Anonymous Feedback Submissions
                </span>
                <span className="text-[11px] text-slate-400">
                  Allows employees to mask identifying headers while preserving department routing.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoEscalateCritical}
                onChange={(e) => setAutoEscalateCritical(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-semibold text-slate-800 block">
                  Auto-Escalate Critical Severity Feedback
                </span>
                <span className="text-[11px] text-slate-400">
                  Immediately pushes notification cards to all active HR Admin dashboards.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Database Engine */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Database Persistence Layer
            </h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Data model: MySQL with JPA/Hibernate schema conventions. Seeded with real employee records, feedback items, departments, and dynamic risk calculators.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
            <span className="font-medium text-slate-700">Connection Status:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized & Active
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-xs"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
};
