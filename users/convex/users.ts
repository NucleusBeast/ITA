import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const registerUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    city: v.string(),
    role: v.union(v.literal("Organizer"), v.literal("Attendee")),
    avatarInitials: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .unique();

    if (existing) {
      throw new Error("User with this email already exists");
    }

    const now = new Date().toISOString();
    const userId = await ctx.db.insert("users", {
      name: args.name,
      role: args.role,
      email: normalizedEmail,
      city: args.city,
      avatarInitials: args.avatarInitials,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("credentials", {
      userId,
      passwordHash: args.passwordHash,
    });

    const user = await ctx.db.get(userId);

    return {
      id: userId,
      name: user?.name ?? args.name,
      role: user?.role ?? args.role,
      email: user?.email ?? normalizedEmail,
      city: user?.city ?? args.city,
      avatarInitials: user?.avatarInitials ?? args.avatarInitials,
    };
  },
});

export const getUserById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("users", args.userId);
    if (!normalizedId) {
      return null;
    }

    const user = await ctx.db.get(normalizedId);
    if (!user) {
      return null;
    }

    return {
      id: normalizedId,
      name: user.name,
      role: user.role,
      email: user.email,
      city: user.city,
      avatarInitials: user.avatarInitials,
    };
  },
});

export const getUserByEmailWithPassword = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .unique();

    if (!user) {
      return null;
    }

    const credentials = await ctx.db
      .query("credentials")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .unique();

    if (!credentials) {
      return null;
    }

    return {
      id: user._id,
      name: user.name,
      role: user.role,
      email: user.email,
      city: user.city,
      avatarInitials: user.avatarInitials,
      passwordHash: credentials.passwordHash,
    };
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.string(),
    patch: v.object({
      name: v.optional(v.string()),
      city: v.optional(v.string()),
      role: v.optional(v.union(v.literal("Organizer"), v.literal("Attendee"))),
      avatarInitials: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("users", args.userId);
    if (!normalizedId) {
      return null;
    }

    const existing = await ctx.db.get(normalizedId);
    if (!existing) {
      return null;
    }

    await ctx.db.patch(normalizedId, {
      ...args.patch,
      updatedAt: new Date().toISOString(),
    });

    const updated = await ctx.db.get(normalizedId);
    if (!updated) {
      return null;
    }

    return {
      id: normalizedId,
      name: updated.name,
      role: updated.role,
      email: updated.email,
      city: updated.city,
      avatarInitials: updated.avatarInitials,
    };
  },
});
