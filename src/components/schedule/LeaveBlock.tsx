"use client";

import { Leave, Employee, LEAVE_LABELS, LEAVE_COLORS, LEAVE_ICONS } from "@/types";
import { X } from "lucide-react";

interface Props {
  leave: Leave;
  employee: Employee | undefined;
  onEdit: (leave: Leave) => void;
  onDelete: (id: number) => void;
}

export default function LeaveBlock({ leave, employee, onEdit, onDelete }: Props) {
  const color = LEAVE_COLORS[leave.type];
  const icon = LEAVE_ICONS[leave.type];
  const label = LEAVE_LABELS[leave.type];
  const isHalf = leave.half_day !== "full";
  const halfLabel = leave.half_day === "am" ? "Matin" : leave.half_day === "pm" ? "Après-midi" : "";

  return (
    <div
      className="rounded-lg border-2 border-dashed p-2 cursor-pointer transition-all hover:brightness-110 mb-1"
      style={{
        borderColor: color,
        backgroundColor: `${color}15`,
      }}
      onClick={() => onEdit(leave)}
      title={`${employee?.name} — ${label}${isHalf ? ` (${halfLabel})` : ""}${leave.note ? ` — ${leave.note}` : ""}`}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs">{icon}</span>
          <span className="text-[11px] font-semibold truncate" style={{ color }}>
            {employee?.name}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(leave.id); }}
          className="p-0.5 rounded hover:bg-black/10 shrink-0 transition-colors"
          style={{ color }}
        >
          <X size={11} />
        </button>
      </div>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="text-[10px] font-medium" style={{ color }}>{label}</span>
        {isHalf && (
          <span className="text-[9px] px-1 py-0 rounded-full bg-black/10" style={{ color }}>
            {halfLabel}
          </span>
        )}
      </div>
      {leave.note && (
        <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{leave.note}</p>
      )}
    </div>
  );
}
