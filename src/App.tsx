/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { api } from "./services/api";
import { Department, Feedback, Notification } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AuthView } from "./views/AuthView";

export type ViewMode = string;

// HR Views
import { HRDashboardView } from "./views/hr/HRDashboardView";
import { HRFeedbackView } from "./views/hr/HRFeedbackView";
import { HRAnalyticsView } from "./views/hr/HRAnalyticsView";
import { HREmployeesView } from "./views/hr/HREmployeesView";
import { HRRiskView } from "./views/hr/HRRiskView";
import { HRSemanticSearchView } from "./views/hr/HRSemanticSearchView";
import { HRAssistantView } from "./views/hr/HRAssistantView";
import { HRDepartmentsView } from "./views/hr/HRDepartmentsView";
import { HRReportsView } from "./views/hr/HRReportsView";
import { HRGoalsView } from "./views/hr/HRGoalsView";
import { HRSettingsView } from "./views/hr/HRSettingsView";

// Employee Views
import { EmployeeDashboardView } from "./views/employee/EmployeeDashboardView";
import { SubmitFeedbackView } from "./views/employee/SubmitFeedbackView";
import { FeedbackHistoryView } from "./views/employee/FeedbackHistoryView";
import { EmployeeProfileView } from "./views/employee/EmployeeProfileView";
import { EmployeeGoalsView } from "./views/employee/EmployeeGoalsView";
import { EmployeePerformanceView } from "./views/employee/EmployeePerformanceView";
import { EmployeeSettingsView } from "./views/employee/EmployeeSettingsView";

// Modals
import { FeedbackDetailModal } from "./components/FeedbackDetailModal";
import { NotificationDrawer } from "./components/NotificationDrawer";
import { AccountSwitcherModal } from "./components/AccountSwitcherModal";
import { EmployeeProfileModal } from "./components/EmployeeProfileModal";

const AppMain: React.FC = () => {
  const { user, role, loading, showAccountSwitcher, setShowAccountSwitcher } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>("hr_dashboard");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Sync initial view when role changes
  useEffect(() => {
    if (role === "HR_ADMIN") {
      if (!currentView.startsWith("hr_")) {
        setCurrentView("hr_dashboard");
      }
    } else if (role === "EMPLOYEE") {
      if (!currentView.startsWith("emp_")) {
        setCurrentView("emp_dashboard");
      }
    }
  }, [role]);

  // Load shared metadata (departments, notifications)
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      const [deptData, notifData] = await Promise.all([
        api.getDepartments(),
        api.getNotifications(),
      ]);
      setDepartments(deptData);
      setNotifications(notifData);
    } catch (e) {
      console.error("Failed to load initial workspace data:", e);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateFeedbackStatus = async (
    id: string,
    status: string,
    actionNotes: string
  ) => {
    try {
      const updated = await api.updateFeedback(id, { status, actionNotes });
      setSelectedFeedback(updated);
      // Refresh notifications
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGlobalSearch = (query: string) => {
    if (role === "HR_ADMIN") {
      setCurrentView("hr_semantic_search");
    } else {
      setCurrentView("emp_history");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-sm font-bold text-slate-200">Initializing FeedPulse AI Workspace...</h2>
        <p className="text-xs text-slate-400 mt-1">Connecting to MySQL database & Google Gemini AI</p>
      </div>
    );
  }

  // Not authenticated: render Login / Register / One-click Switch view
  if (!user) {
    return <AuthView departments={departments} />;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex h-screen bg-slate-100/70 overflow-hidden font-sans text-slate-900">
      {/* Structural Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as ViewMode)}
        unreadCount={unreadCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentView={currentView}
          unreadCount={unreadCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onGlobalSearch={handleGlobalSearch}
        />

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* HR ADMIN VIEWS */}
          {role === "HR_ADMIN" && (
            <>
              {currentView === "hr_dashboard" && (
                <HRDashboardView
                  onOpenFeedback={(fb) => setSelectedFeedback(fb)}
                  onNavigate={(view) => setCurrentView(view as ViewMode)}
                />
              )}
              {currentView === "hr_feedback" && (
                <HRFeedbackView
                  departments={departments}
                  onOpenFeedback={(fb) => setSelectedFeedback(fb)}
                />
              )}
              {currentView === "hr_analytics" && (
                <HRAnalyticsView departments={departments} />
              )}
              {currentView === "hr_employees" && (
                <HREmployeesView
                  departments={departments}
                  onViewEmployeeProfile={(id) => setSelectedEmployeeId(id)}
                />
              )}
              {currentView === "hr_risk" && (
                <HRRiskView
                  onViewEmployee={(id) => setSelectedEmployeeId(id)}
                />
              )}
              {currentView === "hr_semantic_search" && (
                <HRSemanticSearchView
                  onOpenFeedback={(fb) => setSelectedFeedback(fb)}
                />
              )}
              {currentView === "hr_assistant" && <HRAssistantView />}
              {currentView === "hr_departments" && <HRDepartmentsView />}
              {currentView === "hr_reports" && (
                <HRReportsView departments={departments} />
              )}
              {currentView === "hr_goals" && <HRGoalsView />}
              {currentView === "hr_settings" && <HRSettingsView />}
            </>
          )}

          {/* EMPLOYEE VIEWS */}
          {role === "EMPLOYEE" && (
            <>
              {currentView === "emp_dashboard" && (
                <EmployeeDashboardView
                  onNavigate={(view) => setCurrentView(view as ViewMode)}
                  onOpenFeedback={(fb) => setSelectedFeedback(fb)}
                />
              )}
              {currentView === "emp_submit_feedback" && (
                <SubmitFeedbackView
                  departments={departments}
                  onNavigateHistory={() => setCurrentView("emp_history")}
                />
              )}
              {currentView === "emp_history" && (
                <FeedbackHistoryView
                  onOpenFeedback={(fb) => setSelectedFeedback(fb)}
                />
              )}
              {currentView === "emp_profile" && <EmployeeProfileView />}
              {currentView === "emp_goals" && <EmployeeGoalsView />}
              {currentView === "emp_performance" && <EmployeePerformanceView />}
              {currentView === "emp_settings" && <EmployeeSettingsView />}
            </>
          )}
        </main>
      </div>

      {/* MODALS */}

      {/* Account Switcher / Test With Different Mail ID Modal */}
      <AccountSwitcherModal
        isOpen={showAccountSwitcher}
        onClose={() => setShowAccountSwitcher(false)}
        departments={departments}
      />

      {/* Feedback Detail & AI Analysis Modal */}
      <FeedbackDetailModal
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        onUpdateStatus={handleUpdateFeedbackStatus}
        isHR={role === "HR_ADMIN"}
      />

      {/* Employee Dossier & 360 Profile Modal */}
      <EmployeeProfileModal
        employeeId={selectedEmployeeId}
        onClose={() => setSelectedEmployeeId(null)}
        onOpenFeedback={(fb) => {
          setSelectedEmployeeId(null);
          setSelectedFeedback(fb);
        }}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppMain />
    </AuthProvider>
  );
}
