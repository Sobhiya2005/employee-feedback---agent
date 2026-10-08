export type Role = 'EMPLOYEE' | 'HR_ADMIN';

export type Sentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type FeedbackStatus = 'PENDING' | 'ANALYZED' | 'UNDER_REVIEW' | 'ACTION_TAKEN' | 'RESOLVED';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  employeeId?: string;
  employeeCode?: string;
  departmentId?: string;
  designation?: string;
  avatarUrl?: string;
}

export interface Employee {
  id: string;
  userId?: string;
  employeeCode: string;
  name: string;
  email: string;
  departmentId: string;
  departmentName?: string;
  departmentCode?: string;
  designation: string;
  experienceYears: number;
  joiningDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string;
  performanceScore: number;
  managerName?: string;
  projects?: string[];
  achievements?: string[];
  certifications?: string[];
  riskLevel?: RiskLevel;
  riskScore?: number;
  burnoutRisk?: boolean;
  feedbackCount?: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  managerName: string;
  budgetAllocated: number;
  employeeCount?: number;
  feedbackCount?: number;
  satisfactionScore?: number;
}

export interface FeedbackAnalysis {
  id: string;
  feedbackId: string;
  sentiment: Sentiment;
  category: string;
  severity: Severity;
  issues: string[];
  summary: string;
  recommendations: string[];
  sentimentScore: number;
  analyzedAt: string;
  isGeminiGenerated?: boolean;
}

export interface Feedback {
  id: string;
  employeeId?: string;
  departmentId: string;
  departmentName?: string;
  department?: { id: string; name: string; code: string } | null;
  employee?: {
    id?: string | null;
    name: string;
    employeeCode: string;
    designation: string;
    avatarUrl?: string;
    performanceScore?: number;
  } | null;
  title: string;
  description: string;
  category: string;
  isAnonymous: boolean;
  status: FeedbackStatus;
  createdAt: string;
  actionNotes?: string;
  analysis?: FeedbackAnalysis;
  employeeRiskLevel?: RiskLevel;
}

export interface EmployeeRisk {
  id: string;
  employeeId: string;
  employeeName?: string;
  employeeCode?: string;
  departmentName?: string;
  designation?: string;
  avatarUrl?: string;
  riskLevel: RiskLevel;
  riskScore: number;
  burnoutRisk: boolean;
  dominantIssues: string[];
  lastCalculatedAt: string;
  recommendations: string[];
}

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  progress: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  targetRole: Role;
  departmentId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalEmployees: number;
  totalFeedback: number;
  satisfactionScore: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  aiRiskScore: number;
  burnoutRiskEmployees: number;
  engagementScore: number;
  topPerformingDepartment: string;
}

export interface OrganizationalInsight {
  issue: string;
  affectedEmployees: number;
  severity: Severity;
  trend: string;
  category: string;
  recommendation: string;
}
