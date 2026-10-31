import React, { createContext, useContext, useEffect, useState } from "react";
import { Role, User } from "../types";
import { api, clearStoredToken, getStoredToken } from "../services/api";

export interface DemoUserOption {
  email: string;
  name: string;
  role: Role;
  designation: string;
  avatarUrl?: string;
  badge?: string;
}

export const DEMO_USERS: DemoUserOption[] = [
  {
    email: "admin@company.com",
    name: "Sarah Jenkins",
    role: "HR_ADMIN",
    designation: "VP of People Operations",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    badge: "HR Admin",
  },
  {
    email: "sobhiyalogu2005@gmail.com",
    name: "Sobhiya Logu",
    role: "EMPLOYEE",
    designation: "Staff Cloud Engineer",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    badge: "Your Account",
  },
  {
    email: "alex.morgan@company.com",
    name: "Alex Morgan",
    role: "EMPLOYEE",
    designation: "Senior Backend Engineer",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    badge: "High Risk Burnout",
  },
  {
    email: "priya.sharma@company.com",
    name: "Priya Sharma",
    role: "EMPLOYEE",
    designation: "Senior Product Designer",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    badge: "Engineering",
  },
  {
    email: "david.chen@company.com",
    name: "David Chen",
    role: "EMPLOYEE",
    designation: "Staff DevOps Architect",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    badge: "DevOps",
  },
  {
    email: "marcus.vance@company.com",
    name: "Marcus Vance",
    role: "EMPLOYEE",
    designation: "Enterprise Account Executive",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    badge: "Sales",
  },
];

interface AuthContextType {
  user: User | null;
  role: Role | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchQuickDemoUser: (role: Role) => Promise<void>;
  switchUserByEmail: (email: string, password?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  showAccountSwitcher: boolean;
  setShowAccountSwitcher: (show: boolean) => void;
  demoUsers: DemoUserOption[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState<boolean>(false);

  const fetchCurrentUser = async () => {
    try {
      if (!getStoredToken()) {
        // Auto-login as HR Admin for seamless immediate inspection if no token
        await switchQuickDemoUser("HR_ADMIN");
        return;
      }
      const me = await api.getMe();
      setUser(me);
    } catch (err) {
      console.warn("Session check failed, falling back to demo admin:", err);
      await switchQuickDemoUser("HR_ADMIN");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.login(email.trim(), pass);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.register(data);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    clearStoredToken();
    setUser(null);
    setToken(null);
  };

  const switchQuickDemoUser = async (targetRole: Role) => {
    setLoading(true);
    try {
      if (targetRole === "HR_ADMIN") {
        const res = await api.login("admin@company.com", "Admin@123");
        setUser(res.user);
        setToken(res.token);
      } else {
        const res = await api.login("alex.morgan@company.com", "Employee@123");
        setUser(res.user);
        setToken(res.token);
      }
    } catch (e) {
      console.error("Demo switch failed", e);
    } finally {
      setLoading(false);
    }
  };

  const switchUserByEmail = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const lower = email.trim().toLowerCase();
      // Auto-detect password for known seeded accounts or fallback
      const pwd = password || (lower.includes("admin") ? "Admin@123" : "Employee@123");
      const res = await api.login(lower, pwd);
      setUser(res.user);
      setToken(res.token);
      setShowAccountSwitcher(false);
    } catch (err: any) {
      console.error("Login with email failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        loading,
        login,
        register,
        logout,
        switchQuickDemoUser,
        switchUserByEmail,
        refreshUser,
        showAccountSwitcher,
        setShowAccountSwitcher,
        demoUsers: DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
