"use client";

import { useState } from "react";
import { Employee, Shift, Leave, shiftDurationHours } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Users } from "lucide-react";
import EmployeeCard from "./EmployeeCard";
import EmployeeFormDialog from "./EmployeeFormDialog";
import * as store from "@/lib/store";

interface Props {
  employees: Employee[];
  shifts: Shift[];
  leaves: Leave[];
  onUpdate: () => void;
}

export default function EmployeeSidebar({ employees, shifts, leaves, onUpdate }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const getScheduledHours = (empId: number) =>
    shifts
      .filter((s) => s.employee_id === empId)
      .reduce((acc, s) => acc + shiftDurationHours(s.start_time, s.end_time), 0);

  const getLeaveDays = (empId: number) =>
    leaves.filter((l) => l.employee_id === empId).reduce((acc, l) => acc + (l.half_day === "full" ? 1 : 0.5), 0);

  const handleSave = (data: Omit<Employee, "id">) => {
    if (editingEmployee) {
      store.updateEmployee(editingEmployee.id, data);
    } else {
      store.addEmployee(data);
    }
    setDialogOpen(false);
    setEditingEmployee(null);
    onUpdate();
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    store.deleteEmployee(id);
    onUpdate();
  };

  const handleOpenNew = () => {
    setEditingEmployee(null);
    setDialogOpen(true);
  };

  return (
    <aside className="w-72 border-r border-border flex flex-col bg-sidebar">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Équipe</h2>
          </div>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleOpenNew}>
            <Plus size={15} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {employees.length} employé{employees.length !== 1 ? "s" : ""}
        </p>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-3">
        <div className="space-y-2">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              scheduledHours={getScheduledHours(emp.id)}
              leaveDays={getLeaveDays(emp.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          {employees.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="h-12 w-12 mx-auto rounded-xl bg-muted flex items-center justify-center mb-3">
                <Users size={20} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">Aucun employé</p>
              <Button size="sm" variant="outline" onClick={handleOpenNew}>
                <Plus size={14} className="mr-1.5" /> Ajouter
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <EmployeeFormDialog
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingEmployee(null); }}
        employee={editingEmployee}
        onSave={handleSave}
      />
    </aside>
  );
}
