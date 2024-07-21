import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { asyncMap } from "./lib/relationships";

export const purchaseTicket = mutation({
  args: {
    eventId: v.id("events"),
    // userId: v.id("users"),
    price: v.number(),
    tickets: v.number(),
    paymentMethod: v.string(),
  },
  handler: async (ctx, { eventId, price, tickets, paymentMethod }) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("Unauthenticated");
    }

    const _user = await ctx.db
      .query("users")
      .withIndex("by_UserId", (q) => q.eq("userId", user.subject))
      .first();

    if (!_user) {
      throw new Error("No user with that identifier exists");
    }
    await ctx.db.insert("tickets", {
      eventId,
      price,
      tickets,
      userId: _user._id,
      paymentMethod,
    });
  },
});

export const getUserTickets = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new Error("Unauthenticated");
    }

    const _user = await ctx.db
      .query("users")
      .withIndex("by_UserId", (q) => q.eq("userId", user.subject))
      .first();

    if (!_user) {
      throw new Error("No user with that identifier exists");
    }

    const _tickets = await ctx.db
      .query("tickets")
      .withIndex("by_User", (q) => q.eq("userId", _user._id))
      .collect();

    return await asyncMap(_tickets, async (f) => {
      const event = await ctx.db.get(f.eventId);

      return {
        ...f,
        eventName: event?.name,
        eventDate: event?.date,
      };
    });
  },
});
