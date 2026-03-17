import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    role: v.union(v.literal("Organizer"), v.literal("Attendee")),
    email: v.string(),
    city: v.string(),
    avatarInitials: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_email", ["email"]),
  credentials: defineTable({
    userId: v.id("users"),
    passwordHash: v.string(),
  }).index("by_user_id", ["userId"]),
});
