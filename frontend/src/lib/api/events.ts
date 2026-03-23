import type { Event, EventCategory } from "@/lib/types/domain";

const FRONTEND_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "http://localhost:3000";

interface ApiErrorPayload {
  error?: string;
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = typeof window === "undefined" ? FRONTEND_BASE_URL : "";
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const payload = (await response.json()) as ApiErrorPayload;
      if (payload.error) {
        message = payload.error;
      }
    } catch {
      // Keep default message if the response body is not JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function getEvents(category?: EventCategory): Promise<Event[]> {
  const params = category ? `?category=${encodeURIComponent(category)}` : "";
  const payload = await fetchApi<{ events: Event[] }>(`/api/events${params}`, {
    method: "GET",
  });

  return payload.events;
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const events = await getEvents();
  return events.filter((event) => event.featured);
}

export async function getEventById(id: string): Promise<Event | undefined> {
  try {
    const payload = await fetchApi<{ event: Event }>(`/api/events/${encodeURIComponent(id)}`, {
      method: "GET",
    });

    return payload.event;
  } catch {
    return undefined;
  }
}

export async function createEvent(input: Omit<Event, "id" | "registered">): Promise<Event> {
  const payload = await fetchApi<{ event: Event }>("/api/events", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      featured: Boolean(input.featured),
    }),
  });

  return payload.event;
}

export async function updateEvent(id: string, patch: Partial<Event>): Promise<Event> {
  const payload = await fetchApi<{ event: Event }>(`/api/events/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });

  return payload.event;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const payload = await fetchApi<{ deleted: boolean }>(`/api/events/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  return payload.deleted;
}
