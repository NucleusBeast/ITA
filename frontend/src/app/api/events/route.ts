import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { grpcCreateEvent, grpcListEvents } from "@/lib/server/events-grpc";

export const runtime = "nodejs";

type GrpcLikeError = {
  code?: number;
  message?: string;
};

function mapGrpcError(error: unknown): { status: number; message: string } {
  const grpcError = (error ?? {}) as GrpcLikeError;
  const cleanMessage = grpcError.message?.replace(/^\d+\s+[A-Z_]+:\s*/, "").trim();

  switch (grpcError.code) {
    case 16:
      return { status: 401, message: "You need to be signed in to create an event." };
    case 7:
      return { status: 403, message: "You are not allowed to perform this action." };
    case 3:
      return {
        status: 400,
        message: cleanMessage || "Invalid event data. Please check all fields.",
      };
    default:
      return { status: 502, message: "Create event failed" };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;

  try {
    const events = await grpcListEvents(category);
    return NextResponse.json({ events }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to load events" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const cookieStore = await cookies();
  const token = cookieStore.get("ita_auth_token")?.value;

  try {
    const event = await grpcCreateEvent(body, token);
    if (!event) {
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    const mapped = mapGrpcError(error);
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
