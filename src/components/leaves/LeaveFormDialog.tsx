"use client";

import { useState, useEffect } from "react";
import { Employee, Leave, LeaveType, LEAVE_LABELS, LEAVE_ICONS, getWeekDates, DAY_FULL } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  weekStart: string;
  editLeave?: Leave | null;
  onSave: (data: Omit<Leave, "id">) => void;
}

const LEAVE_TYPES: LeaveType[] = ["conge", "maladie", "rtt", "formation", "autre"];
const HALF_OPTIONS = [
  { value: "full" as const, label: "Journée entière" },
  { value: "am" as const, label: "Matin seulement" },
  { value: "pm" as const, label: "Après-midi seulement" },
];

export default function LeaveFormDialog({ open, onOpenChange, employees, weekStart, editLeave, onSave }: Props) {
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [date, setDate] = useState("");
  const [type, setType] = useState<LeaveType>("conge");
  const [halfDay, setHalfDay] = useState<"full" | "am" | "pm">("full");
  const [note, setNote] = useState("");

  const dates = getWeekDates(weekStart);

  useEffect(() => {
    if (open) {
      if (editLeave) {
        setEmployeeId(editLeave.employee_id);
        setDate(editLeave.date);
        setType(editLeave.type);
        setHalfDay(editLeave.half_day);
        setNote(editLeave.note);
      } else {
        setEmployeeId(employees[0]?.id || 0);
        setDate(dates[0]);
        setType("conge");
        setHalfDay("full");
        setNote("");
      }
    }
  }, [open, editLeave, employees, dates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !date) return;
    onSave({ employee_id: employeeId, date, type, half_day: halfDay, note });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editLeave ? "Modifier le congé" : "Ajouter un congé"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Employee select */}
          <div className="space-y-2">
            <Label>Employé</Label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md bg-secondary border border-input text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* Date — quick pick from current week or custom */}
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="flex gap-1 flex-wrap mb-2">
              {dates.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDate(d)}
                  className={cn(
                    "px-2 py-1 rounded-md text-xs transition-colors",
                    date === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  {DAY_FULL[i].slice(0, 3)} {new Date(d).getDate()}
                </button>
              ))}
            </div>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          {/* Leave type */}
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {LEAVE_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                    type === t
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>{LEAVE_ICONS[t]}</span>
                  <span>{LEAVE_LABELS[t]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Half day */}
          <div className="space-y-2">
            <Label>Durée</Label>
            <div className="flex gap-1.5">
              {HALF_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setHalfDay(opt.value)}
                  className={cn(
                    "flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all border",
                    halfDay === opt.value
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label>Note <span className="text-muted-foreground font-normal">(optionnel)</span></Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex: vacances famille…" />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {editLeave ? "Enregistrer" : "Ajouter"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
