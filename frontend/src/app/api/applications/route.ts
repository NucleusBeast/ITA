import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const APPLICATIONS_API_URL =
  process.env.NEXT_PUBLIC_APPLICATIONS_API_URL ??
  process.env.APPLICATIONS_API_URL ??
  "http://localhost:8081";

async function readPayload(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ita_auth_token")?.value;

  if (!token) {
    return NextResponse.json({ applications: [] }, { status: 200 });
  }

  const response = await fetch(`${APPLICATIONS_API_URL}/applications/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const payload = await readPayload(response);

  if (!response.ok) {
    return NextResponse.json(
      { error: (payload.error as string | undefined) ?? "Failed to load applications" },
      { status: response.status || 502 },
    );
  }

  return NextResponse.json({ applications: payload.applications ?? [] }, { status: 200 });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ita_auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "You need to sign in first" }, { status: 401 });
  }

  const body = (await request.json()) as { eventId?: string };

  const response = await fetch(`${APPLICATIONS_API_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await readPayload(response);

  if (!response.ok) {
    return NextResponse.json(
      { error: (payload.error as string | undefined) ?? "Application request failed" },
      { status: response.status || 502 },
    );
  }

  return NextResponse.json({ application: payload.application }, { status: 201 });
}
