import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    // gender: v.string(),
    role: v.array(v.string()),
    isOrganizer: v.boolean(),
    userId: v.string(),
    status: v.optional(v.string()),
    isVerified: v.optional(v.boolean()),
  })
    .index("by_UserId", ["userId"])
    .index("by_Role", ["role"])
    .index("by_IsOrganizer", ["isOrganizer"]),
  events: defineTable({
    name: v.string(),
    description: v.string(),
    date: v.number(),
    fee: v.number(),
    slots: v.number(),
    location: v.string(),
    type: v.optional(v.string()),
    owner: v.id("users"),
    approvedByAdmin: v.optional(v.boolean()),
    image: v.optional(v.id("_storage")),
  }).index("by_Owner", ["owner"]),

  tickets: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
    price: v.number(),
    tickets: v.number(),
    paymentMethod: v.string(),
    // qrcode: v.id("_storage")
  })
    .index("by_Event", ["eventId"])
    .index("by_User", ["userId"]),
});
