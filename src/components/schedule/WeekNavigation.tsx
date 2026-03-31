"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { getWeekDates } from "@/types";

interface Props {
  weekStart: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function WeekNavigation({ weekStart, onPrev, onNext, onToday }: Props) {
  const dates = getWeekDates(weekStart);
  const monday = new Date(dates[0]);
  const sunday = new Date(dates[6]);

  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToday}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-tertiary hover:bg-border text-text-secondary hover:text-text-primary text-sm transition-colors"
      >
        <CalendarDays size={14} />
        Aujourd&apos;hui
      </button>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-medium text-text-primary min-w-[180px] text-center">
          {fmt(monday)} — {fmt(sunday)} {sunday.getFullYear()}
        </span>
        <button
          onClick={onNext}
          className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
