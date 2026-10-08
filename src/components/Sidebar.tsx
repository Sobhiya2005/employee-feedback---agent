import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  BarChart3,
  Bot,
  Building2,
  FileSpreadsheet,
  History,
  Home,
  LogOut,
  MessageSquare,
  MessageSquarePlus,
  Search,
  Settings,
  ShieldCheck,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

export type ViewState =
  // HR Views
  | "hr_dashboard"
  | "hr_employees"
  | "hr_feedback"
  | "hr_analytics"
  | "hr_reports"
  | "hr_assistant"
  | "hr_semantic_search"
  | "hr_risk"
  | "hr_goals"
  | "hr_departments"
  | "hr_notifications"
  | "hr_settings"
  // Employee Views
  | "emp_dashboard"
  | "emp_submit_feedback"
  | "emp_feedback_history"
  | "emp_profile"
  | "emp_goals"
  | "emp_performance"
  | "emp_settings";

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  unreadCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  highlight?: boolean;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, unreadCount = 0 }) => {
  const { user, role, logout, switchQuickDemoUser, setShowAccountSwitcher } = useAuth();

  const isHR = role === "HR_ADMIN";

  const hrNavItems: NavItem[] = [
    { id: "hr_dashboard", label: "Dashboard", icon: Home },
    { id: "hr_employees", label: "Employees", icon: Users },
    { id: "hr_feedback", label: "Feedback", icon: MessageSquare },
    { id: "hr_risk", label: "Employee Risk", icon: ShieldCheck, badge: "AI Risk" },
    { id: "hr_analytics", label: "Analytics", icon: TrendingUp },
    { id: "hr_reports", label: "Reports", icon: FileSpreadsheet },
    { id: "hr_assistant", label: "AI Assistant", icon: Bot, highlight: true },
    { id: "hr_semantic_search", label: "Semantic Search", icon: Search },
    { id: "hr_departments", label: "Departments", icon: Building2 },
    { id: "hr_goals", label: "Goals", icon: Target },
    { id: "hr_settings", label: "Settings", icon: Settings },
  ];

  const empNavItems: NavItem[] = [
    { id: "emp_dashboard", label: "Dashboard", icon: Home },
    { id: "emp_submit_feedback", label: "Submit Feedback", icon: MessageSquarePlus, highlight: true },
    { id: "emp_history", label: "Feedback History", icon: History },
    { id: "emp_profile", label: "My Profile", icon: UserCheck },
    { id: "emp_goals", label: "My Goals", icon: Target },
    { id: "emp_performance", label: "My Performance", icon: BarChart3 },
    { id: "emp_settings", label: "Settings", icon: Settings },
  ];

  const items = isHR ? hrNavItems : empNavItems;

  return (
    <aside
      id="app-sidebar"
      className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-white tracking-tight truncate leading-tight">
              FeedPulse AI
            </h1>
            <p className="text-[11px] text-slate-400 font-medium truncate">
              {isHR ? "HR Admin Portal" : "Employee Workspace"}
            </p>
          </div>
        </div>

        {/* Quick Role Switcher Toggle */}
        <div className="mt-4 p-1.5 bg-slate-800/90 rounded-lg border border-slate-700/60 flex items-center gap-1 text-xs">
          <button
            id="role-switch-hr"
            onClick={() => switchQuickDemoUser("HR_ADMIN")}
            className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-all ${
              isHR
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            HR Admin
          </button>
          <button
            id="role-switch-employee"
            onClick={() => switchQuickDemoUser("EMPLOYEE")}
            className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-all ${
              !isHR
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Employee
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onNavigate(item.id as ViewState)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-indigo-600/90 text-white font-semibold shadow-sm shadow-indigo-900/30"
                  : item.highlight
                  ? "text-indigo-300 hover:bg-indigo-950/40 hover:text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : item.highlight ? "text-indigo-400" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Current User & Logout Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div
          onClick={() => setShowAccountSwitcher(true)}
          className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 mb-2 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all"
          title="Click to Switch Account or Test Different Email"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || "US"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user?.name || "User"}</p>
            <p className="text-[11px] text-indigo-400 font-mono truncate">{user?.email}</p>
          </div>
        </div>

        <button
          id="btn-sidebar-switch-email"
          onClick={() => setShowAccountSwitcher(true)}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-800/40 mb-1.5"
        >
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Switch / Test Mail ID</span>
        </button>

        <button
          id="btn-logout"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors border border-transparent hover:border-rose-900/40"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
};
