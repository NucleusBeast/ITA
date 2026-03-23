import { status, type ServerUnaryCall, type sendUnaryData } from "@grpc/grpc-js";
import { ZodError } from "zod";
import {
  createEvent,
  deleteEvent,
  getEventById,
  listEvents,
  updateEvent,
} from "../data/events-repository";
import { verifyAccessToken } from "../lib/jwt";
import {
  createEventSchema,
  deleteEventSchema,
  getEventSchema,
  listEventsSchema,
  updateEventSchema,
} from "../validation/schemas";

interface EventMessage {
  id: string;
  title: string;
  tagline: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  category: string;
  capacity: number;
  registered: number;
  priceLabel: string;
  host: string;
  coverGradient: string;
  featured: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

type UnaryCall<T> = ServerUnaryCall<T, unknown>;

type UnaryCallback<T> = sendUnaryData<T>;

function grpcError(code: number, message: string): Error {
  const error = new Error(message) as Error & { code?: number };
  error.code = code;
  return error;
}

function toGrpcError(error: unknown): Error {
  const existing = error as Error & { code?: number };
  if (typeof existing?.code === "number") {
    return existing;
  }

  if (error instanceof ZodError) {
    const issue = error.issues[0];
    const path = issue?.path?.join(".");
    const details = issue?.message ?? "Invalid request payload";
    const message = path ? `${path}: ${details}` : details;
    return grpcError(status.INVALID_ARGUMENT, message);
  }

  const message = existing?.message ?? "Unexpected server error";
  const normalized = message.toLowerCase();
  if (normalized.includes("forbidden")) {
    return grpcError(status.PERMISSION_DENIED, message);
  }
  if (normalized.includes("not found")) {
    return grpcError(status.NOT_FOUND, message);
  }

  return grpcError(status.INTERNAL, message);
}

function extractToken(call: UnaryCall<unknown>): string | null {
  const metadata = call.metadata.getMap();
  const authRaw = metadata.authorization ?? metadata.Authorization;
  const authHeader = typeof authRaw === "string" ? authRaw : null;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim();
}

function requireUserId(call: UnaryCall<unknown>): string {
  const token = extractToken(call);
  if (!token) {
    throw grpcError(16, "Missing or invalid authorization metadata");
  }

  try {
    return verifyAccessToken(token);
  } catch {
    throw grpcError(16, "Invalid or expired token");
  }
}

function toEventMessage(event: EventMessage): EventMessage {
  return {
    ...event,
    featured: Boolean(event.featured),
  };
}

export const eventsServiceHandlers = {
  async ListEvents(
    call: UnaryCall<{ category?: string }>,
    callback: UnaryCallback<{ events: EventMessage[] }>,
  ): Promise<void> {
    try {
      const payload = listEventsSchema.parse({
        category: call.request.category || undefined,
      });

      const events = await listEvents(payload.category);
      callback(null, {
        events: events.map((event) => toEventMessage(event as unknown as EventMessage)),
      });
    } catch (error) {
      callback(toGrpcError(error), null);
    }
  },

  async GetEvent(
    call: UnaryCall<{ id: string }>,
    callback: UnaryCallback<{ event?: EventMessage }>,
  ): Promise<void> {
    try {
      const payload = getEventSchema.parse({ id: call.request.id });
      const event = await getEventById(payload.id);

      if (!event) {
        callback(grpcError(5, "Event not found"), null);
        return;
      }

      callback(null, {
        event: toEventMessage(event as unknown as EventMessage),
      });
    } catch (error) {
      callback(toGrpcError(error), null);
    }
  },

  async CreateEvent(
    call: UnaryCall<{ event: Record<string, unknown> }>,
    callback: UnaryCallback<{ event?: EventMessage }>,
  ): Promise<void> {
    try {
      const userId = requireUserId(call);
      const payload = createEventSchema.parse(call.request);
      const event = await createEvent(userId, payload.event);

      callback(null, {
        event: toEventMessage(event as unknown as EventMessage),
      });
    } catch (error) {
      callback(toGrpcError(error), null);
    }
  },

  async UpdateEvent(
    call: UnaryCall<{ id: string; patch: Record<string, unknown> }>,
    callback: UnaryCallback<{ event?: EventMessage }>,
  ): Promise<void> {
    try {
      const userId = requireUserId(call);
      const payload = updateEventSchema.parse(call.request);
      const event = await updateEvent(payload.id, payload.patch, userId);

      if (!event) {
        callback(grpcError(5, "Event not found"), null);
        return;
      }

      callback(null, {
        event: toEventMessage(event as unknown as EventMessage),
      });
    } catch (error) {
      callback(toGrpcError(error), null);
    }
  },

  async DeleteEvent(
    call: UnaryCall<{ id: string }>,
    callback: UnaryCallback<{ deleted: boolean }>,
  ): Promise<void> {
    try {
      const userId = requireUserId(call);
      const payload = deleteEventSchema.parse(call.request);
      const deleted = await deleteEvent(payload.id, userId);

      callback(null, { deleted });
    } catch (error) {
      callback(toGrpcError(error), null);
    }
  },
};
