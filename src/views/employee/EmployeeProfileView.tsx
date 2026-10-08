import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Employee, Feedback } from "../../types";
import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  FolderGit2,
  GraduationCap,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { RiskBadge, SentimentBadge } from "../../components/Badges";

export const EmployeeProfileView: React.FC = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<any | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.employeeId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getEmployeeById(user.employeeId);
      setEmployee(data);
      const myFbs = await api.getMyFeedback();
      setFeedbacks(myFbs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const emp = employee || {
    name: user?.name,
    email: user?.email,
    employeeCode: user?.employeeCode || "EMP-2026",
    designation: user?.designation || "Software Engineer",
    department: { name: "Engineering", code: "ENG" },
    performanceScore: 92,
    experienceYears: 4,
    joiningDate: "2023-01-15",
    managerName: "Vikram Malhotra",
    projects: ["Enterprise AI Pipelines", "Cloud Microservices Reliability", "Gemini Realtime Engine"],
    achievements: ["Architected Enterprise AI Feedback Analyzer", "Q4 Top Innovator Award"],
    certifications: ["Google Cloud Certified Professional Cloud Architect", "Certified Kubernetes Administrator (CKA)"],
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 relative p-6 flex items-end">
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Active Employee
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <img
              src={emp.avatarUrl || user?.avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
              alt={emp.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-slate-100"
            />
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{emp.name}</h1>
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                  {emp.employeeCode}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600">
                {emp.designation} • {emp.department?.name || "Engineering"}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {emp.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Joined {emp.joiningDate || "2023"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Performance Rating
              </div>
              <div className="text-2xl font-black text-indigo-600">
                {emp.performanceScore || 90}
                <span className="text-xs font-semibold text-slate-400">/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1 & 2: Projects, Achievements, Certifications */}
        <div className="md:col-span-2 space-y-6">
          {/* Projects */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <FolderGit2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Current Projects & Initiatives
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(emp.projects && emp.projects.length > 0
                ? emp.projects
                : ["Enterprise AI Pipelines", "Cloud Microservices Reliability", "Gemini Realtime Engine"]
              ).map((proj: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate">{proj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Key Accomplishments & Honors
              </h3>
            </div>
            <div className="space-y-2">
              {(emp.achievements && emp.achievements.length > 0
                ? emp.achievements
                : ["Architected Enterprise AI Feedback Analyzer", "Q4 Top Innovator Award"]
              ).map((ach: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs font-medium text-amber-900 flex items-center gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Professional Credentials & Certifications
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(emp.certifications && emp.certifications.length > 0
                ? emp.certifications
                : [
                    "Google Cloud Certified Professional Cloud Architect",
                    "Certified Kubernetes Administrator (CKA)",
                  ]
              ).map((cert: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <BadgeCheck className="w-3.5 h-3.5 text-purple-600" />
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Employment Dossier & Risk Matrix */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Employment Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Direct Reporting Manager</span>
                <span className="font-semibold text-slate-800">{emp.managerName || "Vikram Malhotra"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Experience</span>
                <span className="font-semibold text-slate-800">{emp.experienceYears || 4} Years Industry Experience</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Department ID</span>
                <span className="font-semibold text-slate-800 font-mono">{emp.departmentId || "dept-1"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Account Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  Active Employee
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Wellness & Risk Metric
              </h3>
              <RiskBadge level={emp.risk?.riskLevel || "LOW"} />
            </div>
            <p className="text-xs text-slate-500">
              Evaluated using automated Google Gemini NLP sentiment models across your recent feedback submissions.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-400 block text-[11px]">Risk Score</span>
              <span className="text-lg font-black text-slate-900">
                {emp.risk?.riskScore || 15}
                <span className="text-xs font-normal text-slate-400">/100 (Safe)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
