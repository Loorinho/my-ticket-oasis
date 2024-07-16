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
    // status: v.boolean()
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
    owner: v.id("users"),
  }).index("by_Owner", ["owner"]),
});
