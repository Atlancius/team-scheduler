"use client";

import { Employee, Shift, Leave, shiftDurationHours, formatHours, DAY_NAMES } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, AlertTriangle, Palmtree } from "lucide-react";

interface Props {
  employees: Employee[];
  shifts: Shift[];
  leaves: Leave[];
}

export default function HoursSummary({ employees, shifts, leaves }: Props) {
  if (employees.length === 0) return null;

  const totalScheduled = shifts.reduce(
    (acc, s) => acc + shiftDurationHours(s.start_time, s.end_time), 0
  );
  const totalContracted = employees.reduce((acc, e) => acc + e.weekly_hours, 0);
  const totalLeaveDays = leaves.reduce((acc, l) => acc + (l.half_day === "full" ? 1 : 0.5), 0);

  const dayTotals = DAY_NAMES.map((_, i) =>
    shifts.filter((s) => s.day_of_week === i)
      .reduce((acc, s) => acc + shiftDurationHours(s.start_time, s.end_time), 0)
  );

  const employeesOver = employees.filter((e) => {
    const scheduled = shifts.filter((s) => s.employee_id === e.id)
      .reduce((acc, s) => acc + shiftDurationHours(s.start_time, s.end_time), 0);
    return scheduled > e.weekly_hours + 0.5;
  });

  const onLeave = new Set(leaves.map((l) => l.employee_id)).size;

  const pct = totalContracted > 0 ? Math.min((totalScheduled / totalContracted) * 100, 100) : 0;

  return (
    <div className="px-6 py-3 border-b border-border bg-card/30 flex items-center gap-5 overflow-x-auto">
      {/* Total progress */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Clock size={15} className="text-primary" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-foreground font-mono">{formatHours(totalScheduled)}</span>
            <span className="text-xs text-muted-foreground">/ {formatHours(totalContracted)}</span>
          </div>
          <div className="w-24 h-1 rounded-full bg-muted mt-1 overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Employees */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Users size={13} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{employees.length}</span>
      </div>

      {/* Leave count */}
      {totalLeaveDays > 0 && (
        <div className="flex items-center gap-1.5 shrink-0">
          <Palmtree size={13} className="text-amber-400" />
          <span className="text-xs text-amber-400 font-medium">
            {totalLeaveDays}j ({onLeave} pers.)
          </span>
        </div>
      )}

      {/* Over-hours alert */}
      {employeesOver.length > 0 && (
        <Badge variant="destructive" className="text-[10px] gap-1 shrink-0">
          <AlertTriangle size={10} />
          {employeesOver.length} en dépassement
        </Badge>
      )}

      <Separator orientation="vertical" className="h-6 shrink-0" />

      {/* Per-day mini stats */}
      <div className="flex items-center gap-3">
        {DAY_NAMES.map((name, i) => {
          const maxDay = Math.max(...dayTotals, 1);
          const barH = dayTotals[i] > 0 ? Math.max((dayTotals[i] / maxDay) * 20, 3) : 0;
          return (
            <div key={i} className="text-center flex flex-col items-center gap-0.5">
              <div className="text-[10px] text-muted-foreground">{name}</div>
              <div className="w-5 h-5 flex items-end justify-center">
                {barH > 0 && (
                  <div className="w-3 rounded-sm bg-primary/60 transition-all duration-300" style={{ height: `${barH}px` }} />
                )}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">
                {dayTotals[i] > 0 ? formatHours(dayTotals[i]) : "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
