export type Role = 'EMPLOYEE' | 'HR_ADMIN';

export type Sentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type FeedbackStatus = 'PENDING' | 'ANALYZED' | 'UNDER_REVIEW' | 'ACTION_TAKEN' | 'RESOLVED';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  name: string;
  createdAt: string;
}

export interface EmployeeRecord {
  id: string;
  userId: string;
  employeeCode: string;
  name: string;
  email: string;
  departmentId: string;
  designation: string;
  experienceYears: number;
  joiningDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string;
  performanceScore: number; // 0 - 100
  managerName?: string;
  projects: string[];
  achievements: string[];
  certifications: string[];
  createdAt: string;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  description: string;
  managerName: string;
  budgetAllocated: number;
  createdAt: string;
}

export interface FeedbackRecord {
  id: string;
  employeeId?: string; // null if anonymous
  departmentId: string;
  title: string;
  description: string;
  category: string;
  isAnonymous: boolean;
  status: FeedbackStatus;
  createdAt: string;
  actionNotes?: string;
}

export interface FeedbackAnalysisRecord {
  id: string;
  feedbackId: string;
  sentiment: Sentiment;
  category: string;
  severity: Severity;
  issues: string[];
  summary: string;
  recommendations: string[];
  sentimentScore: number; // -1 to 1
  analyzedAt: string;
  isGeminiGenerated: boolean;
}

export interface EmployeeRiskRecord {
  id: string;
  employeeId: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100
  burnoutRisk: boolean;
  dominantIssues: string[];
  lastCalculatedAt: string;
  recommendations: string[];
}

export interface GoalRecord {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  progress: number; // 0 - 100
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  targetRole: Role;
  departmentId?: string;
  isRead: boolean;
  createdAt: string;
}
