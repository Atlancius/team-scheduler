"use client";

import { useDroppable } from "@dnd-kit/core";
import { Employee, ShiftWithEmployee, HOURS_START, HOURS_END, shiftDurationHours, formatHours } from "@/types";
import ShiftBlock from "./ShiftBlock";

interface Props {
  dayName: string;
  dayIndex: number;
  date: string;
  hours: number[];
  shifts: ShiftWithEmployee[];
  employees: Employee[];
  onUpdateShift: (id: number, data: Partial<ShiftWithEmployee>) => void;
  onDeleteShift: (id: number) => void;
}

function TimeSlot({ dayIndex, hour }: { dayIndex: number; hour: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${dayIndex}-${hour}`,
    data: { dayOfWeek: dayIndex, hour },
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-16 border-t border-border/30 drop-zone ${isOver ? "drop-zone-active" : ""}`}
    />
  );
}

export default function DayColumn({
  dayName,
  dayIndex,
  date,
  hours,
  shifts,
  employees,
  onUpdateShift,
  onDeleteShift,
}: Props) {
  const isToday = date === new Date().toISOString().split("T")[0];
  const dayTotal = shifts.reduce((acc, s) => acc + shiftDurationHours(s.start_time, s.end_time), 0);
  const d = new Date(date);
  const dayNum = d.getDate();

  return (
    <div className="flex-1 min-w-[120px]">
      {/* Day header */}
      <div
        className={`text-center py-2 rounded-t-xl mb-1 ${
          isToday ? "bg-accent/20 border border-accent/40" : "glass"
        }`}
      >
        <div className="text-xs text-text-muted">{dayName}</div>
        <div className={`text-lg font-bold ${isToday ? "text-accent" : "text-text-primary"}`}>
          {dayNum}
        </div>
        {dayTotal > 0 && (
          <div className="text-xs text-text-muted">{formatHours(dayTotal)}</div>
        )}
      </div>

      {/* Time slots container (relative for absolute shift blocks) */}
      <div className="relative glass rounded-b-xl overflow-hidden">
        {/* Background time slots (droppable) */}
        {hours.map((h) => (
          <TimeSlot key={h} dayIndex={dayIndex} hour={h} />
        ))}

        {/* Shift blocks (absolute positioned) */}
        {shifts.map((shift) => (
          <ShiftBlock
            key={shift.id}
            shift={shift}
            onUpdate={onUpdateShift}
            onDelete={onDeleteShift}
          />
        ))}
      </div>
    </div>
  );
}
