"use client";
import {
  useConvexAuth,
  useQuery,
  Authenticated,
  Unauthenticated,
} from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import CreateEventForm from "./create-event-form";
import EventMenu from "./events-menu";
import { useUser } from "@clerk/clerk-react";

export default function EventsPage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const isAdmin = useQuery(api.users.getUserRole, {});
  const events = useQuery(
    api.events.getAllEvents,
    !isAuthenticated ? "skip" : {}
  );

  const currencyFormatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "UGX",
  });

  const dateFormatter = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  // console.log(events);

  return (
    <Authenticated>
      <div className="mt-3 space-y-10">
        <CreateEventForm />

        {events === undefined && (
          <div className="flex items-center justify-center w-full h-40">
            <Loader2Icon className="my-20 size-10 animate-spin" />
          </div>
        )}

        {events && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white shadow-md p-4 rounded-lg relative"
              >
                {isAdmin !== undefined && isAdmin.isAdmin && (
                  <EventMenu event={event} />
                )}
                <h2 className="text-xl font-bold text-center">{event.name}</h2>
                <p className="text-gray-500">{event.description}</p>
                <p className="text-gray-500">
                  <span className="mr-2">Entrance fee: </span>

                  {currencyFormatter.format(event.fee)}
                </p>
                <p className="text-gray-500">
                  <span className="mr-2">Date: </span>
                  {dateFormatter.format(event.date)}
                </p>

                <p className="text-gray-500">
                  <span className="mr-2">Location: </span>

                  {event.location}
                </p>
                <p className="text-gray-500">
                  <span className="mr-2">Available slots: </span>

                  {event.slots}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Authenticated>
  );
}
