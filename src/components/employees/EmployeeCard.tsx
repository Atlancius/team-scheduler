"use client";

import { useDraggable } from "@dnd-kit/core";
import { Employee, formatHours } from "@/types";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  employee: Employee;
  scheduledHours: number;
  onEdit: (emp: Employee) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeCard({ employee, scheduledHours, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `employee-${employee.id}`,
    data: { employeeId: employee.id },
  });

  const diff = scheduledHours - employee.weekly_hours;
  const statusColor =
    Math.abs(diff) < 0.5 ? "text-success" : diff > 0 ? "text-danger" : "text-warning";

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`employee-draggable glass rounded-xl p-3 ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: employee.color }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{employee.name}</p>
          {employee.role && (
            <p className="text-xs text-text-muted truncate">{employee.role}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(employee); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 rounded hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(employee.id); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 rounded hover:bg-bg-tertiary text-text-muted hover:text-danger transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-text-muted">
          {formatHours(scheduledHours)} / {formatHours(employee.weekly_hours)}
        </span>
        <span className={`font-medium ${statusColor}`}>
          {diff > 0 ? "+" : ""}
          {formatHours(Math.abs(diff))} {Math.abs(diff) < 0.5 ? "✓" : diff > 0 ? "↑" : "↓"}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.min((scheduledHours / employee.weekly_hours) * 100, 100)}%`,
            backgroundColor:
              Math.abs(diff) < 0.5 ? "#22c55e" : diff > 0 ? "#ef4444" : "#f59e0b",
          }}
        />
      </div>
    </div>
  );
}
