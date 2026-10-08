import {
  AnalyticsSummary,
  Department,
  Employee,
  Feedback,
  Goal,
  Notification,
  OrganizationalInsight,
  User,
} from "../types";

const TOKEN_KEY = "employee_feedback_jwt_token";

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage = (typeof data === "object" && data?.error) || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await request<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async register(data: {
    fullName: string;
    email: string;
    password: string;
    departmentId?: string;
    employeeId?: string;
    designation?: string;
    joiningDate?: string;
  }): Promise<{ token: string; user: User }> {
    const res = await request<{ token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setStoredToken(res.token);
    return res;
  },

  async getMe(): Promise<User> {
    return request<User>("/api/auth/me");
  },

  logout() {
    clearStoredToken();
  },

  // Feedback
  async submitFeedback(data: {
    title: string;
    description: string;
    category: string;
    departmentId?: string;
    isAnonymous?: boolean;
  }): Promise<{ message: string; feedback: Feedback; analysis: any }> {
    return request<{ message: string; feedback: Feedback; analysis: any }>("/api/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMyFeedback(): Promise<Feedback[]> {
    return request<Feedback[]>("/api/feedback/my");
  },

  async getAllFeedback(params: {
    sentiment?: string;
    risk?: string;
    departmentId?: string;
    category?: string;
    status?: string;
    search?: string;
  } = {}): Promise<Feedback[]> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.set(k, v);
    });
    return request<Feedback[]>(`/api/feedback?${query.toString()}`);
  },

  async getFeedbackById(id: string): Promise<Feedback> {
    return request<Feedback>(`/api/feedback/${id}`);
  },

  async updateFeedback(id: string, data: { status?: string; actionNotes?: string }): Promise<any> {
    return request(`/api/feedback/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteFeedback(id: string): Promise<any> {
    return request(`/api/feedback/${id}`, {
      method: "DELETE",
    });
  },

  // Analytics
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return request<AnalyticsSummary>("/api/analytics/summary");
  },

  async getSentimentAnalytics(): Promise<{ distribution: any[]; monthlyTrend: any[] }> {
    return request("/api/analytics/sentiment");
  },

  async getDepartmentAnalytics(): Promise<any[]> {
    return request("/api/analytics/departments");
  },

  async getCategoryAnalytics(): Promise<any[]> {
    return request("/api/analytics/categories");
  },

  async getRiskAnalytics(): Promise<{ distribution: any[]; highRiskEmployees: any[] }> {
    return request("/api/analytics/risk");
  },

  async getOrganizationalInsights(): Promise<{ topIssues: OrganizationalInsight[] }> {
    return request("/api/analytics/insights");
  },

  // Employees
  async getEmployees(params: { search?: string; departmentId?: string; riskLevel?: string } = {}): Promise<Employee[]> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.set(k, v);
    });
    return request<Employee[]>(`/api/employees?${query.toString()}`);
  },

  async getEmployeeById(id: string): Promise<any> {
    return request(`/api/employees/${id}`);
  },

  async addEmployee(data: Partial<Employee>): Promise<any> {
    return request("/api/employees", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateEmployee(id: string, data: Partial<Employee>): Promise<any> {
    return request(`/api/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Departments
  async getDepartments(): Promise<Department[]> {
    return request<Department[]>("/api/departments");
  },

  async addDepartment(data: Partial<Department>): Promise<any> {
    return request("/api/departments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateDepartment(id: string, data: Partial<Department>): Promise<any> {
    return request(`/api/departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // AI Assistant & Semantic Search
  async askAIAssistant(question: string): Promise<{ answer: string }> {
    return request<{ answer: string }>("/api/ai/assistant", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
  },

  async semanticSearch(query: string): Promise<Feedback[]> {
    return request<Feedback[]>("/api/ai/semantic-search", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  },

  // Reports
  async getReportData(type: string): Promise<any> {
    return request(`/api/reports/data?type=${type}`);
  },

  exportCsvUrl(): string {
    return "/api/reports/export-csv";
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return request<Notification[]>("/api/notifications");
  },

  async markNotificationRead(id: string): Promise<any> {
    return request(`/api/notifications/${id}/read`, { method: "PUT" });
  },

  async markAllNotificationsRead(): Promise<any> {
    return request("/api/notifications/read-all", { method: "PUT" });
  },

  // Goals
  async getMyGoals(): Promise<Goal[]> {
    return request<Goal[]>("/api/goals/my");
  },

  async addGoal(data: { title: string; description: string; targetDate?: string }): Promise<Goal> {
    return request<Goal>("/api/goals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateGoal(id: string, data: { status?: string; progress?: number }): Promise<Goal> {
    return request<Goal>(`/api/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
