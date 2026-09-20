import { NextResponse } from "next/server";
import { readContent, writeContent, githubConfigured } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET current content (admin reads the freshest local copy).
export async function GET(_req, { params }) {
  try {
    const data = await readContent(params.name);
    return NextResponse.json({ data, github: githubConfigured() });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// PUT replaces the whole content file (commits via GitHub when configured).
export async function PUT(req, { params }) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const result = await writeContent(params.name, body.data, body.message);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
