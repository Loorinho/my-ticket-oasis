import { auth } from "./../node_modules/convex/src/cli/auth";
import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { asyncMap } from "./lib/relationships";

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      role: ["user"],
      userId: args.clerkId,
      isOrganizer: false,
      status: "inactive",
      isVerified: false,
    });
  },
});

export const getUserRole = query({
  args: {
    // userId: v.string(),
  },
  handler: async (ctx, args) => {
    const _user = await ctx.auth.getUserIdentity();
    if (!_user) {
      throw new Error("Unauthenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_UserId", (q) => q.eq("userId", _user.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return {
      isAdmin: user.role.includes("toasis-admin"),
      isOrganizer: user.isOrganizer,
      isNormalUser: !user.role.includes("toasis-admin") && !user.isOrganizer,
    };
  },
});

export const getClients = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("Unauthenticated");
    }

    const _user = await ctx.db
      .query("users")
      .withIndex("by_UserId", (q) => q.eq("userId", user.subject))
      .first();

    if (!_user) {
      throw new Error("You are not an admin to perform this action");
    }

    // const role: = _user.role("to-admin")

    const clients = await ctx.db
      .query("users")
      .withIndex("by_IsOrganizer", (q) => q.eq("isOrganizer", true))
      .collect();

    return await asyncMap(clients, async (f) => {
      const eventsCreated = (
        await ctx.db
          .query("events")
          .withIndex("by_Owner", (q) => q.eq("owner", f._id))
          .collect()
      ).length;
      return {
        ...f,
        events: eventsCreated,
      };
    });
  },
});
