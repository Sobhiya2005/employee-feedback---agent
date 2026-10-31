import React, { useEffect, useState } from "react";
import { Department } from "../../types";
import { api } from "../../services/api";
import {
  Building2,
  DollarSign,
  Edit2,
  HeartHandshake,
  MessageSquare,
  Plus,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { AddDepartmentModal } from "../../components/AddDepartmentModal";

export const HRDepartmentsView: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await api.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (data: any) => {
    await api.addDepartment(data);
    loadDepartments();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    try {
      await api.updateDepartment(editingDept.id, {
        name: editingDept.name,
        code: editingDept.code,
        managerName: editingDept.managerName,
        budgetAllocated: editingDept.budgetAllocated,
        description: editingDept.description,
      });
      setEditingDept(null);
      loadDepartments();
    } catch (err) {
      alert("Failed to update department");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Departments & Organizational Units
          </h2>
          <p className="text-xs text-slate-500">
            Monitor satisfaction, employee distribution, feedback density, and leadership by department
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold text-xs">
                    {dept.code}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{dept.name}</h3>
                    <p className="text-[11px] text-slate-400">Lead: {dept.managerName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingDept(dept)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Edit Department"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2">{dept.description}</p>

              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    Employees
                  </span>
                  <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                    <Users className="w-3 h-3 text-slate-400" />
                    {dept.employeeCount || 0}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    Feedback
                  </span>
                  <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                    <MessageSquare className="w-3 h-3 text-slate-400" />
                    {dept.feedbackCount || 0}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    Satisfaction
                  </span>
                  <span className="text-sm font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
                    <HeartHandshake className="w-3 h-3 text-emerald-500" />
                    {dept.satisfactionScore || 75}%
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Budget: ${dept.budgetAllocated?.toLocaleString() || "250,000"}</span>
              <span className="font-semibold text-indigo-600">Active Unit</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddDepartmentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDepartment}
        />
      )}

      {/* Edit Department Modal */}
      {editingDept && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Edit Department</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Name</label>
                <input
                  type="text"
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Code</label>
                <input
                  type="text"
                  value={editingDept.code}
                  onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Manager Lead</label>
                <input
                  type="text"
                  value={editingDept.managerName}
                  onChange={(e) => setEditingDept({ ...editingDept, managerName: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingDept.description}
                  onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
