"use client";

import { useConvexAuth, useQuery } from "convex/react";

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

export default function ClientsList() {
  //   const events = useQuery(api.events.getAllEvents);

  const { isAuthenticated } = useConvexAuth();

  const clients = useQuery(api.users.getClients, isAuthenticated ? {} : "skip");

  const formatter = new Intl.DateTimeFormat("en-UG", {
    dateStyle: "full",
    // timeStyle: "long",
  });

  const currencyFormatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "UGX",
  });

  return (
    <div className="my-5">
      {clients === undefined && (
        <div className="flex items-center justify-center w-full h-40">
          <Loader2Icon className="my-20 size-10 animate-spin text-green-700" />
        </div>
      )}
      {clients && clients.length > 0 && (
        <Table>
          <TableCaption>A list of all registered clients.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>

              <TableHead className="text-center">Events created</TableHead>

              {/* <TableHead className="text-left">Status</TableHead> */}

              <TableHead className="">Registered on</TableHead>
              {/* <TableHead className="">Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients &&
              clients.map((client, index: number) => (
                <TableRow key={client._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/clients/${client._id}`}>{client.name}</Link>
                  </TableCell>
                  <TableCell className="font-medium">{client.email}</TableCell>
                  <TableCell className="font-medium text-center">
                    {client.events}
                  </TableCell>

                  <TableCell className="font-medium text-left">
                    {formatter.format(client._creationTime)}
                  </TableCell>
                  {/* <TableCell>
                  <EventMenu event={event as any} key={event._creationTime} />
                </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      {clients && clients.length === 0 && (
        <div className="flex items-center justify-center w-full h-40">
          <p className="text-center text-gray-600">
            No clients registered yet.
          </p>
        </div>
      )}
    </div>
  );
}
