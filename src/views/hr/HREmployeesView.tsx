import React, { useEffect, useState } from "react";
import { Department, Employee } from "../../types";
import { api } from "../../services/api";
import {
  CheckCircle2,
  Edit2,
  Eye,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { RiskBadge } from "../../components/Badges";
import { AddEmployeeModal } from "../../components/AddEmployeeModal";

interface HREmployeesViewProps {
  departments: Department[];
  onViewEmployeeProfile: (id: string) => void;
}

export const HREmployeesView: React.FC<HREmployeesViewProps> = ({
  departments,
  onViewEmployeeProfile,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  useEffect(() => {
    loadEmployees();
  }, [departmentId]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployees({
        search,
        departmentId,
      });
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadEmployees();
  };

  const handleToggleStatus = async (emp: Employee) => {
    const newStatus = emp.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await api.updateEmployee(emp.id, { status: newStatus });
      setEmployees((prev) =>
        prev.map((item) => (item.id === emp.id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      alert("Failed to update employee status");
    }
  };

  const handleAddEmployee = async (data: any) => {
    await api.addEmployee(data);
    loadEmployees();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Employee Directory & Workforce Management
          </h2>
          <p className="text-xs text-slate-500">
            Manage profiles, monitor individual risk factors, evaluate performance, and configure roles
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, designation, employee ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-xs"
          />
        </form>

        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-xs font-medium"
        >
          <option value="ALL">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Name & Avatar</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Performance</th>
                <th className="py-3 px-4">AI Risk Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Loading directory records...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No employees found matching criteria.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-500 whitespace-nowrap">
                      {emp.employeeCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{emp.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {emp.departmentName || "General"}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {emp.designation}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {emp.experienceYears} yrs
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                      {emp.performanceScore}%
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <RiskBadge risk={emp.riskLevel} burnout={emp.burnoutRisk} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          emp.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewEmployeeProfile(emp.id)}
                          className="px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-md border border-indigo-200 transition-colors"
                          title="View Profile & Feedback History"
                        >
                          Profile & History
                        </button>
                        <button
                          onClick={() => handleToggleStatus(emp)}
                          className={`px-2 py-1 text-xs font-semibold rounded-md border transition-colors ${
                            emp.status === "ACTIVE"
                              ? "text-rose-600 border-rose-200 hover:bg-rose-50"
                              : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          }`}
                        >
                          {emp.status === "ACTIVE" ? "Deactivate" : "Activate"}
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

      {showAddModal && (
        <AddEmployeeModal
          departments={departments}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddEmployee}
        />
      )}
    </div>
  );
};
