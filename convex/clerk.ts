"use node";

import type { WebhookEvent } from "@clerk/clerk-sdk-node";

import { Webhook } from "svix";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const fulfill = internalAction({
  args: { headers: v.any(), payload: v.string() },
  handler: async (ctx, args) => {
    // Pass the arguments into the svix to verify using the secret clerk webhook signature

    // this wh secret key(created from within clerk) we set it in the clerk environment variables
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

    // this line helos us verify that indeed the message we are sending is coming from clerk
    const payload = wh.verify(args.payload, args.headers) as WebhookEvent;

    return payload;
  },
});
