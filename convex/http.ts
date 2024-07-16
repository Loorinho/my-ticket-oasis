// import { createHospital } from './hospitals';
import { httpRouter } from "convex/server";

import { api, internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

http.route({
  path: "/ticketoasis/new-account",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      // calling function to decode the singature that comes in
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id")!,
          "svix-timestamp": headerPayload.get("svix-timestamp")!,
          "svix-signature": headerPayload.get("svix-signature")!,
        },
      });

      // checking the type of a webhook event
      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            clerkId: result.data.id,
            email: result.data.email_addresses[0]?.email_address,
            name: `${result.data.first_name} ${result.data.last_name}`,
          });
          break;
      }

      return new Response(null, {
        status: 200,
        // data: result.data.object.
      });
    } catch (error) {
      return new Response(null, {
        status: 400,
      });
    }
  }),
});

export default http;
