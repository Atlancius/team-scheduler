import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const employees = db.prepare("SELECT * FROM employees ORDER BY name").all();
  return NextResponse.json(employees);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, role, color, weekly_hours } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const result = db
    .prepare("INSERT INTO employees (name, role, color, weekly_hours) VALUES (?, ?, ?, ?)")
    .run(name, role || null, color || "#3B82F6", weekly_hours ?? 35);

  const employee = db.prepare("SELECT * FROM employees WHERE id = ?").get(result.lastInsertRowid);
  return NextResponse.json(employee, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name, role, color, weekly_hours } = body;

  if (!id || !name) {
    return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
  }

  db.prepare("UPDATE employees SET name = ?, role = ?, color = ?, weekly_hours = ? WHERE id = ?").run(
    name,
    role || null,
    color || "#3B82F6",
    weekly_hours ?? 35,
    id
  );

  const employee = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);
  return NextResponse.json(employee);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  db.prepare("DELETE FROM employees WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
