"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Employee, Shift, Leave, getWeekMonday, addWeeks } from "@/types";
import * as store from "@/lib/store";
import EmployeeSidebar from "@/components/employees/EmployeeSidebar";
import WeekGrid from "@/components/schedule/WeekGrid";
import WeekNavigation from "@/components/schedule/WeekNavigation";
import HoursSummary from "@/components/dashboard/HoursSummary";
import EmployeeDragOverlay from "@/components/employees/EmployeeDragOverlay";
import LeaveFormDialog from "@/components/leaves/LeaveFormDialog";
import { Button } from "@/components/ui/button";
import { Palmtree } from "lucide-react";

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [weekStart, setWeekStart] = useState(() => getWeekMonday(new Date()));
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);
  const [mounted, setMounted] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const reload = useCallback(() => {
    setEmployees(store.getEmployees());
    setShifts(store.getShifts(weekStart));
    setLeaves(store.getLeaves(weekStart));
  }, [weekStart]);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (mounted) reload(); }, [mounted, reload]);

  const handleDragStart = (event: DragStartEvent) => {
    const empId = event.active.data.current?.employeeId;
    if (empId !== undefined) {
      setActiveEmployee(employees.find((e) => e.id === empId) || null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
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

    store.addShift({
      employee_id: employeeId,
      week_start: weekStart,
      day_of_week: dayOfWeek,
      start_time,
      end_time,
    });
    reload();
  };

  const handleUpdateShift = (id: number, data: Partial<Shift>) => {
    store.updateShift(id, data);
    reload();
  };

  const handleDeleteShift = (id: number) => {
    store.deleteShift(id);
    reload();
  };

  const handleSaveLeave = (data: Omit<Leave, "id">) => {
    if (editingLeave) {
      store.updateLeave(editingLeave.id, data);
    } else {
      store.addLeave(data);
    }
    setLeaveDialogOpen(false);
    setEditingLeave(null);
    reload();
  };

  const handleEditLeave = (leave: Leave) => {
    setEditingLeave(leave);
    setLeaveDialogOpen(true);
  };

  const handleDeleteLeave = (id: number) => {
    store.deleteLeave(id);
    reload();
  };

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground text-sm">Chargement...</div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen overflow-hidden">
        <EmployeeSidebar
          employees={employees}
          shifts={shifts}
          leaves={leaves}
          onUpdate={reload}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/50">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-lg">📅</span>
              </div>
              <div>
                <h1 className="text-base font-semibold text-foreground">Team Scheduler</h1>
                <p className="text-xs text-muted-foreground">Planning hebdomadaire</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={() => { setEditingLeave(null); setLeaveDialogOpen(true); }}
              >
                <Palmtree size={13} />
                Congé
              </Button>
              <WeekNavigation
                weekStart={weekStart}
                onPrev={() => setWeekStart(addWeeks(weekStart, -1))}
                onNext={() => setWeekStart(addWeeks(weekStart, 1))}
                onToday={() => setWeekStart(getWeekMonday(new Date()))}
              />
            </div>
          </header>
          <HoursSummary employees={employees} shifts={shifts} leaves={leaves} />
          <div className="flex-1 overflow-auto p-4">
            <WeekGrid
              weekStart={weekStart}
              shifts={shifts}
              leaves={leaves}
              employees={employees}
              onUpdateShift={handleUpdateShift}
              onDeleteShift={handleDeleteShift}
              onEditLeave={handleEditLeave}
              onDeleteLeave={handleDeleteLeave}
            />
          </div>
        </main>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeEmployee ? <EmployeeDragOverlay employee={activeEmployee} /> : null}
      </DragOverlay>
      <LeaveFormDialog
        open={leaveDialogOpen}
        onOpenChange={(open) => { setLeaveDialogOpen(open); if (!open) setEditingLeave(null); }}
        employees={employees}
        weekStart={weekStart}
        editLeave={editingLeave}
        onSave={handleSaveLeave}
      />
    </DndContext>
  );
}
