"use client";
import TicketSalesTable from "./ticket-sales-table";

export default function TicketSalesPage() {
  return (
    <div>
      <h1 className="text-center font-semibold text-green-700 text-2xl">
        Ticket Sales
      </h1>
      <TicketSalesTable />
    </div>
  );
}
