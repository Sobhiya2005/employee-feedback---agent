import React from "react";
import { Notification } from "../types";
import { AlertCircle, AlertTriangle, Bell, Check, CheckCircle2, Info, X } from "lucide-react";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">System Notifications</h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
              {notifications.filter((n) => !n.isRead).length} unread
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => {
              const isCrit = n.type === "CRITICAL";
              const isWarn = n.type === "WARNING";
              return (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    n.isRead
                      ? "bg-white border-slate-100 text-slate-500 opacity-80"
                      : isCrit
                      ? "bg-rose-50/70 border-rose-200 text-rose-950"
                      : isWarn
                      ? "bg-amber-50/70 border-amber-200 text-amber-950"
                      : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      {isCrit ? (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className="text-xs font-bold leading-snug">{n.title}</h4>
                        <p className="text-xs mt-1 leading-relaxed opacity-90">{n.message}</p>
                        <span className="text-[10px] text-slate-400 block mt-2">
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => onMarkRead(n.id)}
                        className="p-1 hover:bg-white rounded text-slate-400 hover:text-indigo-600"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
