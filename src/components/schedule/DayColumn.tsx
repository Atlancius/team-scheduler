"use client";

import { useDroppable } from "@dnd-kit/core";
import { Employee, Shift, Leave, HOURS_START, shiftDurationHours, formatHours } from "@/types";
import { layoutShifts } from "@/lib/overlap";
import ShiftBlock from "./ShiftBlock";
import LeaveBlock from "./LeaveBlock";

interface Props {
  dayName: string;
  dayIndex: number;
  date: string;
  hours: number[];
  shifts: Shift[];
  leaves: Leave[];
  employees: Employee[];
  onUpdateShift: (id: number, data: Partial<Shift>) => void;
  onDeleteShift: (id: number) => void;
  onEditLeave: (leave: Leave) => void;
  onDeleteLeave: (id: number) => void;
}

function TimeSlot({ dayIndex, hour }: { dayIndex: number; hour: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${dayIndex}-${hour}`,
    data: { dayOfWeek: dayIndex, hour },
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-16 border-t border-border/40 drop-zone ${isOver ? "drop-zone-active" : ""}`}
    />
  );
}

export default function DayColumn({
  dayName,
  dayIndex,
  date,
  hours,
  shifts,
  leaves,
  employees,
  onUpdateShift,
  onDeleteShift,
  onEditLeave,
  onDeleteLeave,
}: Props) {
  const isToday = date === new Date().toISOString().split("T")[0];
  const dayTotal = shifts.reduce((acc, s) => acc + shiftDurationHours(s.start_time, s.end_time), 0);
  const d = new Date(date);
  const dayNum = d.getDate();
  const isWeekend = dayIndex >= 5;
  const hasLeaves = leaves.length > 0;

  const enriched = shifts.map((s) => {
    const emp = employees.find((e) => e.id === s.employee_id);
    return {
      ...s,
      employee_name: emp?.name || "?",
      employee_color: emp?.color || "#666",
      employee_weekly_hours: emp?.weekly_hours || 0,
    };
  });

  const layouted = layoutShifts(enriched);

  return (
    <div className={`flex-1 min-w-[120px] ${isWeekend ? "opacity-80" : ""}`}>
      {/* Header */}
      <div className={`text-center py-2 rounded-xl mb-1.5 border transition-colors ${
        isToday
          ? "bg-primary/10 border-primary/30 shadow-sm shadow-primary/10"
          : "bg-card border-border"
      }`}>
        <div className="text-[11px] text-muted-foreground font-medium">{dayName}</div>
        <div className={`text-lg font-bold ${isToday ? "text-primary" : "text-foreground"}`}>
          {dayNum}
        </div>
        <div className="flex items-center justify-center gap-1">
          {dayTotal > 0 && (
            <span className="text-[10px] text-muted-foreground font-mono">{formatHours(dayTotal)}</span>
          )}
          {hasLeaves && <span className="text-[10px]">🏖️</span>}
        </div>
      </div>

      {/* Leave blocks above the grid */}
      {hasLeaves && (
        <div className="mb-1">
          {leaves.map((leave) => (
            <LeaveBlock
              key={leave.id}
              leave={leave}
              employee={employees.find((e) => e.id === leave.employee_id)}
              onEdit={onEditLeave}
              onDelete={onDeleteLeave}
            />
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="relative rounded-xl border border-border bg-card/50 overflow-hidden">
        {hours.map((h) => (
          <TimeSlot key={h} dayIndex={dayIndex} hour={h} />
        ))}

        {layouted.map((shift) => (
          <ShiftBlock
            key={shift.id}
            shift={shift}
            column={shift.column}
            totalColumns={shift.totalColumns}
            onUpdate={onUpdateShift}
            onDelete={onDeleteShift}
          />
        ))}
      </div>
    </div>
  );
}
