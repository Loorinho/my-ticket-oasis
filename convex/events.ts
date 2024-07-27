import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { asyncMap } from "./lib/relationships";

export const createEvent = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    date: v.number(),
    fee: v.number(),
    slots: v.number(),
    location: v.string(),
    image: v.id("_storage"),
    // newEventDate: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { name, description, date, fee, slots, location, image }
  ) => {
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
      image,
      purchasedTickets: 0,
      // newEventDate: newEventDate,/
    });
  },
});

export const getEvent = query({
  args: {
    eventId: v.id("events"),
  },
  handler: async (ctx, { eventId }) => {
    const _event = await ctx.db.get(eventId);
    if (!_event) {
      throw new Error("No event found");
    }

    return {
      ..._event,
      image: _event.image ? await ctx.storage.getUrl(_event.image) : null,
      owner: await ctx.db.get(_event.owner),
    };
  },
});

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

    const isAdmin = _dbUser.role.includes("toasis-admin");

    const isOrganizer = _dbUser.isOrganizer;

    const _theEvents = await ctx.db.query("events").collect();

    const _eventsWithImages = await asyncMap(_theEvents, async (f) => {
      return {
        ...f,
        image: f.image ? await ctx.storage.getUrl(f.image) : null,
      };
    });

    if (!isAdmin && !isOrganizer) {
      return _eventsWithImages.filter((f) => f.approvedByAdmin === true);
    } else if (isOrganizer) {
      return _eventsWithImages.filter((f) => f.owner === _dbUser._id);
    } else {
      return _eventsWithImages;
    }
    //   const usersEvents = await ctx.db
    //     .query("events")
    //     .filter((q) => q.eq(q.field("approvedByAdmin"), true))
    //     .collect();

    // const _events = isAdmin
    //   ? await ctx.db.query("events").collect()
    //   : await ctx.db
    //       .query("events")
    //       .withIndex("by_Owner", (q) => q.eq("owner", _dbUser._id))
    //       .collect();

    // return await asyncMap(_events, async (f) => {
    //   return {
    //     ...f,
    //     image: f.image ? await ctx.storage.getUrl(f.image) : null,
    //   };
    // });
    // return await ctx.db.query("events").collect();
  },
});

export const approveOrRejectEvent = mutation({
  args: {
    eventId: v.id("events"),
    approved: v.boolean(),
  },
  handler: async (ctx, { eventId, approved }) => {
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

    const _event = await ctx.db.get(eventId);
    if (!_event) {
      throw new Error("No event found");
    }

    if (!_user.role.includes("toasis-admin")) {
      throw new Error("User is not an admin");
    }

    return await ctx.db.patch(eventId, {
      approvedByAdmin: approved,
    });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
