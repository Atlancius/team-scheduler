export interface Employee {
  id: number;
  name: string;
  role: string;
  color: string;
  weekly_hours: number;
}

export interface Shift {
  id: number;
  employee_id: number;
  week_start: string; // ISO date of Monday "YYYY-MM-DD"
  day_of_week: number; // 0=Monday, 6=Sunday
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
}

export const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;
export const DAY_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const;

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

export type LeaveType = "conge" | "maladie" | "rtt" | "formation" | "autre";

export const LEAVE_LABELS: Record<LeaveType, string> = {
  conge: "Congé payé",
  maladie: "Maladie",
  rtt: "RTT",
  formation: "Formation",
  autre: "Autre",
};

export const LEAVE_COLORS: Record<LeaveType, string> = {
  conge: "#f59e0b",
  maladie: "#ef4444",
  rtt: "#8b5cf6",
  formation: "#06b6d4",
  autre: "#6b7280",
};

export const LEAVE_ICONS: Record<LeaveType, string> = {
  conge: "🏖️",
  maladie: "🤒",
  rtt: "🕐",
  formation: "📚",
  autre: "📋",
};

export interface Leave {
  id: number;
  employee_id: number;
  date: string; // "YYYY-MM-DD"
  type: LeaveType;
  half_day: "full" | "am" | "pm"; // full day, morning only, afternoon only
  note: string;
}

export const EMPLOYEE_COLORS = [
  "#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6",
  "#EC4899", "#06B6D4", "#F97316", "#14B8A6", "#6366F1",
  "#D946EF", "#0EA5E9", "#84CC16", "#E11D48", "#7C3AED",
];
