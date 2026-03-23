import type { Event, EventCategory, EventInput, EventPatch } from "../types/event";
import { convexClient } from "./convex-client";

export async function listEvents(category?: EventCategory): Promise<Event[]> {
  const events = await (convexClient as any).query("events:listEvents", {
    category,
  });

  return (events as Event[] | null) ?? [];
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const event = await (convexClient as any).query("events:getEventById", {
    eventId,
  });

  return (event as Event | null) ?? null;
}

export async function createEvent(createdBy: string, input: EventInput): Promise<Event> {
  const event = await (convexClient as any).mutation("events:createEvent", {
    createdBy,
    event: input,
  });

  return event as Event;
}

export async function updateEvent(
  eventId: string,
  patch: EventPatch,
  requesterId: string,
): Promise<Event | null> {
  const event = await (convexClient as any).mutation("events:updateEvent", {
    eventId,
    patch,
    requesterId,
  });

  return (event as Event | null) ?? null;
}

export async function deleteEvent(eventId: string, requesterId: string): Promise<boolean> {
  const deleted = await (convexClient as any).mutation("events:deleteEvent", {
    eventId,
    requesterId,
  });

  return Boolean(deleted);
}
