import { getEventById } from "@/lib/api/events";
import type { Application, Event } from "@/lib/types/domain";

const FRONTEND_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "http://localhost:3000";

interface ApiErrorPayload {
  error?: string;
}

async function getServerCookieHeader(): Promise<string | undefined> {
  if (typeof window !== "undefined") {
    return undefined;
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const serialized = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  return serialized.length > 0 ? serialized : undefined;
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = typeof window === "undefined" ? FRONTEND_BASE_URL : "";
  const cookieHeader = await getServerCookieHeader();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
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

async function withEvent(application: Application): Promise<ApplicationWithEvent | null> {
  const event = await getEventById(application.eventId);
  return event ? { ...application, event } : null;
}

export interface ApplicationWithEvent extends Application {
  event: Event;
}

export async function getApplicationsForCurrentUser(): Promise<
  ApplicationWithEvent[]
> {
  try {
    const payload = await fetchApi<{ applications: Application[] }>("/api/applications", {
      method: "GET",
    });

    const resolved = await Promise.all(payload.applications.map((application) => withEvent(application)));
    return resolved.filter((entry): entry is ApplicationWithEvent => entry !== null);
  } catch {
    return [];
  }
}

export async function getApplyPreview(eventId: string): Promise<
  ApplicationWithEvent | undefined
> {
  try {
    const payload = await fetchApi<{ application: Application | null }>(
      `/api/applications/event/${encodeURIComponent(eventId)}`,
      {
        method: "GET",
      },
    );

    if (!payload.application) {
      return undefined;
    }

    const resolved = await withEvent(payload.application);
    return resolved ?? undefined;
  } catch {
    return undefined;
  }
}

export async function applyToEvent(eventId: string): Promise<ApplicationWithEvent> {
  const payload = await fetchApi<{ application: Application }>("/api/applications", {
    method: "POST",
    body: JSON.stringify({ eventId }),
  });

  const resolved = await withEvent(payload.application);
  if (!resolved) {
    throw new Error("Applied successfully, but event details are unavailable.");
  }

  return resolved;
}

export async function withdrawApplication(applicationId: string): Promise<boolean> {
  const payload = await fetchApi<{ deleted: boolean }>(`/api/applications/${encodeURIComponent(applicationId)}`, {
    method: "DELETE",
  });

  return payload.deleted;
}
