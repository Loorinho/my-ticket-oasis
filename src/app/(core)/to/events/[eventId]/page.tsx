"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import Image from "next/image";

export default function EventDetailsPage() {
  const { eventId } = useParams();

  const event = useQuery(
    api.events.getEvent,
    eventId ? { eventId: eventId as Id<"events"> } : "skip"
  );

  const currencyFormatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "UGX",
  });

  const dateFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "full",
  });

  return (
    <div className="pt-5 mx-auto w-full space-y-6 container">
      <h1 className="text-center text-3xl font-semibold text-green-600">
        Event Details
      </h1>

      <div className="grid grid-cols-2 w-full gap-4">
        {event && event.image ? (
          <Image
            src={event?.image!}
            alt={event?.name!}
            width={700}
            height={500}
            className="w-full rounded-lg"
          />
        ) : (
          <Image
            src={"/images/iplaceholder.png"}
            alt={event?.name!}
            width={500}
            height={500}
            className="w-full"
          />
        )}

        {event && (
          <div className="space-y-4">
            <p className="font-semibold text-2xl">{event.name}</p>

            <p>{event.description}</p>

            <p>{`Venue: ${event.location}`}</p>

            <p>{`Entrance fee: ${currencyFormatter.format(event.fee)}`}</p>

            <p>{`Date: ${dateFormatter.format(event.date)}`}</p>

            <p>{`Available tickets: ${event.slots}`}</p>

            <p>{`Event owner: ${event.owner?.name}`}</p>

            <p>{`Event added on: ${dateFormatter.format(event._creationTime)}`}</p>
          </div>
        )}
      </div>
    </div>
  );
}
