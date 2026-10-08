import React, { useState } from "react";
import { useAuth, DEMO_USERS } from "../context/AuthContext";
import {
  Bot,
  CheckCircle2,
  KeyRound,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Department } from "../types";

interface AuthViewProps {
  departments?: Department[];
}

export const AuthView: React.FC<AuthViewProps> = ({ departments = [] }) => {
  const { login, register, switchUserByEmail } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Register form
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("Employee@123");
  const [regDeptId, setRegDeptId] = useState(departments[0]?.id || "dept-1");
  const [regDesignation, setRegDesignation] = useState("Software Engineer");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim()) {
      setError("Full Name and Email are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register({
        fullName: regFullName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        departmentId: regDeptId,
        designation: regDesignation,
      });
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setLoading(true);
    setError("");
    try {
      await switchUserByEmail(demoEmail);
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/30 mb-4">
          <Bot className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          AI-Powered Employee Feedback System
        </h2>
        <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
          Automated sentiment analysis, risk prediction, and workplace intelligence powered by Google Gemini AI.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        {/* Quick Demo Selector */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 mb-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Instant Demo Access (Test With Different Mail IDs)
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40">
              One-Click Login
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.email}
                id={`btn-auth-demo-${demo.email.replace(/[@.]/g, "-")}`}
                onClick={() => handleQuickLogin(demo.email)}
                disabled={loading}
                className="text-left p-2.5 rounded-xl bg-slate-900/70 border border-slate-700 hover:border-indigo-500 hover:bg-slate-900 transition-all flex items-center gap-2.5 group"
              >
                <img
                  src={demo.avatarUrl}
                  alt={demo.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-600 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                      {demo.name}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        demo.role === "HR_ADMIN"
                          ? "bg-purple-900/60 text-purple-300"
                          : demo.badge === "Your Account"
                          ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {demo.badge || demo.role}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {demo.email}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Card for Custom Email Login / Registration */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
          <div className="flex border-b border-slate-100 pb-4 mb-5 gap-2">
            <button
              id="tab-auth-login"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === "login"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In With Email
            </button>
            <button
              id="tab-auth-register"
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === "register"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register New Mail ID
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="login-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email (e.g. sobhiyalogu2005@gmail.com)"
                    required
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="login-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Default passwords: <code>Employee@123</code> (Employees) or <code>Admin@123</code> (HR)
                </p>
              </div>

              <button
                id="btn-login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="register-name-input"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="register-email-input"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. sobhiyalogu2005@gmail.com"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    id="register-dept-select"
                    value={regDeptId}
                    onChange={(e) => setRegDeptId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  >
                    {departments.length > 0 ? (
                      departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="dept-1">Engineering (ENG)</option>
                        <option value="dept-2">HR & People Ops (HR)</option>
                        <option value="dept-3">Finance & Accounting (FIN)</option>
                        <option value="dept-4">Marketing & Growth (MKT)</option>
                        <option value="dept-5">Sales & Partnerships (SLS)</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation
                  </label>
                  <input
                    id="register-designation-input"
                    type="text"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    placeholder="e.g. Cloud Engineer"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  id="register-password-input"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <button
                id="btn-register-submit"
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? "Creating Account..." : "Register & Sign In"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
