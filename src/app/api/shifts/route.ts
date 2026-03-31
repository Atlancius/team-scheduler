import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const weekStart = searchParams.get("week_start");

  if (!weekStart) {
    return NextResponse.json({ error: "week_start is required" }, { status: 400 });
  }

  const shifts = db
    .prepare(
      `SELECT s.*, e.name as employee_name, e.color as employee_color, e.weekly_hours as employee_weekly_hours
       FROM shifts s
       JOIN employees e ON s.employee_id = e.id
       WHERE s.week_start = ?
       ORDER BY s.day_of_week, s.start_time`
    )
    .all(weekStart);

  return NextResponse.json(shifts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { employee_id, week_start, day_of_week, start_time, end_time } = body;

  if (!employee_id || !week_start || day_of_week === undefined || !start_time || !end_time) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const result = db
    .prepare(
      "INSERT INTO shifts (employee_id, week_start, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?, ?)"
    )
    .run(employee_id, week_start, day_of_week, start_time, end_time);

  const shift = db
    .prepare(
      `SELECT s.*, e.name as employee_name, e.color as employee_color, e.weekly_hours as employee_weekly_hours
       FROM shifts s JOIN employees e ON s.employee_id = e.id WHERE s.id = ?`
    )
    .get(result.lastInsertRowid);

  return NextResponse.json(shift, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, employee_id, week_start, day_of_week, start_time, end_time } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  db.prepare(
    "UPDATE shifts SET employee_id = ?, week_start = ?, day_of_week = ?, start_time = ?, end_time = ? WHERE id = ?"
  ).run(employee_id, week_start, day_of_week, start_time, end_time, id);

  const shift = db
    .prepare(
      `SELECT s.*, e.name as employee_name, e.color as employee_color, e.weekly_hours as employee_weekly_hours
       FROM shifts s JOIN employees e ON s.employee_id = e.id WHERE s.id = ?`
    )
    .get(id);

  return NextResponse.json(shift);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  db.prepare("DELETE FROM shifts WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
