export interface Employee {
  id: number;
  name: string;
  role: string | null;
  color: string;
  weekly_hours: number;
  created_at: string;
}

export interface Shift {
  id: number;
  employee_id: number;
  week_start: string; // ISO date of Monday "YYYY-MM-DD"
  day_of_week: number; // 0=Monday, 6=Sunday
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  created_at: string;
}

export interface ShiftWithEmployee extends Shift {
  employee_name: string;
  employee_color: string;
  employee_weekly_hours: number;
}

export type DayName = "Lun" | "Mar" | "Mer" | "Jeu" | "Ven" | "Sam" | "Dim";

export const DAY_NAMES: DayName[] = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export const HOURS_START = 6;
export const HOURS_END = 22;

export function shiftDurationHours(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

export function formatHours(h: number): string {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return mins > 0 ? `${hrs}h${mins.toString().padStart(2, "0")}` : `${hrs}h`;
}

export function getWeekMonday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

export function addWeeks(dateStr: string, weeks: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().split("T")[0];
}

export function getWeekDates(mondayStr: string): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(mondayStr);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}
