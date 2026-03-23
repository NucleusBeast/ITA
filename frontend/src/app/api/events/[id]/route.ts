import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { grpcDeleteEvent, grpcGetEvent, grpcUpdateEvent } from "@/lib/server/events-grpc";

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
      return { status: 401, message: "You need to be signed in to modify events." };
    case 7:
      return { status: 403, message: "You are not allowed to modify this event." };
    case 3:
      return {
        status: 400,
        message: cleanMessage || "Invalid event update payload.",
      };
    case 5:
      return { status: 404, message: "Event not found" };
    default:
      return { status: 502, message: "Event operation failed" };
  }
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const event = await grpcGetEvent(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to load event" }, { status: 502 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const cookieStore = await cookies();
  const token = cookieStore.get("ita_auth_token")?.value;

  try {
    const event = await grpcUpdateEvent(id, body, token);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    const mapped = mapGrpcError(error);
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("ita_auth_token")?.value;

  try {
    const deleted = await grpcDeleteEvent(id, token);
    return NextResponse.json({ deleted }, { status: deleted ? 200 : 404 });
  } catch (error) {
    const mapped = mapGrpcError(error);
    return NextResponse.json({ error: mapped.message }, { status: mapped.status });
  }
}
