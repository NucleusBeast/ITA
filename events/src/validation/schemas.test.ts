import { describe, expect, it } from "vitest";
import {
  createEventSchema,
  getEventSchema,
  listEventsSchema,
  updateEventSchema,
} from "./schemas";

const validEventInput = {
  title: "AI Conference 2026",
  tagline: "The future of applied AI",
  description:
    "A one-day event about practical AI adoption across products, engineering, and operations.",
  date: "2026-05-18",
  time: "10:00",
  location: "Ljubljana Expo Center",
  mode: "In Person" as const,
  category: "Tech" as const,
  capacity: 250,
  priceLabel: "Free",
  host: "ITA Team",
  coverGradient: "from-cyan-500 to-blue-600",
};

describe("events validation schemas", () => {
  it("accepts a valid create event payload", () => {
    const result = createEventSchema.parse({ event: validEventInput });

    expect(result.event.title).toBe("AI Conference 2026");
    expect(result.event.category).toBe("Tech");
  });

  it("rejects create event payload with invalid capacity", () => {
    expect(() =>
      createEventSchema.parse({
        event: {
          ...validEventInput,
          capacity: 0,
        },
      }),
    ).toThrow();
  });

  it("rejects update payload with empty patch object", () => {
    expect(() =>
      updateEventSchema.parse({
        id: "evt_1",
        patch: {},
      }),
    ).toThrow("At least one patch field is required");
  });

  it("accepts update payload with a valid partial patch", () => {
    const result = updateEventSchema.parse({
      id: "evt_1",
      patch: { registered: 42 },
    });

    expect(result.patch.registered).toBe(42);
  });

  it("rejects empty id in get event schema", () => {
    expect(() =>
      getEventSchema.parse({
        id: " ",
      }),
    ).toThrow();
  });

  it("accepts optional category filter in list events schema", () => {
    const result = listEventsSchema.parse({ category: "Business" });

    expect(result.category).toBe("Business");
  });
});
