"use client";

import { useDraggable } from "@dnd-kit/core";
import { Employee, formatHours } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  employee: Employee;
  scheduledHours: number;
  leaveDays: number;
  onEdit: (emp: Employee) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeCard({ employee, scheduledHours, leaveDays, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `employee-${employee.id}`,
    data: { employeeId: employee.id },
  });

  const diff = scheduledHours - employee.weekly_hours;
  const pct = employee.weekly_hours > 0 ? Math.min((scheduledHours / employee.weekly_hours) * 100, 100) : 0;
  const status: "ok" | "over" | "under" =
    Math.abs(diff) < 0.5 ? "ok" : diff > 0 ? "over" : "under";

  const statusColor = { ok: "#22c55e", over: "#ef4444", under: "#f59e0b" }[status];
  const statusLabel = { ok: "✓ Complet", over: `+${formatHours(Math.abs(diff))}`, under: `-${formatHours(Math.abs(diff))}` }[status];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      title={`${employee.name} — ${formatHours(scheduledHours)} planifié sur ${formatHours(employee.weekly_hours)} contractuel`}
      className={`employee-drag group rounded-xl border border-border bg-card p-3 animate-fade-in ${isDragging ? "opacity-40 scale-95" : ""}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-offset-1 ring-offset-card" style={{ backgroundColor: employee.color }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{employee.name}</p>
          {employee.role && <p className="text-[11px] text-muted-foreground truncate">{employee.role}</p>}
        </div>
        <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(employee); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(employee.id); }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-mono">
          {formatHours(scheduledHours)}/{formatHours(employee.weekly_hours)}
          {leaveDays > 0 && <span className="ml-1 text-amber-400">🏖️{leaveDays}j</span>}
        </span>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-medium border-0" style={{ color: statusColor, backgroundColor: `${statusColor}15` }}>
          {statusLabel}
        </Badge>
      </div>

      <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: statusColor }}
        />
      </div>
    </div>
  );
}
