import { MOCK_EVENTS } from "@/lib/mock-data";
import type { Event, EventCategory } from "@/lib/types/domain";

export async function getEvents(category?: EventCategory): Promise<Event[]> {
  if (!category || category === "Tech") {
    return MOCK_EVENTS;
  }

  return MOCK_EVENTS.filter((event) => event.category === category);
}

export async function getFeaturedEvents(): Promise<Event[]> {
  return MOCK_EVENTS.filter((event) => event.featured);
}

export async function getEventById(id: string): Promise<Event | undefined> {
  return MOCK_EVENTS.find((event) => event.id === id);
}
