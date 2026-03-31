"use client";

import { getWeekDates } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

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
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onToday} className="text-xs gap-1.5">
        <CalendarDays size={13} />
        Aujourd&apos;hui
      </Button>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onPrev}>
          <ChevronLeft size={16} />
        </Button>
        <span className="text-sm font-medium text-foreground min-w-[180px] text-center">
          {fmt(monday)} — {fmt(sunday)} {sunday.getFullYear()}
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNext}>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
