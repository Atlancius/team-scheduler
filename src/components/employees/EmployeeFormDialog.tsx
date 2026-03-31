"use client";

import { useState, useEffect } from "react";
import { Employee, EMPLOYEE_COLORS } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (data: Omit<Employee, "id">) => void;
}

export default function EmployeeFormDialog({ open, onOpenChange, employee, onSave }: Props) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [color, setColor] = useState(EMPLOYEE_COLORS[0]);
  const [weeklyHours, setWeeklyHours] = useState(35);

  useEffect(() => {
    if (open) {
      setName(employee?.name || "");
      setRole(employee?.role || "");
      setColor(employee?.color || EMPLOYEE_COLORS[Math.floor(Math.random() * EMPLOYEE_COLORS.length)]);
      setWeeklyHours(employee?.weekly_hours ?? 35);
    }
  }, [open, employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), role: role.trim(), color, weekly_hours: weeklyHours });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{employee ? "Modifier l'employé" : "Nouvel employé"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Prénom Nom" autoFocus />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Poste <span className="text-muted-foreground font-normal">(optionnel)</span></Label>
            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ex: Serveur, Chef…" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Heures / semaine</Label>
            <Input
              id="hours"
              type="number"
              min={0}
              max={80}
              step={0.5}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Couleur</Label>
            <div className="flex gap-2 flex-wrap">
              {EMPLOYEE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-7 h-7 rounded-full transition-all duration-150",
                    color === c ? "ring-2 ring-ring ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {employee ? "Enregistrer" : "Ajouter"}
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
