import { auth } from "./../node_modules/convex/src/cli/auth";
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

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
    });
  },
});
