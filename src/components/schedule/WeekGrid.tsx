"use client";

import { Employee, Shift, Leave, DAY_NAMES, HOURS_START, HOURS_END, getWeekDates } from "@/types";
import DayColumn from "./DayColumn";

interface Props {
  weekStart: string;
  shifts: Shift[];
  leaves: Leave[];
  employees: Employee[];
  onUpdateShift: (id: number, data: Partial<Shift>) => void;
  onDeleteShift: (id: number) => void;
  onEditLeave: (leave: Leave) => void;
  onDeleteLeave: (id: number) => void;
}

export default function WeekGrid({ weekStart, shifts, leaves, employees, onUpdateShift, onDeleteShift, onEditLeave, onDeleteLeave }: Props) {
  const dates = getWeekDates(weekStart);
  const hours: number[] = [];
  for (let h = HOURS_START; h < HOURS_END; h++) hours.push(h);

  return (
    <div className="flex gap-1.5 min-h-full">
      {/* Time labels */}
      <div className="w-12 shrink-0 pt-[52px]">
        {hours.map((h) => (
          <div key={h} className="h-16 flex items-start justify-end pr-2">
            <span className="text-[11px] text-muted-foreground font-mono -mt-2">
              {h.toString().padStart(2, "0")}h
            </span>
          </div>
        ))}
      </div>

      {/* Day columns */}
      {DAY_NAMES.map((dayName, dayIndex) => (
        <DayColumn
          key={dayIndex}
          dayName={dayName}
          dayIndex={dayIndex}
          date={dates[dayIndex]}
          hours={hours}
          shifts={shifts.filter((s) => s.day_of_week === dayIndex)}
          leaves={leaves.filter((l) => l.date === dates[dayIndex])}
          employees={employees}
          onUpdateShift={onUpdateShift}
          onDeleteShift={onDeleteShift}
          onEditLeave={onEditLeave}
          onDeleteLeave={onDeleteLeave}
        />
      ))}
    </div>
  );
}
