"use client";

import { useQuery } from "convex/react";

import { Loader2, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "../../../convex/_generated/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default function TicketsList() {
  //   const events = useQuery(api.events.getAllEvents);

  const tickets = useQuery(api.tickets.getUserTickets);

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
      {tickets === undefined && (
        <div className="flex items-center justify-center w-full h-40">
          <Loader2Icon className="my-20 size-10 animate-spin text-green-700" />
        </div>
      )}

      {tickets && tickets.length > 0 && (
        <Table>
          <TableCaption>
            A list of all your purchased event tickets.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Event name</TableHead>
              <TableHead>Event Date</TableHead>

              <TableHead>Payment method</TableHead>
              <TableHead>Tickets</TableHead>

              <TableHead className="text-left">Total price</TableHead>
              {/* <TableHead className="text-left"></TableHead> */}

              {/* <TableHead className="">Created at</TableHead>
            <TableHead className="">Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets &&
              tickets.map((ticket, index: number) => (
                <TableRow key={ticket._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {ticket.eventName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatter.format(ticket.eventDate)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {ticket.paymentMethod}
                  </TableCell>

                  <TableCell className="font-medium">
                    {ticket.tickets}
                  </TableCell>

                  <TableCell className="font-medium text-left">
                    {currencyFormatter.format(ticket.price)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
