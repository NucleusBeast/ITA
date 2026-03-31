import { describe, expect, it } from "vitest";
import { createApplicationSchema } from "./schemas";

describe("applications validation schemas", () => {
  it("accepts a valid create application payload", () => {
    const result = createApplicationSchema.parse({
      eventId: "event-123",
    });

    expect(result.eventId).toBe("event-123");
  });

  it("rejects create application payload with empty eventId", () => {
    expect(() =>
      createApplicationSchema.parse({
        eventId: "",
      }),
    ).toThrow();
  });

  it("rejects create application payload with missing eventId", () => {
    expect(() => createApplicationSchema.parse({})).toThrow();
  });

  it("trims whitespace from eventId", () => {
    const result = createApplicationSchema.parse({
      eventId: "  event-123  ",
    });

    expect(result.eventId).toBe("event-123");
  });
});
