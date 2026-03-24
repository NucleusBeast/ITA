import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema, updateUserSchema } from "./schemas";

describe("users validation schemas", () => {
  it("accepts a valid register payload", () => {
    const result = registerSchema.parse({
      name: "Ana Novak",
      email: "ana@example.com",
      password: "VeryStrong1",
      city: "Ljubljana",
      role: "Organizer",
    });

    expect(result.name).toBe("Ana Novak");
    expect(result.role).toBe("Organizer");
  });

  it("rejects register payload with invalid email", () => {
    expect(() =>
      registerSchema.parse({
        name: "Ana Novak",
        email: "not-an-email",
        password: "VeryStrong1",
        city: "Ljubljana",
      }),
    ).toThrow();
  });

  it("rejects login payload with short password", () => {
    expect(() =>
      loginSchema.parse({
        email: "ana@example.com",
        password: "short",
      }),
    ).toThrow();
  });

  it("rejects update payload with no fields", () => {
    expect(() => updateUserSchema.parse({})).toThrow(
      "At least one field must be provided",
    );
  });

  it("accepts valid partial update payload", () => {
    const result = updateUserSchema.parse({ city: "Maribor" });

    expect(result.city).toBe("Maribor");
  });

  it("rejects avatar initials longer than 4 characters", () => {
    expect(() =>
      updateUserSchema.parse({
        avatarInitials: "ABCDE",
      }),
    ).toThrow();
  });
});
