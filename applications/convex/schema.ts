import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  applications: defineTable({
    userId: v.string(),
    eventId: v.string(),
    status: v.union(v.literal("Confirmed"), v.literal("Pending"), v.literal("Waitlisted")),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_user_event", ["userId", "eventId"]),
});
