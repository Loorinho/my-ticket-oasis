"use client";
import {
  useConvexAuth,
  useQuery,
  Authenticated,
  Unauthenticated,
} from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ImageDown, Loader2Icon } from "lucide-react";
import CreateEventForm from "./create-event-form";
import EventMenu from "./events-menu";
import { useUser } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import EventsList from "./events-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EventsPage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const role = useQuery(api.users.getUserRole, {});
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

  return (
    // <Authenticated>
    <div className="mt-3 space-y-10">
      <h2 className="text-center text-3xl mb-2 text-green-700 font-medium">
        The Events Page
      </h2>

      {role && role.isOrganizer && <CreateEventForm />}

      {events === undefined && (
        <div className="flex items-center justify-center w-full h-40">
          <Loader2Icon className="my-20 size-10 animate-spin text-green-700" />
        </div>
      )}

      {events && events.length === 0 && (
        <div className="text-center">
          <h2 className="font-semibold text-2xl">No events found</h2>
        </div>
      )}

      {events && role && role.isAdmin ? (
        <EventsList events={events} />
      ) : (
        <>
          {events && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white shadow-md p-4 rounded-lg relative h-[450px] w-[400px] space-y-2"
                >
                  {role && role.isAdmin && <EventMenu event={event!} />}

                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.name + "'s image"}
                      className="h-[200px] w-[400px] inset-0 object-cover"
                      height={200}
                      width={200}
                    />
                  ) : (
                    <ImageDown className="h-[200px] w-full" />
                  )}

                  <div className="max-h-[250px]">
                    <h2 className="text-2xl font-bold text-center mty-2">
                      {event.name}
                    </h2>
                    {/* <p className="text-gray-500">{event.description}</p> */}
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

                    {role && role.isOrganizer && (
                      <p className="my-2">
                        Status:{" "}
                        <span
                          className={cn(
                            "px-2 py-[3px] rounded-md",
                            event.approvedByAdmin
                              ? "bg-green-500/80 text-white"
                              : "bg-red-500 text-white"
                          )}
                        >
                          {event.approvedByAdmin ? "Approved" : "Pending"}
                        </span>
                      </p>
                    )}

                    <Link
                      className="block my-2"
                      href={`/events/${event._id}/purchase`}
                    >
                      <Button
                        className="w-full bg-green-700 text-white  hover:bg-green-800"
                        size={"sm"}
                      >
                        Purchase Ticket
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
