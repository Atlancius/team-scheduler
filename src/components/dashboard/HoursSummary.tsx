"use client";

import { Employee, ShiftWithEmployee, shiftDurationHours, formatHours, DAY_NAMES } from "@/types";
import { Clock, Users, TrendingUp } from "lucide-react";

interface Props {
  employees: Employee[];
  shifts: ShiftWithEmployee[];
}

export default function HoursSummary({ employees, shifts }: Props) {
  const totalScheduled = shifts.reduce(
    (acc, s) => acc + shiftDurationHours(s.start_time, s.end_time),
    0
  );
  const totalContracted = employees.reduce((acc, e) => acc + e.weekly_hours, 0);

  // Per-day totals
  const dayTotals = DAY_NAMES.map((_, i) =>
    shifts
      .filter((s) => s.day_of_week === i)
      .reduce((acc, s) => acc + shiftDurationHours(s.start_time, s.end_time), 0)
  );

  const employeesOverHours = employees.filter((e) => {
    const scheduled = shifts
      .filter((s) => s.employee_id === e.id)
      .reduce((acc, s) => acc + shiftDurationHours(s.start_time, s.end_time), 0);
    return scheduled > e.weekly_hours + 0.5;
  }).length;

  if (employees.length === 0) return null;

  return (
    <div className="px-6 py-3 border-b border-border flex items-center gap-6 overflow-x-auto">
      {/* Total hours */}
      <div className="flex items-center gap-2 shrink-0">
        <Clock size={16} className="text-accent" />
        <div>
          <span className="text-sm font-semibold text-text-primary">
            {formatHours(totalScheduled)}
          </span>
          <span className="text-xs text-text-muted"> / {formatHours(totalContracted)}</span>
        </div>
      </div>

      {/* Employees count */}
      <div className="flex items-center gap-2 shrink-0">
        <Users size={16} className="text-text-muted" />
        <span className="text-xs text-text-muted">
          {employees.length} employé{employees.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Over hours alert */}
      {employeesOverHours > 0 && (
        <div className="flex items-center gap-2 shrink-0">
          <TrendingUp size={16} className="text-danger" />
          <span className="text-xs text-danger font-medium">
            {employeesOverHours} en dépassement
          </span>
        </div>
      )}

      {/* Separator */}
      <div className="h-6 w-px bg-border shrink-0" />

      {/* Per-day mini bars */}
      <div className="flex items-center gap-3">
        {DAY_NAMES.map((name, i) => (
          <div key={i} className="text-center">
            <div className="text-[10px] text-text-muted">{name}</div>
            <div className="text-xs font-medium text-text-secondary">
              {dayTotals[i] > 0 ? formatHours(dayTotals[i]) : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
