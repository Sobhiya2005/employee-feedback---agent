import React, { useRef } from "react";
import { Download, FileSpreadsheet, Printer, X } from "lucide-react";
import { Feedback } from "../types";

interface ReportModalProps {
  title: string;
  type: string;
  data: any[];
  onClose: () => void;
  onExportCsv: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  title,
  type,
  data,
  onClose,
  onExportCsv,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">{title}</h3>
              <p className="text-xs text-slate-500">
                Generated {new Date().toLocaleDateString()} • {data.length} total records
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div ref={printRef} className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  FeedPulse AI — Executive HR Report
                </h1>
                <p className="text-slate-500">Confidential • Human Resources Operations</p>
              </div>
              <div className="text-right text-slate-400">
                <p>Status: Complete</p>
                <p>Engine: Google Gemini 3.8 + MySQL</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Sentiment</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Summary / AI Finding</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{row.date || row.createdAt?.split("T")[0] || "2026-09"}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {row.employee || (row.isAnonymous ? "Anonymous" : row.employee?.name || "Employee")}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {row.department || row.departmentName || "General"}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{row.category}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        (row.sentiment || row.analysis?.sentiment) === "POSITIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : (row.sentiment || row.analysis?.sentiment) === "NEGATIVE"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {row.sentiment || row.analysis?.sentiment || "NEUTRAL"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-700">
                        {row.severity || row.analysis?.severity || "LOW"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                      {row.summary || row.analysis?.summary || row.title}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-indigo-700 whitespace-nowrap">
                      {row.status || "ANALYZED"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
