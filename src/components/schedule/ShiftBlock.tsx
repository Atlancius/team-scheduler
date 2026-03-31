"use client";

import { useState, useRef, useCallback } from "react";
import { Shift, HOURS_START, HOURS_END, shiftDurationHours, formatHours } from "@/types";
import { ShiftLike } from "@/lib/overlap";
import { X, GripVertical } from "lucide-react";

interface Props {
  shift: ShiftLike;
  column: number;
  totalColumns: number;
  onUpdate: (id: number, data: Partial<Shift>) => void;
  onDelete: (id: number) => void;
}

const SLOT_HEIGHT = 64;

function timeToOffset(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return ((h - HOURS_START) + m / 60) * SLOT_HEIGHT;
}

function timeToHeight(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return ((eh * 60 + em - sh * 60 - sm) / 60) * SLOT_HEIGHT;
}

export default function ShiftBlock({ shift, column, totalColumns, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [startTime, setStartTime] = useState(shift.start_time);
  const [endTime, setEndTime] = useState(shift.end_time);
  const [resizing, setResizing] = useState(false);
  const resizeRef = useRef<{ startY: number; startEndTime: string } | null>(null);

  const top = timeToOffset(shift.start_time);
  const height = Math.max(timeToHeight(shift.start_time, shift.end_time), 28);
  const duration = shiftDurationHours(shift.start_time, shift.end_time);
  const leftPct = (column / totalColumns) * 100;
  const widthPct = (1 / totalColumns) * 100;

  const handleSave = () => {
    onUpdate(shift.id, { start_time: startTime, end_time: endTime });
    setEditing(false);
  };

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setResizing(true);
      resizeRef.current = { startY: e.clientY, startEndTime: shift.end_time };

      const onMove = (ev: MouseEvent) => {
        if (!resizeRef.current) return;
        const dy = ev.clientY - resizeRef.current.startY;
        const [eh, em] = resizeRef.current.startEndTime.split(":").map(Number);
        const totalMinutes = eh * 60 + em + Math.round(dy / SLOT_HEIGHT * 60);
        const snapped = Math.round(totalMinutes / 30) * 30;
        const newH = Math.floor(snapped / 60);
        const newM = snapped % 60;
        const [sh] = shift.start_time.split(":").map(Number);
        if (newH > sh && newH <= HOURS_END) {
          setEndTime(`${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`);
        }
      };

      const onUp = () => {
        setResizing(false);
        resizeRef.current = null;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        onUpdate(shift.id, { end_time: endTime });
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [shift, endTime, onUpdate]
  );

  if (editing) {
    return (
      <div
        className="absolute z-30 rounded-lg p-2 shadow-xl ring-2 ring-white/20"
        style={{
          top: `${top}px`,
          left: `calc(${leftPct}% + 2px)`,
          width: `calc(${widthPct}% - 4px)`,
          minHeight: `${height}px`,
          backgroundColor: shift.employee_color,
        }}
      >
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-white truncate">{shift.employee_name}</p>
          <div className="flex gap-1">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="flex-1 px-1.5 py-1 rounded-md bg-black/30 text-white text-xs border-none focus:outline-none focus:ring-1 focus:ring-white/30"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="flex-1 px-1.5 py-1 rounded-md bg-black/30 text-white text-xs border-none focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
          <div className="flex gap-1">
            <button onClick={handleSave} className="flex-1 px-2 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors">
              OK
            </button>
            <button onClick={() => { setEditing(false); setStartTime(shift.start_time); setEndTime(shift.end_time); }} className="px-2 py-1 rounded-md bg-black/20 hover:bg-black/30 text-white/80 text-xs transition-colors">
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      title={`${shift.employee_name} — ${shift.start_time} → ${shift.end_time} (${formatHours(duration)})`}
      className="absolute z-10 rounded-lg shift-block overflow-hidden select-none"
      style={{
        top: `${top}px`,
        left: `calc(${leftPct}% + 2px)`,
        width: `calc(${widthPct}% - 4px)`,
        height: `${resizing ? timeToHeight(shift.start_time, endTime) : height}px`,
        backgroundColor: shift.employee_color,
        minHeight: "28px",
      }}
      onClick={() => setEditing(true)}
    >
      <div className="p-1.5 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between gap-0.5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-white truncate leading-tight">
              {shift.employee_name}
            </p>
            <p className="text-[10px] text-white/70 font-mono">
              {shift.start_time}–{resizing ? endTime : shift.end_time}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(shift.id); }}
            className="p-0.5 rounded hover:bg-black/20 text-white/50 hover:text-white shrink-0 transition-colors"
          >
            <X size={11} />
          </button>
        </div>
        {height > 50 && (
          <p className="text-[10px] text-white/50 font-mono font-medium">{formatHours(duration)}</p>
        )}
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize flex items-center justify-center hover:bg-black/20 transition-colors"
      >
        <GripVertical size={9} className="text-white/30" />
      </div>
    </div>
  );
}
