import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const statusValue = v.union(v.literal("Confirmed"), v.literal("Pending"), v.literal("Waitlisted"));

function toApplicationDto(applicationId: string, application: any) {
  return {
    id: applicationId,
    userId: application.userId,
    eventId: application.eventId,
    status: application.status,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
  };
}

export const listByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_user_id", (q: any) => q.eq("userId", args.userId))
      .collect();

    return applications.map((application: any) => toApplicationDto(application._id, application));
  },
});

export const getForUserAndEvent = query({
  args: {
    userId: v.string(),
    eventId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const application = await ctx.db
      .query("applications")
      .withIndex("by_user_event", (q: any) => q.eq("userId", args.userId).eq("eventId", args.eventId))
      .unique();

    if (!application) {
      return null;
    }

    return toApplicationDto(application._id, application);
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    eventId: v.string(),
    status: v.optional(statusValue),
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_user_event", (q: any) => q.eq("userId", args.userId).eq("eventId", args.eventId))
      .unique();

    if (existing) {
      throw new Error("Application already exists");
    }

    const now = new Date().toISOString();
    const applicationId = await ctx.db.insert("applications", {
      userId: args.userId,
      eventId: args.eventId,
      status: args.status ?? "Pending",
      createdAt: now,
      updatedAt: now,
    });

    const created = await ctx.db.get(applicationId);
    if (!created) {
      throw new Error("Failed to create application");
    }

    return toApplicationDto(applicationId, created);
  },
});

export const deleteById = mutation({
  args: {
    applicationId: v.string(),
    requesterId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const normalizedId = ctx.db.normalizeId("applications", args.applicationId);
    if (!normalizedId) {
      return false;
    }

    const existing = await ctx.db.get(normalizedId);
    if (!existing) {
      return false;
    }

    if (existing.userId !== args.requesterId) {
      throw new Error("Forbidden");
    }

    await ctx.db.delete(normalizedId);
    return true;
  },
});
