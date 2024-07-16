import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
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
