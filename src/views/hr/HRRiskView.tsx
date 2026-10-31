import React, { useEffect, useState } from "react";
import { Employee, RiskLevel } from "../../types";
import { api } from "../../services/api";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  MessageSquare,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { RiskBadge } from "../../components/Badges";

interface HRRiskViewProps {
  onViewEmployee: (id: string) => void;
}

export const HRRiskView: React.FC<HRRiskViewProps> = ({ onViewEmployee }) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadRiskData();
  }, [riskFilter]);

  const loadRiskData = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployees({
        riskLevel: riskFilter,
      });
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleOneOnOne = (emp: any) => {
    setActionSuccess(`1-on-1 check-in scheduled with ${emp.name} for next Tuesday 10:00 AM.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Employee Risk & Burnout Sentinel</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              AI Powered
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time multi-signal risk calculation based on negative feedback density, severity escalation, and performance
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {actionSuccess}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((level) => (
          <button
            key={level}
            onClick={() => setRiskFilter(level)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              riskFilter === level
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {level === "ALL" ? "All Levels" : `${level} Risk`}
          </button>
        ))}
      </div>

      {/* Risk Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Burnout Warning</th>
                <th className="py-3 px-4">Performance</th>
                <th className="py-3 px-4">Feedback Count</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Evaluating risk indexes...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No employees matching selected risk filter.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{emp.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">
                            {emp.designation} • {emp.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {emp.departmentName || "General"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RiskBadge risk={emp.riskLevel} burnout={emp.burnoutRisk} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold">
                      <span
                        className={
                          emp.riskScore > 70
                            ? "text-rose-600"
                            : emp.riskScore > 40
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }
                      >
                        {emp.riskScore}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {emp.burnoutRisk ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                          Burnout Alert
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Normal</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700 whitespace-nowrap">
                      {emp.performanceScore}%
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {emp.feedbackCount} logged
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleScheduleOneOnOne(emp)}
                          className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition-colors"
                        >
                          Schedule 1-on-1
                        </button>
                        <button
                          onClick={() => onViewEmployee(emp.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                        >
                          Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
