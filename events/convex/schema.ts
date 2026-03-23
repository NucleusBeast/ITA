import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    title: v.string(),
    tagline: v.string(),
    description: v.string(),
    date: v.string(),
    time: v.string(),
    location: v.string(),
    mode: v.union(v.literal("In Person"), v.literal("Hybrid"), v.literal("Online")),
    category: v.union(
      v.literal("Tech"),
      v.literal("Business"),
      v.literal("Workshop"),
      v.literal("Community"),
      v.literal("Culture"),
    ),
    capacity: v.number(),
    registered: v.number(),
    priceLabel: v.string(),
    host: v.string(),
    coverGradient: v.string(),
    featured: v.boolean(),
    createdBy: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_category", ["category"])
    .index("by_created_by", ["createdBy"]),
});
