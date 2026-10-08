import React, { useEffect, useState } from "react";
import { Goal } from "../../types";
import { CheckCircle2, Clock, Plus, Target } from "lucide-react";
import { api } from "../../services/api";

export const HRGoalsView: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([
    {
      id: "org-1",
      title: "Decrease Organization-Wide Burnout Risk by 25%",
      description: "Introduce quarterly workload audits, cap sprint overtime, and mandate post-on-call recovery days.",
      progress: 65,
      status: "IN_PROGRESS",
      targetDate: "2026-12-31",
      department: "All Engineering & Operations",
    },
    {
      id: "org-2",
      title: "Achieve 85%+ Employee Satisfaction Index",
      description: "Modernize cafeteria facilities, publish career promotion rubrics, and expand annual learning stipends.",
      progress: 78,
      status: "IN_PROGRESS",
      targetDate: "2026-10-31",
      department: "Whole Organization",
    },
    {
      id: "org-3",
      title: "Automate 100% of Negative Feedback Escalations with AI",
      description: "Deploy real-time Gemini AI sentiment trigger pipelines to notify HR of critical concerns within 1 minute.",
      progress: 100,
      status: "COMPLETED",
      targetDate: "2026-09-01",
      department: "Human Resources Operations",
    },
    {
      id: "org-4",
      title: "Establish Transparent Technical Advancement Tracks",
      description: "Clarify Senior, Staff, and Principal engineering competencies with measurable milestones.",
      progress: 50,
      status: "IN_PROGRESS",
      targetDate: "2026-11-15",
      department: "Engineering & Product",
    },
  ]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Strategic HR & Organizational Improvement Goals
          </h2>
          <p className="text-xs text-slate-500">
            Track key HR performance indicators and systemic interventions initiated in response to employee feedback
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    goal.status === "COMPLETED"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{goal.title}</h3>
                  <span className="text-[11px] text-indigo-600 font-semibold block mt-0.5">
                    {goal.department}
                  </span>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  goal.status === "COMPLETED"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {goal.status === "COMPLETED" ? "Completed" : "In Progress"}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{goal.description}</p>

            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Completion Progress</span>
                <span className="text-slate-800">{goal.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    goal.progress === 100 ? "bg-emerald-500" : "bg-indigo-600"
                  }`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Target Date: {goal.targetDate}
              </span>
              <span className="font-semibold text-slate-600">Q3-Q4 OKR</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
