"use client";

import { Employee } from "@/types";

export default function EmployeeDragOverlay({ employee }: { employee: Employee }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 w-56 shadow-2xl opacity-90">
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: employee.color }} />
        <span className="text-sm font-medium text-foreground">{employee.name}</span>
      </div>
    </div>
  );
}
