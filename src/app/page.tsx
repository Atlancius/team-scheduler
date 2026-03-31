"use client";

import { useState, useEffect, useCallback } from "react";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Employee, ShiftWithEmployee, getWeekMonday, addWeeks } from "@/types";
import EmployeeSidebar from "@/components/employees/EmployeeSidebar";
import WeekGrid from "@/components/schedule/WeekGrid";
import WeekNavigation from "@/components/schedule/WeekNavigation";
import HoursSummary from "@/components/dashboard/HoursSummary";
import EmployeeDragOverlay from "@/components/employees/EmployeeDragOverlay";

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<ShiftWithEmployee[]>([]);
  const [weekStart, setWeekStart] = useState(() => getWeekMonday(new Date()));
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fetchEmployees = useCallback(async () => {
    const res = await fetch("/api/employees");
    setEmployees(await res.json());
  }, []);

  const fetchShifts = useCallback(async () => {
    const res = await fetch(`/api/shifts?week_start=${weekStart}`);
    setShifts(await res.json());
  }, [weekStart]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
  useEffect(() => { fetchShifts(); }, [fetchShifts]);

  const handleDragStart = (event: DragStartEvent) => {
    const empId = event.active.data.current?.employeeId;
    if (empId) {
      setActiveEmployee(employees.find((e) => e.id === empId) || null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveEmployee(null);
    const { active, over } = event;
    if (!over) return;

    const employeeId = active.data.current?.employeeId;
    const dayOfWeek = over.data.current?.dayOfWeek;
    const hour = over.data.current?.hour;

    if (employeeId === undefined || dayOfWeek === undefined || hour === undefined) return;

    const startH = Math.floor(hour);
    const startM = hour % 1 >= 0.5 ? "30" : "00";
    const endHour = startH + 3;
    const start_time = `${startH.toString().padStart(2, "0")}:${startM}`;
    const end_time = `${Math.min(endHour, 22).toString().padStart(2, "0")}:00`;

    const res = await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id: employeeId,
        week_start: weekStart,
        day_of_week: dayOfWeek,
        start_time,
        end_time,
      }),
    });

    if (res.ok) fetchShifts();
  };

  const updateShift = async (shiftId: number, data: Partial<ShiftWithEmployee>) => {
    const shift = shifts.find((s) => s.id === shiftId);
    if (!shift) return;

    const res = await fetch("/api/shifts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...shift, ...data }),
    });

    if (res.ok) fetchShifts();
  };

  const deleteShift = async (shiftId: number) => {
    const res = await fetch(`/api/shifts?id=${shiftId}`, { method: "DELETE" });
    if (res.ok) fetchShifts();
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen overflow-hidden">
        <EmployeeSidebar
          employees={employees}
          shifts={shifts}
          weekStart={weekStart}
          onUpdate={fetchEmployees}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h1 className="text-xl font-bold text-text-primary">📅 Team Scheduler</h1>
            <WeekNavigation
              weekStart={weekStart}
              onPrev={() => setWeekStart(addWeeks(weekStart, -1))}
              onNext={() => setWeekStart(addWeeks(weekStart, 1))}
              onToday={() => setWeekStart(getWeekMonday(new Date()))}
            />
          </header>
          <HoursSummary employees={employees} shifts={shifts} />
          <div className="flex-1 overflow-auto p-4">
            <WeekGrid
              weekStart={weekStart}
              shifts={shifts}
              employees={employees}
              onUpdateShift={updateShift}
              onDeleteShift={deleteShift}
            />
          </div>
        </main>
      </div>
      <DragOverlay>
        {activeEmployee ? <EmployeeDragOverlay employee={activeEmployee} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
