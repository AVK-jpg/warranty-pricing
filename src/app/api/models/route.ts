// src/app/api/models/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Minimal handlers so this file is DEFINITELY a module
export async function GET() {
  return NextResponse.json({ ok: true, at: "/api/models" });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ ok: true, received: body }, { status: 201 });
}
