import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Bell,
  CheckCircle2,
  KeyRound,
  Lock,
  Save,
  Shield,
  Sliders,
  User,
} from "lucide-react";

export const EmployeeSettingsView: React.FC = () => {
  const { user } = useAuth();
  const [notifyOnResolution, setNotifyOnResolution] = useState(true);
  const [notifyOnHRResponse, setNotifyOnHRResponse] = useState(true);
  const [defaultAnonymous, setDefaultAnonymous] = useState(false);
  const [saved, setSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setPasswordMsg("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setPasswordMsg(""), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600" />
          Employee Workspace Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your notification thresholds, privacy safeguards, and security credentials.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Workspace preferences saved successfully!
        </div>
      )}

      {/* Form 1: Notification & Feedback Defaults */}
      <form onSubmit={handleSavePreferences} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            Notification Safeguards
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure how and when you receive updates on your submitted feedback.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/60">
            <div>
              <span className="font-bold text-slate-800 block">Status Progression Updates</span>
              <span className="text-slate-500 text-[11px]">
                Receive instant alerts when HR takes action or resolves your observation
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyOnResolution}
              onChange={(e) => setNotifyOnResolution(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/60">
            <div>
              <span className="font-bold text-slate-800 block">HR Action Notes Alerts</span>
              <span className="text-slate-500 text-[11px]">
                Notify me when HR attaches written notes or policy updates to my feedback
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyOnHRResponse}
              onChange={(e) => setNotifyOnHRResponse(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/60">
            <div>
              <span className="font-bold text-slate-800 block">Default to Anonymous Submission</span>
              <span className="text-slate-500 text-[11px]">
                Pre-check the "Submit Anonymously" toggle by default when opening feedback forms
              </span>
            </div>
            <input
              type="checkbox"
              checked={defaultAnonymous}
              onChange={(e) => setDefaultAnonymous(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save Preferences
          </button>
        </div>
      </form>

      {/* Form 2: Security & Password Change */}
      <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-700" />
            Security & Account Password
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Update your authentication credentials for <code>{user?.email}</code>
          </p>
        </div>

        {passwordMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
            {passwordMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New secure password"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};
