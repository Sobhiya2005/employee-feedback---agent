import React, { useState } from "react";
import { Department } from "../../types";
import { api } from "../../services/api";
import {
  Download,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Filter,
  Printer,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ReportModal } from "../../components/ReportModal";

interface HRReportsViewProps {
  departments: Department[];
}

export const HRReportsView: React.FC<HRReportsViewProps> = ({ departments }) => {
  const [selectedType, setSelectedType] = useState("feedback");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [dateRange, setDateRange] = useState("LAST_90_DAYS");
  const [activeReport, setActiveReport] = useState<{ title: string; data: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const reportCards = [
    {
      id: "feedback",
      title: "Employee Feedback Master Report",
      description: "Full dump of employee feedback, categories, raw content, and resolution statuses.",
      icon: FileText,
      color: "bg-blue-50 text-blue-700",
    },
    {
      id: "sentiment",
      title: "Sentiment & Tone Velocity Report",
      description: "Aggregated positive, neutral, and negative sentiment distribution across sprints.",
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      id: "department",
      title: "Department Satisfaction Benchmark",
      description: "Comparative metrics by business unit, employee counts, and net satisfaction percentages.",
      icon: FileCheck2,
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      id: "risk",
      title: "Employee Risk & Burnout Audit",
      description: "High and Critical risk employee registers, negative sentiment density, and burnout alerts.",
      icon: FileSpreadsheet,
      color: "bg-rose-50 text-rose-700",
    },
    {
      id: "insights",
      title: "AI Organizational Insights Summary",
      description: "Google Gemini synthesized organizational focus areas, affected employees, and recommended actions.",
      icon: Sparkles,
      color: "bg-purple-50 text-purple-700",
    },
  ];

  const handleGenerate = async (typeId: string, title: string) => {
    setLoading(true);
    try {
      const res = await api.getReportData(typeId);
      let list = res.data || [];
      if (selectedDept !== "ALL") {
        list = list.filter((r: any) => r.departmentId === selectedDept || r.department === selectedDept);
      }
      setActiveReport({ title, data: list });
    } catch (err) {
      console.error(err);
      alert("Failed to compile report data");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    window.open(api.exportCsvUrl(), "_blank");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Executive Reporting & Compliance Export
          </h2>
          <p className="text-xs text-slate-500">
            Generate audit-ready documentation, export CSV datasets, and print executive summaries
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export All Feedback CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter Parameters:</span>
        </div>
        <div>
          <label className="text-slate-500 mr-2 font-medium">Department:</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-500 mr-2 font-medium">Timeframe:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
          >
            <option value="LAST_30_DAYS">Last 30 Days</option>
            <option value="LAST_90_DAYS">Last 90 Days</option>
            <option value="CURRENT_YEAR">Year to Date (2026)</option>
            <option value="ALL_TIME">All Historical Records</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportCards.map((rc) => {
          const Icon = rc.icon;
          return (
            <div
              key={rc.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${rc.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">PDF / CSV Ready</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{rc.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{rc.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleGenerate(rc.id, rc.title)}
                  disabled={loading}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs text-center"
                >
                  Generate & Preview
                </button>
                <button
                  onClick={handleExportCsv}
                  className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200"
                  title="Direct CSV Export"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activeReport && (
        <ReportModal
          title={activeReport.title}
          type={selectedType}
          data={activeReport.data}
          onClose={() => setActiveReport(null)}
          onExportCsv={handleExportCsv}
        />
      )}
    </div>
  );
};
