"use client";

import { useState } from "react";
import { Employee, ShiftWithEmployee, shiftDurationHours, formatHours } from "@/types";
import EmployeeCard from "./EmployeeCard";
import EmployeeForm from "./EmployeeForm";
import { Plus } from "lucide-react";

interface Props {
  employees: Employee[];
  shifts: ShiftWithEmployee[];
  weekStart: string;
  onUpdate: () => void;
}

export default function EmployeeSidebar({ employees, shifts, weekStart, onUpdate }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const getEmployeeHours = (empId: number) => {
    return shifts
      .filter((s) => s.employee_id === empId)
      .reduce((acc, s) => acc + shiftDurationHours(s.start_time, s.end_time), 0);
  };

  const handleSave = async (data: Partial<Employee>) => {
    if (editingEmployee) {
      await fetch("/api/employees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingEmployee, ...data }),
      });
    } else {
      await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setShowForm(false);
    setEditingEmployee(null);
    onUpdate();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
    onUpdate();
  };

  return (
    <aside className="w-72 border-r border-border flex flex-col bg-bg-secondary/50">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Employés
          </h2>
          <button
            onClick={() => { setEditingEmployee(null); setShowForm(true); }}
            className="p-1.5 rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <p className="text-xs text-text-muted">{employees.length} employé{employees.length !== 1 ? "s" : ""}</p>
      </div>

      {(showForm || editingEmployee) && (
        <div className="p-4 border-b border-border animate-fade-in">
          <EmployeeForm
            employee={editingEmployee}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingEmployee(null); }}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {employees.map((emp) => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            scheduledHours={getEmployeeHours(emp.id)}
            onEdit={(e) => { setEditingEmployee(e); setShowForm(true); }}
            onDelete={handleDelete}
          />
        ))}
        {employees.length === 0 && (
          <p className="text-sm text-text-muted text-center py-8">
            Aucun employé. Clique sur + pour commencer.
          </p>
        )}
      </div>
    </aside>
  );
}
