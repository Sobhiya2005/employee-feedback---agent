import React, { useState } from "react";
import { useAuth, DEMO_USERS } from "../context/AuthContext";
import {
  Check,
  ChevronRight,
  KeyRound,
  LogIn,
  Mail,
  ShieldCheck,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Department } from "../types";

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments?: Department[];
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  isOpen,
  onClose,
  departments = [],
}) => {
  const { user, switchUserByEmail, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<"quick" | "custom_login" | "register">("quick");

  // Custom login state
  const [customEmail, setCustomEmail] = useState("");
  const [customPassword, setCustomPassword] = useState("Employee@123");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Register state
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("Employee@123");
  const [regDeptId, setRegDeptId] = useState(departments[0]?.id || "dept-1");
  const [regDesignation, setRegDesignation] = useState("Software Engineer");
  const [regError, setRegError] = useState("");

  if (!isOpen) return null;

  const handleQuickSwitch = async (email: string) => {
    setLoading(true);
    setLoginError("");
    try {
      await switchUserByEmail(email);
      onClose();
    } catch (err: any) {
      setLoginError(err.message || "Failed to switch user");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) {
      setLoginError("Email address is required");
      return;
    }
    setLoading(true);
    setLoginError("");
    try {
      await login(customEmail.trim(), customPassword);
      onClose();
    } catch (err: any) {
      setLoginError(err.message || "Login failed. Check email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim()) {
      setRegError("Full Name and Email are required");
      return;
    }
    setLoading(true);
    setRegError("");
    try {
      await register({
        fullName: regFullName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        departmentId: regDeptId,
        designation: regDesignation,
      });
      onClose();
    } catch (err: any) {
      setRegError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="account-switcher-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="account-switcher-modal"
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Switch / Test With Different Mail IDs</h3>
              <p className="text-xs text-slate-500">
                Instantly switch accounts or test newly registered email addresses
              </p>
            </div>
          </div>
          <button
            id="close-account-switcher"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 p-1.5 gap-1 text-xs font-semibold">
          <button
            id="tab-quick-accounts"
            onClick={() => setActiveTab("quick")}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "quick"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Pre-seeded Accounts ({DEMO_USERS.length})
          </button>
          <button
            id="tab-custom-login"
            onClick={() => setActiveTab("custom_login")}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "custom_login"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Test Any Mail ID
          </button>
          <button
            id="tab-register-new"
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "register"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Register New Mail
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* TAB 1: PRE-SEEDED DEMO ACCOUNTS */}
          {activeTab === "quick" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                Click any persona below to authenticate instantly with all pre-loaded feedback history, risk scores, and department permissions:
              </p>

              {loginError && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl mb-3">
                  {loginError}
                </div>
              )}

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {DEMO_USERS.map((demo) => {
                  const isCurrent = user?.email.toLowerCase() === demo.email.toLowerCase();
                  return (
                    <button
                      key={demo.email}
                      id={`demo-user-${demo.email.replace(/[@.]/g, "-")}`}
                      onClick={() => handleQuickSwitch(demo.email)}
                      disabled={loading}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                        isCurrent
                          ? "bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20"
                          : "bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/80"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={demo.avatarUrl}
                          alt={demo.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {demo.name}
                            </span>
                            {demo.badge && (
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                  demo.role === "HR_ADMIN"
                                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                                    : demo.badge === "Your Account"
                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold"
                                    : demo.badge === "High Risk Burnout"
                                    ? "bg-rose-100 text-rose-700 border border-rose-200"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {demo.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-indigo-600 font-medium truncate">
                            {demo.email}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {demo.designation} • {demo.role === "HR_ADMIN" ? "HR Admin Portal" : "Employee Portal"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {isCurrent ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                            <Check className="w-3.5 h-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 group-hover:text-indigo-600 flex items-center gap-0.5 font-medium">
                            Switch <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TEST CUSTOM EMAIL LOGIN */}
          {activeTab === "custom_login" && (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
                <span className="font-bold">Test Any Registered Email:</span> Enter any user email (e.g.{" "}
                <code>sobhiyalogu2005@gmail.com</code> or any employee you added) to authenticate.
              </div>

              {loginError && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="input-custom-email"
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="e.g. sobhiyalogu2005@gmail.com"
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
                    id="input-custom-password"
                    type="password"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Enter password (default: Employee@123)"
                    required
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Standard seeded password is <code>Employee@123</code> (or <code>Admin@123</code> for admin).
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-custom-login"
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  {loading ? "Authenticating..." : "Login With This Email"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: REGISTER NEW EMPLOYEE EMAIL */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                <span className="font-bold">Register Any Custom Email:</span> Creates a real employee profile, initializes baseline risk metrics, and logs in immediately.
              </div>

              {regError && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                  {regError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="input-reg-name"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="input-reg-email"
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
                    id="input-reg-dept"
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
                    id="input-reg-designation"
                    type="text"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Set Password
                </label>
                <input
                  id="input-reg-password"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-register"
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {loading ? "Registering..." : "Create Account & Sign In"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
