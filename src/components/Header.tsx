import React from "react";
import { useAuth } from "../context/AuthContext";
import { Bell, CheckCircle2, Search, Sparkles, User as UserIcon } from "lucide-react";

interface HeaderProps {
  onOpenNotifications: () => void;
  unreadCount?: number;
  onGlobalSearch?: (term: string) => void;
  searchPlaceholder?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  unreadCount = 0,
  onGlobalSearch,
  searchPlaceholder = "Search feedback, employees, or AI detected issues...",
}) => {
  const { user, role, setShowAccountSwitcher } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onGlobalSearch && searchTerm.trim()) {
      onGlobalSearch(searchTerm.trim());
    }
  };

  return (
    <header
      id="app-header"
      className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-20"
    >
      {/* Welcome Title */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>
              {role === "HR_ADMIN"
                ? `Welcome HR, ${user?.name || "Administrator"}`
                : `Welcome, ${user?.name || "Employee"}`}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Live MySQL Engine
            </span>
          </h2>
          <p className="text-xs text-slate-500 hidden md:block">
            {role === "HR_ADMIN"
              ? "Automated organizational feedback analysis powered by Google Gemini AI"
              : "Submit workplace observations and track real-time AI resolution insights"}
          </p>
        </div>
      </div>

      {/* Center Search (HR or general) */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-md hidden lg:flex items-center relative"
      >
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          id="global-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none transition-all placeholder:text-slate-400"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Gemini Active Badge */}
        <div
          id="gemini-status-indicator"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/80 rounded-lg text-xs font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span className="font-semibold">Gemini 3.8</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>

        {/* Switch / Test Email Button */}
        <button
          id="btn-header-switch-account"
          onClick={() => setShowAccountSwitcher(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-semibold transition-all shadow-2xs"
          title="Switch Account or Test Different Email"
        >
          <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Switch / Test Email</span>
        </button>

        {/* Notifications Bell */}
        <button
          id="btn-notifications-bell"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="View Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span
              id="notifications-unread-count"
              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Capsule */}
        <div
          id="header-user-badge"
          className="flex items-center gap-2 pl-2 border-l border-slate-200"
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600">
              <UserIcon className="w-4 h-4" />
            </div>
          )}
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-none">
              {user?.name?.split(" ")[0]}
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {role === "HR_ADMIN" ? "Admin" : "Employee"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
