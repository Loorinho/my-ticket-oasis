"use client";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { TicketPurchase } from "@/components/ticket-purchase";

type EventType = {};

export default function PurchaseTicketPage() {
  const { eventId } = useParams();

  const event = useQuery(
    api.events.getEvent,
    eventId ? { eventId: eventId as Id<"events"> } : "skip"
  );

  return (
    <div className="container">{event && <TicketPurchase event={event} />}</div>
  );
}
