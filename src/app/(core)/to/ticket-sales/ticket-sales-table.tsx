"use client";

import { useConvexAuth, useQuery } from "convex/react";

import { Loader2, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "../../../../../convex/_generated/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import EventMenu from "./events-menu";
import Link from "next/link";

export default function TicketSalesTable() {
  const { isAuthenticated } = useConvexAuth();

  const events = useQuery(
    api.events.getAllEvents,
    isAuthenticated ? {} : "skip"
  );

  const formatter = new Intl.DateTimeFormat("en-UG", {
    dateStyle: "full",
    // timeStyle: "long",
  });

  const currencyFormatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "UGX",
  });

  return (
    <div className="mb-5">
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

      {events && events.length > 0 && (
        <Table>
          <TableCaption>A list of all available events.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Event Date</TableHead>

              <TableHead>Entance fee</TableHead>

              <TableHead className="text-center">Available Tickets</TableHead>
              <TableHead className="text-center">Sold Tickets</TableHead>
              <TableHead className="text-left">Collected</TableHead>

              {/* <TableHead className="text-center">Status</TableHead> */}

              <TableHead className="">Created on</TableHead>
              {/* <TableHead className="">Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {events &&
              events.map((event: any, index: number) => (
                <TableRow key={event._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/events/${event._id}`}>{event.name}</Link>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatter.format(event.date)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {event.fee === 0
                      ? "Free entry"
                      : currencyFormatter.format(event.fee)}
                  </TableCell>

                  <TableCell className="font-medium text-center">
                    {event.slots}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {event.purchasedTickets}
                  </TableCell>
                  <TableCell className="font-medium text-left">
                    {currencyFormatter.format(
                      event.purchasedTickets * event.fee
                    )}
                  </TableCell>

                  {/* <TableCell className="font-medium text-left">
                    <span
                      className={cn("", {
                        "px-3 py-1 bg-red-200 hover:bg-red-300 rounded-full text-sm font-semibold text-red-600":
                          !event.approvedByAdmin,
                        "px-3 py-1 bg-green-200 hover:bg-green-300 rounded-full text-sm font-semibold text-green-600":
                          event.approvedByAdmin,
                      })}
                    >
                      {!event.approvedByAdmin && "Pending"}

                      {event.approvedByAdmin && "Approved"}
                    </span>
                  </TableCell> */}

                  <TableCell className="font-medium text-left">
                    {formatter.format(event._creationTime)}
                  </TableCell>
                  <TableCell>
                    {/* <EventMenu event={event as any} key={event._creationTime} /> */}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
