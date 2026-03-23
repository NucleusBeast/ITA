import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const modeValue = v.union(v.literal("In Person"), v.literal("Hybrid"), v.literal("Online"));
const categoryValue = v.union(
  v.literal("Tech"),
  v.literal("Business"),
  v.literal("Workshop"),
  v.literal("Community"),
  v.literal("Culture"),
);

const eventInput = {
  title: v.string(),
  tagline: v.string(),
  description: v.string(),
  date: v.string(),
  time: v.string(),
  location: v.string(),
  mode: modeValue,
  category: categoryValue,
  capacity: v.number(),
  priceLabel: v.string(),
  host: v.string(),
  coverGradient: v.string(),
  featured: v.optional(v.boolean()),
};

function toEventDto(eventId: string, event: any) {
  return {
    id: eventId,
    title: event.title,
    tagline: event.tagline,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
    mode: event.mode,
    category: event.category,
    capacity: event.capacity,
    registered: event.registered,
    priceLabel: event.priceLabel,
    host: event.host,
    coverGradient: event.coverGradient,
    featured: event.featured,
    createdBy: event.createdBy,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

export const listEvents = query({
  args: {
    category: v.optional(categoryValue),
  },
  handler: async (ctx, args) => {
    const events = args.category
      ? await ctx.db
          .query("events")
          .withIndex("by_category", (q) => q.eq("category", args.category!))
          .collect()
      : await ctx.db.query("events").collect();

    return events.map((event) => toEventDto(event._id, event));
  },
});

export const getEventById = query({
  args: {
    eventId: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("events", args.eventId);
    if (!normalizedId) {
      return null;
    }

    const event = await ctx.db.get(normalizedId);
    if (!event) {
      return null;
    }

    return toEventDto(normalizedId, event);
  },
});

export const createEvent = mutation({
  args: {
    createdBy: v.string(),
    event: v.object(eventInput),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    const eventId = await ctx.db.insert("events", {
      ...args.event,
      featured: args.event.featured ?? false,
      registered: 0,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    });

    const event = await ctx.db.get(eventId);
    if (!event) {
      throw new Error("Failed to create event");
    }

    return toEventDto(eventId, event);
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.string(),
    requesterId: v.string(),
    patch: v.object({
      title: v.optional(v.string()),
      tagline: v.optional(v.string()),
      description: v.optional(v.string()),
      date: v.optional(v.string()),
      time: v.optional(v.string()),
      location: v.optional(v.string()),
      mode: v.optional(modeValue),
      category: v.optional(categoryValue),
      capacity: v.optional(v.number()),
      registered: v.optional(v.number()),
      priceLabel: v.optional(v.string()),
      host: v.optional(v.string()),
      coverGradient: v.optional(v.string()),
      featured: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("events", args.eventId);
    if (!normalizedId) {
      return null;
    }

    const existing = await ctx.db.get(normalizedId);
    if (!existing) {
      return null;
    }

    if (existing.createdBy !== args.requesterId) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch(normalizedId, {
      ...args.patch,
      updatedAt: new Date().toISOString(),
    });

    const updated = await ctx.db.get(normalizedId);
    if (!updated) {
      return null;
    }

    return toEventDto(normalizedId, updated);
  },
});

export const deleteEvent = mutation({
  args: {
    eventId: v.string(),
    requesterId: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("events", args.eventId);
    if (!normalizedId) {
      return false;
    }

    const existing = await ctx.db.get(normalizedId);
    if (!existing) {
      return false;
    }

    if (existing.createdBy !== args.requesterId) {
      throw new Error("Forbidden");
    }

    await ctx.db.delete(normalizedId);
    return true;
  },
});
