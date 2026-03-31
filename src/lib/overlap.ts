import { ShiftWithEmployee } from "@/types";

interface LayoutShift extends ShiftWithEmployee {
  column: number;
  totalColumns: number;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function shiftsOverlap(a: ShiftWithEmployee, b: ShiftWithEmployee): boolean {
  const aStart = timeToMinutes(a.start_time);
  const aEnd = timeToMinutes(a.end_time);
  const bStart = timeToMinutes(b.start_time);
  const bEnd = timeToMinutes(b.end_time);
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Assign column positions to overlapping shifts so they render side by side.
 * Uses a greedy left-to-right column packing approach.
 */
export function layoutShifts(shifts: ShiftWithEmployee[]): LayoutShift[] {
  if (shifts.length === 0) return [];

  // Sort by start time, then by end time
  const sorted = [...shifts].sort((a, b) => {
    const diff = timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
    return diff !== 0 ? diff : timeToMinutes(a.end_time) - timeToMinutes(b.end_time);
  });

  // Build overlap groups (connected components)
  const groups: ShiftWithEmployee[][] = [];
  const visited = new Set<number>();

  for (let i = 0; i < sorted.length; i++) {
    if (visited.has(i)) continue;

    const group: number[] = [i];
    visited.add(i);

    // Find all shifts transitively connected via overlaps
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

  // For each group, assign columns greedily
  const result: LayoutShift[] = [];

  for (const group of groups) {
    // Sort group by start time
    group.sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));

    const columns: ShiftWithEmployee[][] = [];

    for (const shift of group) {
      let placed = false;
      for (let col = 0; col < columns.length; col++) {
        const lastInCol = columns[col][columns[col].length - 1];
        if (!shiftsOverlap(lastInCol, shift)) {
          columns[col].push(shift);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([shift]);
      }
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
