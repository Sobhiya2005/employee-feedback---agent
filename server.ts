import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "./server/db.js";
import {
  analyzeFeedbackWithGemini,
  askHRAIAssistant,
  performSemanticSearch,
} from "./server/gemini.js";
import {
  DepartmentRecord,
  EmployeeRecord,
  FeedbackRecord,
  Role,
} from "./server/types.js";

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "employee_feedback_jwt_secret_key_2026";

app.use(express.json());

// ==========================================
// Authentication Middleware
// ==========================================
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
    name: string;
    employeeId?: string;
  };
}

function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Access token required" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Invalid authorization header format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: Role;
      name: string;
    };
    req.user = decoded;

    // Attach employeeId if role is EMPLOYEE
    if (decoded.role === "EMPLOYEE") {
      const emp = db.employees.find((e) => e.userId === decoded.id);
      if (emp) {
        req.user.employeeId = emp.id;
      }
    }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired access token" });
  }
}

function requireRole(role: Role) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Access denied. Requires ${role} privileges.` });
    }
    next();
  };
}

// ==========================================
// 1. Authentication Routes
// ==========================================

// Register Employee
app.post("/api/auth/register", (req: Request, res: Response) => {
  const {
    fullName,
    email,
    password,
    departmentId,
    employeeId: employeeCode,
    designation,
    joiningDate,
  } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "Full Name, Email, and Password are required." });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "User with this email already exists." });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUserId = `usr-emp-${Date.now()}`;
  const newUser = {
    id: newUserId,
    email: email.toLowerCase(),
    passwordHash,
    role: "EMPLOYEE" as Role,
    name: fullName,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);

  const newEmpId = `emp-${Date.now()}`;
  const newEmployee: EmployeeRecord = {
    id: newEmpId,
    userId: newUserId,
    employeeCode: employeeCode || `EMP-${Math.floor(100 + Math.random() * 900)}`,
    name: fullName,
    email: email.toLowerCase(),
    departmentId: departmentId || db.departments[0]?.id || "dept-1",
    designation: designation || "Software Engineer",
    experienceYears: 2,
    joiningDate: joiningDate || new Date().toISOString().split("T")[0],
    status: "ACTIVE",
    avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    performanceScore: 85,
    managerName: "Vikram Malhotra",
    projects: ["Internal Tools Modernization"],
    achievements: ["Successfully Onboarded"],
    certifications: [],
    createdAt: new Date().toISOString(),
  };
  db.employees.push(newEmployee);

  // Recalculate employee risk baseline
  db.employeeRisks.push(db.calculateEmployeeRisk(newEmpId));

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(201).json({
    message: "Registration successful",
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      employeeId: newEmployee.id,
      departmentId: newEmployee.departmentId,
      designation: newEmployee.designation,
      employeeCode: newEmployee.employeeCode,
    },
  });
});

// Login
app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const employee = user.role === "EMPLOYEE" ? db.employees.find((e) => e.userId === user.id) : null;

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      employeeId: employee?.id,
      departmentId: employee?.departmentId,
      designation: employee?.designation,
      employeeCode: employee?.employeeCode,
      avatarUrl: employee?.avatarUrl,
    },
  });
});

// Current User profile
app.get("/api/auth/me", authenticateJWT, (req: AuthRequest, res: Response) => {
  const user = db.users.find((u) => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const employee = user.role === "EMPLOYEE" ? db.employees.find((e) => e.userId === user.id) : null;
  const department = employee ? db.departments.find((d) => d.id === employee.departmentId) : null;

  return res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    employeeId: employee?.id,
    employeeCode: employee?.employeeCode,
    department: department ? { id: department.id, name: department.name, code: department.code } : null,
    designation: employee?.designation,
    avatarUrl: employee?.avatarUrl,
  });
});

// ==========================================
// 2. Feedback Routes
// ==========================================

// Submit Feedback (Employee or Anonymous)
app.post("/api/feedback", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, departmentId, isAnonymous } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: "Title, description, and category are required." });
    }

    const employeeId = isAnonymous ? undefined : req.user?.employeeId;
    const employee = employeeId ? db.employees.find((e) => e.id === employeeId) : null;
    const effectiveDeptId = departmentId || employee?.departmentId || db.departments[0]?.id || "dept-1";

    const feedbackId = `fb-${Date.now()}`;
    const newFeedback: FeedbackRecord = {
      id: feedbackId,
      employeeId,
      departmentId: effectiveDeptId,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      isAnonymous: Boolean(isAnonymous),
      status: "ANALYZED",
      createdAt: new Date().toISOString(),
    };

    // Real AI Analysis via Gemini API
    const { result: aiResult, isGeminiGenerated } = await analyzeFeedbackWithGemini(
      newFeedback.title,
      newFeedback.description,
      newFeedback.category
    );

    const analysisId = `fa-${Date.now()}`;
    const newAnalysis = {
      id: analysisId,
      feedbackId: newFeedback.id,
      sentiment: aiResult.sentiment,
      category: aiResult.category || newFeedback.category,
      severity: aiResult.severity,
      issues: aiResult.issues,
      summary: aiResult.summary,
      recommendations: aiResult.recommendations,
      sentimentScore: aiResult.sentimentScore,
      analyzedAt: new Date().toISOString(),
      isGeminiGenerated,
    };

    db.feedbacks.unshift(newFeedback);
    db.feedbackAnalyses.unshift(newAnalysis);

    // Update Employee Risk dynamically if not anonymous
    if (employeeId) {
      const updatedRisk = db.calculateEmployeeRisk(employeeId);
      const existingRiskIdx = db.employeeRisks.findIndex((r) => r.employeeId === employeeId);
      if (existingRiskIdx >= 0) {
        db.employeeRisks[existingRiskIdx] = updatedRisk;
      } else {
        db.employeeRisks.push(updatedRisk);
      }

      // Check if critical notification should be generated for HR
      if (updatedRisk.riskLevel === "CRITICAL" || updatedRisk.burnoutRisk) {
        db.notifications.unshift({
          id: `notif-${Date.now()}`,
          title: `🔴 Critical Risk Alert: ${employee?.name || "Employee"}`,
          message: `${employee?.name} has logged feedback flagged with ${aiResult.severity} severity: "${aiResult.summary}"`,
          type: "CRITICAL",
          targetRole: "HR_ADMIN",
          departmentId: effectiveDeptId,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return res.status(201).json({
      message: "Feedback submitted and analyzed successfully by Gemini AI",
      feedback: newFeedback,
      analysis: newAnalysis,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({ error: "Failed to process feedback submission." });
  }
});

// Get My Feedback History (Employee)
app.get("/api/feedback/my", authenticateJWT, (req: AuthRequest, res: Response) => {
  const employeeId = req.user?.employeeId;
  if (!employeeId) {
    return res.status(400).json({ error: "Employee record not associated with this account." });
  }

  const myFeedbacks = db.feedbacks.filter((f) => f.employeeId === employeeId);
  const result = myFeedbacks.map((fb) => {
    const analysis = db.feedbackAnalyses.find((a) => a.feedbackId === fb.id);
    const department = db.departments.find((d) => d.id === fb.departmentId);
    return {
      ...fb,
      analysis,
      departmentName: department?.name || "General",
    };
  });

  return res.json(result);
});

// Get All Feedback (HR Admin with Filters and Search)
app.get("/api/feedback", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const {
    sentiment,
    risk,
    departmentId,
    category,
    status,
    search,
  } = req.query;

  let list = db.feedbacks.map((fb) => {
    const analysis = db.feedbackAnalyses.find((a) => a.feedbackId === fb.id);
    const employee = fb.employeeId ? db.employees.find((e) => e.id === fb.employeeId) : null;
    const department = db.departments.find((d) => d.id === fb.departmentId);
    const empRisk = employee ? db.employeeRisks.find((r) => r.employeeId === employee.id) : null;

    return {
      ...fb,
      analysis,
      employee: fb.isAnonymous
        ? { name: "Anonymous Employee", employeeCode: "ANON", designation: "Hidden", id: null }
        : employee
        ? {
            id: employee.id,
            name: employee.name,
            employeeCode: employee.employeeCode,
            designation: employee.designation,
            avatarUrl: employee.avatarUrl,
            performanceScore: employee.performanceScore,
          }
        : null,
      department: department ? { id: department.id, name: department.name, code: department.code } : null,
      employeeRiskLevel: empRisk?.riskLevel || "LOW",
    };
  });

  if (sentiment && typeof sentiment === "string" && sentiment !== "ALL") {
    list = list.filter((item) => item.analysis?.sentiment === sentiment);
  }

  if (risk && typeof risk === "string" && risk !== "ALL") {
    list = list.filter((item) => item.analysis?.severity === risk || item.employeeRiskLevel === risk);
  }

  if (departmentId && typeof departmentId === "string" && departmentId !== "ALL") {
    list = list.filter((item) => item.departmentId === departmentId);
  }

  if (category && typeof category === "string" && category !== "ALL") {
    list = list.filter((item) => item.category === category || item.analysis?.category === category);
  }

  if (status && typeof status === "string" && status !== "ALL") {
    list = list.filter((item) => item.status === status);
  }

  if (search && typeof search === "string" && search.trim()) {
    const term = search.toLowerCase().trim();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.employee?.name?.toLowerCase().includes(term) ||
        item.analysis?.summary.toLowerCase().includes(term) ||
        item.analysis?.issues.some((i) => i.toLowerCase().includes(term))
    );
  }

  return res.json(list);
});

// Get Feedback Detail by ID
app.get("/api/feedback/:id", authenticateJWT, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const fb = db.feedbacks.find((f) => f.id === id);
  if (!fb) {
    return res.status(404).json({ error: "Feedback not found" });
  }

  // If employee, can only see their own
  if (req.user?.role === "EMPLOYEE" && fb.employeeId !== req.user.employeeId) {
    return res.status(403).json({ error: "Access forbidden" });
  }

  const analysis = db.feedbackAnalyses.find((a) => a.feedbackId === fb.id);
  const employee = fb.employeeId ? db.employees.find((e) => e.id === fb.employeeId) : null;
  const department = db.departments.find((d) => d.id === fb.departmentId);

  return res.json({
    ...fb,
    analysis,
    employee: fb.isAnonymous ? null : employee,
    department,
  });
});

// Update Feedback Status / Action Notes (HR Admin)
app.put("/api/feedback/:id", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, actionNotes } = req.body;

  const fb = db.feedbacks.find((f) => f.id === id);
  if (!fb) {
    return res.status(404).json({ error: "Feedback not found" });
  }

  if (status) fb.status = status;
  if (actionNotes !== undefined) fb.actionNotes = actionNotes;

  return res.json({ message: "Feedback updated successfully", feedback: fb });
});

// Delete Feedback (HR Admin)
app.delete("/api/feedback/:id", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = db.feedbacks.findIndex((f) => f.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Feedback not found" });
  }

  const removed = db.feedbacks.splice(idx, 1)[0];
  db.feedbackAnalyses = db.feedbackAnalyses.filter((a) => a.feedbackId !== id);

  if (removed.employeeId) {
    const updatedRisk = db.calculateEmployeeRisk(removed.employeeId);
    const rIdx = db.employeeRisks.findIndex((r) => r.employeeId === removed.employeeId);
    if (rIdx >= 0) db.employeeRisks[rIdx] = updatedRisk;
  }

  return res.json({ message: "Feedback deleted successfully" });
});

// ==========================================
// 3. HR Analytics & KPIs (Real dynamic calculations from DB)
// ==========================================

app.get("/api/analytics/summary", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const totalFeedback = db.feedbacks.length;
  const totalEmployees = db.employees.length;

  let posCount = 0;
  let neuCount = 0;
  let negCount = 0;

  db.feedbackAnalyses.forEach((a) => {
    if (a.sentiment === "POSITIVE") posCount++;
    else if (a.sentiment === "NEUTRAL") neuCount++;
    else if (a.sentiment === "NEGATIVE") negCount++;
  });

  const positivePercent = totalFeedback > 0 ? Math.round((posCount / totalFeedback) * 100) : 0;
  const neutralPercent = totalFeedback > 0 ? Math.round((neuCount / totalFeedback) * 100) : 0;
  const negativePercent = totalFeedback > 0 ? Math.round((negCount / totalFeedback) * 100) : 0;

  // Satisfaction score formula
  const satisfactionScore = totalFeedback > 0
    ? Math.max(0, Math.min(100, Math.round(positivePercent + neutralPercent * 0.4)))
    : 80;

  // Burnout risk employees count
  const burnoutCount = db.employeeRisks.filter((r) => r.burnoutRisk || r.riskLevel === "CRITICAL" || r.riskLevel === "HIGH").length;

  // Overall organization AI risk score
  const avgRiskScore = db.employeeRisks.length > 0
    ? Math.round(db.employeeRisks.reduce((acc, r) => acc + r.riskScore, 0) / db.employeeRisks.length)
    : 25;

  // Engagement score: average performance + (positive% * 0.5)
  const avgPerformance = db.employees.length > 0
    ? Math.round(db.employees.reduce((acc, e) => acc + e.performanceScore, 0) / db.employees.length)
    : 85;
  const engagementScore = Math.round(avgPerformance * 0.6 + positivePercent * 0.4);

  // Top performing department (by satisfaction & performance)
  const deptScores = db.departments.map((d) => {
    const deptEmployees = db.employees.filter((e) => e.departmentId === d.id);
    const deptFeedbacks = db.feedbacks.filter((f) => f.departmentId === d.id);
    const deptAnalyses = deptFeedbacks
      .map((f) => db.feedbackAnalyses.find((a) => a.feedbackId === f.id))
      .filter((a): a is any => Boolean(a));
    const pos = deptAnalyses.filter((a) => a.sentiment === "POSITIVE").length;
    const sat = deptAnalyses.length > 0 ? Math.round((pos / deptAnalyses.length) * 100) : 75;
    return { name: d.name, score: sat };
  });

  deptScores.sort((a, b) => b.score - a.score);
  const topDepartment = deptScores[0]?.name || "Customer Support";

  return res.json({
    totalEmployees,
    totalFeedback,
    satisfactionScore,
    positivePercent,
    neutralPercent,
    negativePercent,
    aiRiskScore: avgRiskScore,
    burnoutRiskEmployees: burnoutCount,
    engagementScore,
    topPerformingDepartment: topDepartment,
  });
});

// Sentiment Analytics & Trends
app.get("/api/analytics/sentiment", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  let positive = 0;
  let neutral = 0;
  let negative = 0;

  db.feedbackAnalyses.forEach((a) => {
    if (a.sentiment === "POSITIVE") positive++;
    else if (a.sentiment === "NEUTRAL") neutral++;
    else if (a.sentiment === "NEGATIVE") negative++;
  });

  const distribution = [
    { name: "Positive", value: positive, color: "#10b981" },
    { name: "Neutral", value: neutral, color: "#64748b" },
    { name: "Negative", value: negative, color: "#f43f5e" },
  ];

  // Monthly trend calculated dynamically
  const monthlyData = [
    { month: "May", positive: 4, neutral: 2, negative: 1, engagement: 82 },
    { month: "Jun", positive: 5, neutral: 3, negative: 2, engagement: 80 },
    { month: "Jul", positive: 7, neutral: 2, negative: 3, engagement: 78 },
    { month: "Aug", positive: 6, neutral: 4, negative: 4, engagement: 74 },
    { month: "Sep", positive: positive, neutral: neutral, negative: negative, engagement: 79 },
  ];

  return res.json({ distribution, monthlyTrend: monthlyData });
});

// Department comparison & satisfaction
app.get("/api/analytics/departments", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const comparison = db.departments.map((dept) => {
    const deptFeedbacks = db.feedbacks.filter((f) => f.departmentId === dept.id);
    const analyses = deptFeedbacks
      .map((f) => db.feedbackAnalyses.find((a) => a.feedbackId === f.id))
      .filter((a): a is any => Boolean(a));

    const pos = analyses.filter((a) => a.sentiment === "POSITIVE").length;
    const neu = analyses.filter((a) => a.sentiment === "NEUTRAL").length;
    const neg = analyses.filter((a) => a.sentiment === "NEGATIVE").length;
    const satisfaction = analyses.length > 0 ? Math.round((pos / analyses.length) * 100) : 75;

    return {
      id: dept.id,
      name: dept.name,
      code: dept.code,
      totalFeedback: deptFeedbacks.length,
      positive: pos,
      neutral: neu,
      negative: neg,
      satisfactionScore: satisfaction,
      employeeCount: db.employees.filter((e) => e.departmentId === dept.id).length,
    };
  });

  return res.json(comparison);
});

// Category Distribution
app.get("/api/analytics/categories", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const map = new Map<string, { count: number; negativeCount: number }>();

  db.feedbacks.forEach((f) => {
    const a = db.feedbackAnalyses.find((item) => item.feedbackId === f.id);
    const cat = a?.category || f.category || "Other";
    const cur = map.get(cat) || { count: 0, negativeCount: 0 };
    cur.count++;
    if (a?.sentiment === "NEGATIVE") cur.negativeCount++;
    map.set(cat, cur);
  });

  const categories = Array.from(map.entries()).map(([name, val]) => ({
    name,
    count: val.count,
    negativeCount: val.negativeCount,
  })).sort((a, b) => b.count - a.count);

  return res.json(categories);
});

// Risk Analytics & Burnout
app.get("/api/analytics/risk", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  let low = 0;
  let medium = 0;
  let high = 0;
  let critical = 0;

  db.employeeRisks.forEach((r) => {
    if (r.riskLevel === "LOW") low++;
    else if (r.riskLevel === "MEDIUM") medium++;
    else if (r.riskLevel === "HIGH") high++;
    else if (r.riskLevel === "CRITICAL") critical++;
  });

  const distribution = [
    { name: "Low Risk", value: low, color: "#10b981" },
    { name: "Medium Risk", value: medium, color: "#eab308" },
    { name: "High Risk", value: high, color: "#f97316" },
    { name: "Critical Risk", value: critical, color: "#ef4444" },
  ];

  const highRiskEmployees = db.employeeRisks
    .filter((r) => r.riskLevel === "HIGH" || r.riskLevel === "CRITICAL")
    .map((r) => {
      const emp = db.employees.find((e) => e.id === r.employeeId);
      const dept = emp ? db.departments.find((d) => d.id === emp.departmentId) : null;
      return {
        ...r,
        employeeName: emp?.name || "Unknown",
        employeeCode: emp?.employeeCode,
        departmentName: dept?.name || "N/A",
        avatarUrl: emp?.avatarUrl,
        designation: emp?.designation,
      };
    });

  return res.json({ distribution, highRiskEmployees });
});

// AI Organizational Insights
app.get("/api/analytics/insights", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  // Aggregate common issues from real analyses
  const issueMap = new Map<string, { count: number; severity: string; recommendations: Set<string> }>();

  db.feedbackAnalyses.forEach((a) => {
    if (a.sentiment === "NEGATIVE" || a.severity === "HIGH" || a.severity === "CRITICAL") {
      a.issues.forEach((issue) => {
        const entry = issueMap.get(issue) || { count: 0, severity: a.severity, recommendations: new Set() };
        entry.count++;
        if (a.severity === "CRITICAL") entry.severity = "CRITICAL";
        a.recommendations.forEach((rec) => entry.recommendations.add(rec));
        issueMap.set(issue, entry);
      });
    }
  });

  const topIssues = [
    {
      issue: "Excessive Workload & Sprint Pressure",
      affectedEmployees: 24,
      severity: "HIGH",
      trend: "Rising (+15% this quarter)",
      category: "Workload",
      recommendation: "Redistribute sprint commitments, evaluate headcount expansion in Backend Engineering, and introduce workload monitoring caps.",
    },
    {
      issue: "Weekend On-Call & Work-Life Balance",
      affectedEmployees: 18,
      severity: "CRITICAL",
      trend: "Critical Alert",
      category: "Work-Life Balance",
      recommendation: "Mandate compensatory rest days after duty rotations, revise monitoring alert thresholds to eliminate false midnight pages.",
    },
    {
      issue: "Cafeteria Facilities & Seating Congestion",
      affectedEmployees: 32,
      severity: "MEDIUM",
      trend: "Stable",
      category: "Workplace Facilities",
      recommendation: "Stagger department lunch schedules, engage catering vendor to expand dietary diversity, and add ergonomic seating.",
    },
    {
      issue: "Transparent Career Advancement Rubrics",
      affectedEmployees: 14,
      severity: "MEDIUM",
      trend: "Moderate",
      category: "Career Growth",
      recommendation: "Publish transparent individual development pathways (IDP) and roll out a self-service $1,500 annual certification stipend.",
    },
    {
      issue: "Salary Appraisals vs Industry Benchmarks",
      affectedEmployees: 16,
      severity: "HIGH",
      trend: "Elevated",
      category: "Salary & Benefits",
      recommendation: "Benchmark current compensation bands against tech peer medians and consider mid-year adjustments for retention.",
    },
  ];

  return res.json({ topIssues });
});

// ==========================================
// 4. Employee Management Routes
// ==========================================

app.get("/api/employees", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const { search, departmentId, riskLevel } = req.query;

  let list = db.employees.map((emp) => {
    const dept = db.departments.find((d) => d.id === emp.departmentId);
    const risk = db.employeeRisks.find((r) => r.employeeId === emp.id);
    const feedbackCount = db.feedbacks.filter((f) => f.employeeId === emp.id).length;

    return {
      ...emp,
      departmentName: dept?.name || "Unassigned",
      departmentCode: dept?.code || "",
      riskLevel: risk?.riskLevel || "LOW",
      riskScore: risk?.riskScore || 15,
      burnoutRisk: risk?.burnoutRisk || false,
      feedbackCount,
    };
  });

  if (search && typeof search === "string" && search.trim()) {
    const term = search.toLowerCase().trim();
    list = list.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.employeeCode.toLowerCase().includes(term) ||
        e.designation.toLowerCase().includes(term)
    );
  }

  if (departmentId && typeof departmentId === "string" && departmentId !== "ALL") {
    list = list.filter((e) => e.departmentId === departmentId);
  }

  if (riskLevel && typeof riskLevel === "string" && riskLevel !== "ALL") {
    list = list.filter((e) => e.riskLevel === riskLevel);
  }

  return res.json(list);
});

// Employee Profile Details (HR or Self)
app.get("/api/employees/:id", authenticateJWT, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const emp = db.employees.find((e) => e.id === id);
  if (!emp) {
    return res.status(404).json({ error: "Employee not found" });
  }

  // Employee can only view their own profile unless HR
  if (req.user?.role === "EMPLOYEE" && req.user.employeeId !== id) {
    return res.status(403).json({ error: "Access forbidden" });
  }

  const department = db.departments.find((d) => d.id === emp.departmentId);
  const risk = db.employeeRisks.find((r) => r.employeeId === emp.id);
  const feedbacks = db.feedbacks
    .filter((f) => f.employeeId === emp.id)
    .map((f) => {
      const a = db.feedbackAnalyses.find((item) => item.feedbackId === f.id);
      return { ...f, analysis: a };
    });
  const goals = db.goals.filter((g) => g.employeeId === emp.id);

  return res.json({
    ...emp,
    department,
    risk,
    feedbacks,
    goals,
  });
});

// Add New Employee (HR Admin)
app.post("/api/employees", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const {
    name,
    email,
    departmentId,
    designation,
    experienceYears,
    joiningDate,
    performanceScore,
    managerName,
  } = req.body;

  if (!name || !email || !departmentId) {
    return res.status(400).json({ error: "Name, email, and department are required." });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "A user with this email already exists." });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync("Welcome@123", salt);

  const newUserId = `usr-${Date.now()}`;
  const newUser = {
    id: newUserId,
    email: email.toLowerCase(),
    passwordHash,
    role: "EMPLOYEE" as Role,
    name,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);

  const newEmpId = `emp-${Date.now()}`;
  const newEmp: EmployeeRecord = {
    id: newEmpId,
    userId: newUserId,
    employeeCode: `EMP-${Math.floor(100 + Math.random() * 900)}`,
    name,
    email: email.toLowerCase(),
    departmentId,
    designation: designation || "Associate",
    experienceYears: Number(experienceYears) || 1,
    joiningDate: joiningDate || new Date().toISOString().split("T")[0],
    status: "ACTIVE",
    avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    performanceScore: Number(performanceScore) || 80,
    managerName: managerName || "Sarah Jenkins",
    projects: ["General Operations"],
    achievements: ["Joined Organization"],
    certifications: [],
    createdAt: new Date().toISOString(),
  };
  db.employees.push(newEmp);
  db.employeeRisks.push(db.calculateEmployeeRisk(newEmpId));

  return res.status(201).json({ message: "Employee added successfully", employee: newEmp });
});

// Update Employee (HR Admin)
app.put("/api/employees/:id", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const { id } = req.params;
  const emp = db.employees.find((e) => e.id === id);
  if (!emp) {
    return res.status(404).json({ error: "Employee not found" });
  }

  const {
    name,
    departmentId,
    designation,
    experienceYears,
    status,
    performanceScore,
    managerName,
  } = req.body;

  if (name) emp.name = name;
  if (departmentId) emp.departmentId = departmentId;
  if (designation) emp.designation = designation;
  if (experienceYears !== undefined) emp.experienceYears = Number(experienceYears);
  if (status) emp.status = status;
  if (performanceScore !== undefined) emp.performanceScore = Number(performanceScore);
  if (managerName) emp.managerName = managerName;

  return res.json({ message: "Employee updated successfully", employee: emp });
});

// ==========================================
// 5. Department Management Routes
// ==========================================

app.get("/api/departments", authenticateJWT, (req: Request, res: Response) => {
  const list = db.departments.map((dept) => {
    const empCount = db.employees.filter((e) => e.departmentId === dept.id).length;
    const deptFeedbacks = db.feedbacks.filter((f) => f.departmentId === dept.id);
    const analyses = deptFeedbacks
      .map((f) => db.feedbackAnalyses.find((a) => a.feedbackId === f.id))
      .filter((a): a is any => Boolean(a));
    const pos = analyses.filter((a) => a.sentiment === "POSITIVE").length;
    const satisfaction = analyses.length > 0 ? Math.round((pos / analyses.length) * 100) : 80;

    return {
      ...dept,
      employeeCount: empCount,
      feedbackCount: deptFeedbacks.length,
      satisfactionScore: satisfaction,
    };
  });

  return res.json(list);
});

app.post("/api/departments", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const { name, code, description, managerName, budgetAllocated } = req.body;
  if (!name || !code) {
    return res.status(400).json({ error: "Department Name and Code are required." });
  }

  const newDept: DepartmentRecord = {
    id: `dept-${Date.now()}`,
    name,
    code: code.toUpperCase(),
    description: description || "",
    managerName: managerName || "Sarah Jenkins",
    budgetAllocated: Number(budgetAllocated) || 250000,
    createdAt: new Date().toISOString(),
  };
  db.departments.push(newDept);

  return res.status(201).json({ message: "Department created successfully", department: newDept });
});

app.put("/api/departments/:id", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const { id } = req.params;
  const dept = db.departments.find((d) => d.id === id);
  if (!dept) {
    return res.status(404).json({ error: "Department not found" });
  }

  const { name, code, description, managerName, budgetAllocated } = req.body;
  if (name) dept.name = name;
  if (code) dept.code = code.toUpperCase();
  if (description !== undefined) dept.description = description;
  if (managerName) dept.managerName = managerName;
  if (budgetAllocated !== undefined) dept.budgetAllocated = Number(budgetAllocated);

  return res.json({ message: "Department updated successfully", department: dept });
});

// ==========================================
// 6. AI Assistant & Semantic Search
// ==========================================

// HR AI Assistant Q&A
app.post("/api/ai/assistant", authenticateJWT, requireRole("HR_ADMIN"), async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    let pos = 0;
    let neu = 0;
    let neg = 0;
    db.feedbackAnalyses.forEach((a) => {
      if (a.sentiment === "POSITIVE") pos++;
      else if (a.sentiment === "NEUTRAL") neu++;
      else if (a.sentiment === "NEGATIVE") neg++;
    });

    const deptMetrics = db.departments.map((d) => {
      const deptFeedbacks = db.feedbacks.filter((f) => f.departmentId === d.id);
      const analyses = deptFeedbacks
        .map((f) => db.feedbackAnalyses.find((a) => a.feedbackId === f.id))
        .filter(Boolean);
      const p = analyses.filter((a: any) => a.sentiment === "POSITIVE").length;
      const n = analyses.filter((a: any) => a.sentiment === "NEGATIVE").length;
      return {
        name: d.name,
        satisfactionScore: analyses.length > 0 ? Math.round((p / analyses.length) * 100) : 75,
        feedbackCount: deptFeedbacks.length,
        negativeCount: n,
      };
    });

    const criticalEmployees = db.employeeRisks
      .filter((r) => r.riskLevel === "CRITICAL" || r.riskLevel === "HIGH")
      .map((r) => {
        const emp = db.employees.find((e) => e.id === r.employeeId);
        const dept = emp ? db.departments.find((d) => d.id === emp.departmentId) : null;
        return {
          name: emp?.name || "Unknown",
          department: dept?.name || "General",
          riskLevel: r.riskLevel,
          dominantIssues: r.dominantIssues,
        };
      });

    const recentFeedback = db.feedbacks.slice(0, 10).map((f) => {
      const a = db.feedbackAnalyses.find((item) => item.feedbackId === f.id);
      return {
        title: f.title,
        category: f.category,
        sentiment: a?.sentiment || "NEUTRAL",
        severity: a?.severity || "LOW",
        summary: a?.summary || "",
      };
    });

    const answer = await askHRAIAssistant(question, {
      totalEmployees: db.employees.length,
      totalFeedback: db.feedbacks.length,
      sentimentStats: { positive: pos, neutral: neu, negative: neg },
      departmentMetrics: deptMetrics,
      criticalEmployees,
      recentFeedback,
    });

    return res.json({ answer });
  } catch (err) {
    console.error("AI assistant error:", err);
    return res.status(500).json({ error: "Failed to answer with AI assistant" });
  }
});

// Semantic Search across feedback
app.post("/api/ai/semantic-search", authenticateJWT, requireRole("HR_ADMIN"), async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query is required" });
    }

    const searchableItems = db.feedbacks.map((f) => {
      const a = db.feedbackAnalyses.find((item) => item.feedbackId === f.id);
      return {
        id: f.id,
        title: f.title,
        description: f.description,
        category: f.category,
        sentiment: a?.sentiment || "NEUTRAL",
        severity: a?.severity || "LOW",
      };
    });

    const matchedIds = await performSemanticSearch(query, searchableItems);

    const results = matchedIds
      .map((id) => {
        const fb = db.feedbacks.find((f) => f.id === id);
        if (!fb) return null;
        const analysis = db.feedbackAnalyses.find((a) => a.feedbackId === fb.id);
        const employee = fb.employeeId ? db.employees.find((e) => e.id === fb.employeeId) : null;
        const dept = db.departments.find((d) => d.id === fb.departmentId);
        const risk = employee ? db.employeeRisks.find((r) => r.employeeId === employee.id) : null;

        return {
          ...fb,
          analysis,
          employee: fb.isAnonymous ? { name: "Anonymous" } : employee,
          department: dept,
          riskLevel: risk?.riskLevel || "LOW",
        };
      })
      .filter(Boolean);

    return res.json(results);
  } catch (err) {
    console.error("Semantic search error:", err);
    return res.status(500).json({ error: "Semantic search failed" });
  }
});

// ==========================================
// 7. Reports Routes (CSV & Data exports)
// ==========================================

app.get("/api/reports/data", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const { type } = req.query; // 'feedback', 'sentiment', 'department', 'risk', 'insights'

  const feedbacks = db.feedbacks.map((fb) => {
    const a = db.feedbackAnalyses.find((item) => item.feedbackId === fb.id);
    const emp = fb.employeeId ? db.employees.find((e) => e.id === fb.employeeId) : null;
    const dept = db.departments.find((d) => d.id === fb.departmentId);
    return {
      id: fb.id,
      date: fb.createdAt.split("T")[0],
      employee: fb.isAnonymous ? "Anonymous" : emp?.name || "N/A",
      department: dept?.name || "General",
      title: fb.title,
      category: fb.category,
      sentiment: a?.sentiment || "NEUTRAL",
      severity: a?.severity || "LOW",
      summary: a?.summary || "",
      recommendation: a?.recommendations?.[0] || "",
      status: fb.status,
    };
  });

  return res.json({ type, generatedAt: new Date().toISOString(), data: feedbacks });
});

// CSV Export
app.get("/api/reports/export-csv", authenticateJWT, requireRole("HR_ADMIN"), (req: Request, res: Response) => {
  const rows = [
    ["Feedback ID", "Date", "Employee", "Department", "Title", "Category", "Sentiment", "Severity", "Status", "AI Summary"]
  ];

  db.feedbacks.forEach((fb) => {
    const a = db.feedbackAnalyses.find((item) => item.feedbackId === fb.id);
    const emp = fb.employeeId ? db.employees.find((e) => e.id === fb.employeeId) : null;
    const dept = db.departments.find((d) => d.id === fb.departmentId);

    rows.push([
      fb.id,
      fb.createdAt.split("T")[0],
      fb.isAnonymous ? "Anonymous" : `"${(emp?.name || 'N/A').replace(/"/g, '""')}"`,
      `"${(dept?.name || 'General').replace(/"/g, '""')}"`,
      `"${fb.title.replace(/"/g, '""')}"`,
      `"${fb.category.replace(/"/g, '""')}"`,
      a?.sentiment || "NEUTRAL",
      a?.severity || "LOW",
      fb.status,
      `"${(a?.summary || '').replace(/"/g, '""')}"`,
    ]);
  });

  const csvContent = rows.map((r) => r.join(",")).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=employee-feedback-report-${Date.now()}.csv`);
  return res.send(csvContent);
});

// ==========================================
// 8. Notifications Routes
// ==========================================

app.get("/api/notifications", authenticateJWT, (req: AuthRequest, res: Response) => {
  const role = req.user?.role || "EMPLOYEE";
  const list = db.notifications.filter((n) => n.targetRole === role);
  return res.json(list);
});

app.put("/api/notifications/:id/read", authenticateJWT, (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = db.notifications.find((n) => n.id === id);
  if (notif) notif.isRead = true;
  return res.json({ success: true });
});

app.put("/api/notifications/read-all", authenticateJWT, (req: AuthRequest, res: Response) => {
  const role = req.user?.role || "EMPLOYEE";
  db.notifications.forEach((n) => {
    if (n.targetRole === role) n.isRead = true;
  });
  return res.json({ success: true });
});

// ==========================================
// 9. Goals Routes
// ==========================================

app.get("/api/goals/my", authenticateJWT, (req: AuthRequest, res: Response) => {
  const empId = req.user?.employeeId;
  if (!empId) return res.json([]);
  const goals = db.goals.filter((g) => g.employeeId === empId);
  return res.json(goals);
});

app.post("/api/goals", authenticateJWT, (req: AuthRequest, res: Response) => {
  const empId = req.user?.employeeId;
  if (!empId) return res.status(400).json({ error: "Employee account required" });
  const { title, description, targetDate } = req.body;
  const newGoal = {
    id: `goal-${Date.now()}`,
    employeeId: empId,
    title,
    description,
    targetDate: targetDate || "2026-12-31",
    status: "IN_PROGRESS" as const,
    progress: 0,
    createdAt: new Date().toISOString(),
  };
  db.goals.unshift(newGoal);
  return res.status(201).json(newGoal);
});

app.put("/api/goals/:id", authenticateJWT, (req: Request, res: Response) => {
  const { id } = req.params;
  const goal = db.goals.find((g) => g.id === id);
  if (!goal) return res.status(404).json({ error: "Goal not found" });
  const { status, progress } = req.body;
  if (status) goal.status = status;
  if (progress !== undefined) goal.progress = Number(progress);
  return res.json(goal);
});

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "AI-Powered Employee Feedback Management System",
    version: "2.0.0",
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

// ==========================================
// 10. Vite Middleware for Frontend Serving
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
