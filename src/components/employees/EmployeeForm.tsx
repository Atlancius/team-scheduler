"use client";

import { useState } from "react";
import { Employee } from "@/types";

const COLORS = [
  "#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6",
  "#EC4899", "#06B6D4", "#F97316", "#14B8A6", "#6366F1",
];

interface Props {
  employee: Employee | null;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

export default function EmployeeForm({ employee, onSave, onCancel }: Props) {
  const [name, setName] = useState(employee?.name || "");
  const [role, setRole] = useState(employee?.role || "");
  const [color, setColor] = useState(employee?.color || COLORS[0]);
  const [weeklyHours, setWeeklyHours] = useState(employee?.weekly_hours ?? 35);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), role: role.trim() || null, color, weekly_hours: weeklyHours });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
        autoFocus
      />
      <input
        type="text"
        placeholder="Poste (optionnel)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
      />
      <div>
        <label className="text-xs text-text-muted mb-1 block">Heures / semaine</label>
        <input
          type="number"
          min={0}
          max={80}
          step={0.5}
          value={weeklyHours}
          onChange={(e) => setWeeklyHours(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border text-sm text-text-primary focus:outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="text-xs text-text-muted mb-1 block">Couleur</label>
        <div className="flex gap-1.5 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full transition-transform ${color === c ? "ring-2 ring-white ring-offset-2 ring-offset-bg-secondary scale-110" : ""}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-3 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors"
        >
          {employee ? "Modifier" : "Ajouter"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded-lg bg-bg-tertiary hover:bg-border text-text-secondary text-sm transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
