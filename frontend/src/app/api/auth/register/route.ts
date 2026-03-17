import { NextResponse } from "next/server";

const USERS_API_URL =
  process.env.NEXT_PUBLIC_USERS_API_URL ?? process.env.USERS_API_URL ?? "http://localhost:8082";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
    city?: string;
    role?: "Organizer" | "Attendee";
  };

  const response = await fetch(`${USERS_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = (await response.json()) as { token?: string; error?: string };

  if (!response.ok || !payload.token) {
    return NextResponse.json(
      { error: payload.error ?? "Sign up failed" },
      { status: response.status || 400 },
    );
  }

  const result = NextResponse.json({ ok: true }, { status: 201 });
  result.cookies.set("ita_auth_token", payload.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return result;
}
