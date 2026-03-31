import { Employee, Shift } from "@/types";

const EMPLOYEES_KEY = "ts_employees";
const SHIFTS_KEY = "ts_shifts";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

let nextEmpId = 0;
let nextShiftId = 0;

function initIds() {
  const emps = read<Employee[]>(EMPLOYEES_KEY, []);
  const shifts = read<Shift[]>(SHIFTS_KEY, []);
  nextEmpId = emps.reduce((max, e) => Math.max(max, e.id), 0) + 1;
  nextShiftId = shifts.reduce((max, s) => Math.max(max, s.id), 0) + 1;
}

// === Employees ===

export function getEmployees(): Employee[] {
  initIds();
  return read<Employee[]>(EMPLOYEES_KEY, []);
}

export function addEmployee(data: Omit<Employee, "id">): Employee {
  initIds();
  const emps = read<Employee[]>(EMPLOYEES_KEY, []);
  const emp: Employee = { ...data, id: nextEmpId++ };
  emps.push(emp);
  write(EMPLOYEES_KEY, emps);
  return emp;
}

export function updateEmployee(id: number, data: Partial<Employee>): Employee | null {
  const emps = read<Employee[]>(EMPLOYEES_KEY, []);
  const idx = emps.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  emps[idx] = { ...emps[idx], ...data, id };
  write(EMPLOYEES_KEY, emps);
  return emps[idx];
}

export function deleteEmployee(id: number) {
  const emps = read<Employee[]>(EMPLOYEES_KEY, []).filter((e) => e.id !== id);
  write(EMPLOYEES_KEY, emps);
  // Also remove their shifts
  const shifts = read<Shift[]>(SHIFTS_KEY, []).filter((s) => s.employee_id !== id);
  write(SHIFTS_KEY, shifts);
}

// === Shifts ===

export function getShifts(weekStart: string): Shift[] {
  initIds();
  return read<Shift[]>(SHIFTS_KEY, []).filter((s) => s.week_start === weekStart);
}

export function addShift(data: Omit<Shift, "id">): Shift {
  initIds();
  const shifts = read<Shift[]>(SHIFTS_KEY, []);
  const shift: Shift = { ...data, id: nextShiftId++ };
  shifts.push(shift);
  write(SHIFTS_KEY, shifts);
  return shift;
}

export function updateShift(id: number, data: Partial<Shift>): Shift | null {
  const shifts = read<Shift[]>(SHIFTS_KEY, []);
  const idx = shifts.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  shifts[idx] = { ...shifts[idx], ...data, id };
  write(SHIFTS_KEY, shifts);
  return shifts[idx];
}

export function deleteShift(id: number) {
  const shifts = read<Shift[]>(SHIFTS_KEY, []).filter((s) => s.id !== id);
  write(SHIFTS_KEY, shifts);
}
