"use client";

import { Employee } from "@/types";

interface Props {
  employee: Employee;
}

export default function EmployeeDragOverlay({ employee }: Props) {
  return (
    <div className="glass rounded-xl p-3 w-64 shadow-2xl opacity-90">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: employee.color }} />
        <span className="text-sm font-medium text-text-primary">{employee.name}</span>
      </div>
    </div>
  );
}
