import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllEvents = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("Unauthenticated");
    }

    const _dbUser = await ctx.db
      .query("users")
      .withIndex("by_UserId", (q) => q.eq("userId", user.subject))
      .first();
    if (!_dbUser) {
      throw new Error("No user with that identifier found");
    }

    const isAdmin = _dbUser.role.includes("admin");

    return isAdmin
      ? await ctx.db.query("events").collect()
      : await ctx.db
          .query("events")
          .withIndex("by_Owner", (q) => q.eq("owner", _dbUser._id))
          .collect();
    // return await ctx.db.query("events").collect();
  },
});

export const createEvent = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    date: v.number(),
    fee: v.number(),
    slots: v.number(),
    location: v.string(),
  },
  handler: async (ctx, { name, description, date, fee, slots, location }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User is unauthenticated");
    }

    const _user = await ctx.db
      .query("users")
      .withIndex("by_UserId", (p) => p.eq("userId", user.subject))
      .first();
    if (!_user) {
      throw new Error("No user found");
    }
    return await ctx.db.insert("events", {
      name,
      description,
      date,
      fee,
      slots,
      location,
      owner: _user._id,
    });
  },
});
