# Team Scheduler — Requirements

## Overview
A weekly team scheduling app with drag-and-drop employee assignment, flexible shift management, and a clean modern dashboard.

## Tech Stack
- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **Drag & Drop:** @dnd-kit/core + @dnd-kit/sortable
- **Database:** SQLite via better-sqlite3 (server-side only)
- **State:** React hooks + server actions
- **Package manager:** pnpm

## Core Features

### 1. Employee Management
- CRUD for employees (name, role/position, contracted weekly hours, color)
- Each employee has a **different** contracted hours/week (total flexibility)
- Employee list panel always visible on the left sidebar

### 2. Weekly Schedule Grid
- 7-day week view (Monday → Sunday)
- Columns = days, rows = time slots (6:00 → 22:00, 30min increments)
- Drag employees from the sidebar into time slots on the grid
- Visual blocks showing who works when

### 3. Shift Types
- **Split shift (coupé):** e.g., 9:00-12:00 + 14:00-17:00 — two separate blocks same day
- **Continuous shift (continu):** e.g., 7:00-14:00 — one block
- Multiple shifts per employee per day allowed
- Click a shift block to edit start/end times precisely
- Drag to resize shift duration

### 4. Hours Tracking Dashboard
- Per employee: hours scheduled this week vs contracted hours
- Visual indicator: under/over/on-target (color coded: red/green/orange)
- Total team hours for the week
- Per-day totals row at the bottom
- Per-employee daily hours visible on each block

### 5. UI/UX Requirements
- **Modern, clean design** — glassmorphism subtle, smooth animations
- **Color-coded employees** — each employee gets a distinct color
- **At-a-glance info:** employee name + hours on each shift block
- **Responsive** but desktop-first (scheduling is a desktop task)
- **Dark mode** by default with light mode toggle
- **No page reloads** — everything SPA-like with server actions
- **Tooltips** on hover showing shift details
- **Weekly navigation** — prev/next week buttons

### 6. Data Persistence
- SQLite database at `./data/scheduler.db`
- Tables: employees, shifts, weeks
- Auto-create tables on first run
- Server actions for all CRUD operations

## File Structure
```
team-scheduler/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       ├── employees/route.ts
│   │       ├── shifts/route.ts
│   │       └── weeks/route.ts
│   ├── components/
│   │   ├── schedule/
│   │   │   ├── WeekGrid.tsx
│   │   │   ├── DayColumn.tsx
│   │   │   ├── TimeSlot.tsx
│   │   │   ├── ShiftBlock.tsx
│   │   │   └── WeekNavigation.tsx
│   │   ├── employees/
│   │   │   ├── EmployeeSidebar.tsx
│   │   │   ├── EmployeeCard.tsx
│   │   │   └── EmployeeForm.tsx
│   │   ├── dashboard/
│   │   │   ├── HoursSummary.tsx
│   │   │   └── WeeklyStats.tsx
│   │   └── ui/ (shadcn components)
│   ├── lib/
│   │   ├── db.ts (SQLite connection + schema)
│   │   ├── actions.ts (server actions)
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── data/ (SQLite DB directory)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Database Schema

```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  weekly_hours REAL NOT NULL DEFAULT 35,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  week_start TEXT NOT NULL, -- ISO date of Monday
  day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6), -- 0=Monday
  start_time TEXT NOT NULL, -- "HH:MM"
  end_time TEXT NOT NULL, -- "HH:MM"
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment
- Target: Hostinger VPS (148.230.116.98, port 2222, user jeff)
- Run as a systemd service on port 3001
- Behind existing nginx reverse proxy if available
- SQLite DB persisted in /opt/team-scheduler/data/

## Priority
Build a FULLY WORKING app. Every feature listed above must work. No placeholders, no TODOs, no "coming soon". Ship it complete.
