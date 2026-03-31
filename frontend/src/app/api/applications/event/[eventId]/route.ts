import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const APPLICATIONS_API_URL =
  process.env.NEXT_PUBLIC_APPLICATIONS_API_URL ??
  process.env.APPLICATIONS_API_URL ??
  "http://localhost:8081";

interface RouteContext {
  params: Promise<{ eventId: string }>;
}

async function readPayload(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function GET(_request: Request, context: RouteContext) {
  const { eventId } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("ita_auth_token")?.value;

  if (!token) {
    return NextResponse.json({ application: null }, { status: 200 });
  }

  const response = await fetch(
    `${APPLICATIONS_API_URL}/applications/event/${encodeURIComponent(eventId)}/me`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const payload = await readPayload(response);

  if (!response.ok) {
    return NextResponse.json(
      { error: (payload.error as string | undefined) ?? "Failed to load application preview" },
      { status: response.status || 502 },
    );
  }

  return NextResponse.json({ application: payload.application ?? null }, { status: 200 });
}
