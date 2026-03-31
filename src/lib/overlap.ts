export interface ShiftLike {
  id: number;
  employee_id: number;
  week_start: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  employee_name: string;
  employee_color: string;
  employee_weekly_hours: number;
}

export interface LayoutShift extends ShiftLike {
  column: number;
  totalColumns: number;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function shiftsOverlap(a: ShiftLike, b: ShiftLike): boolean {
  return timeToMinutes(a.start_time) < timeToMinutes(b.end_time)
    && timeToMinutes(b.start_time) < timeToMinutes(a.end_time);
}

export function layoutShifts(shifts: ShiftLike[]): LayoutShift[] {
  if (shifts.length === 0) return [];

  const sorted = [...shifts].sort((a, b) => {
    const diff = timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
    return diff !== 0 ? diff : timeToMinutes(a.end_time) - timeToMinutes(b.end_time);
  });

  // Build overlap groups
  const groups: ShiftLike[][] = [];
  const visited = new Set<number>();

  for (let i = 0; i < sorted.length; i++) {
    if (visited.has(i)) continue;
    const group: number[] = [i];
    visited.add(i);
    let queue = [i];
    while (queue.length > 0) {
      const nextQueue: number[] = [];
      for (const idx of queue) {
        for (let j = 0; j < sorted.length; j++) {
          if (visited.has(j)) continue;
          if (shiftsOverlap(sorted[idx], sorted[j])) {
            visited.add(j);
            group.push(j);
            nextQueue.push(j);
          }
        }
      }
      queue = nextQueue;
    }
    groups.push(group.map((idx) => sorted[idx]));
  }

  const result: LayoutShift[] = [];
  for (const group of groups) {
    group.sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));
    const columns: ShiftLike[][] = [];
    for (const shift of group) {
      let placed = false;
      for (let col = 0; col < columns.length; col++) {
        const last = columns[col][columns[col].length - 1];
        if (!shiftsOverlap(last, shift)) {
          columns[col].push(shift);
          placed = true;
          break;
        }
      }
      if (!placed) columns.push([shift]);
    }
    const totalColumns = columns.length;
    for (let col = 0; col < columns.length; col++) {
      for (const shift of columns[col]) {
        result.push({ ...shift, column: col, totalColumns });
      }
    }
  }
  return result;
}
