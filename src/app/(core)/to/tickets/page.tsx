import TicketsList from "./tickets-table";

export default function TicketsPage() {
  return (
    <div className="container my-4">
      <h1 className="text-3xl text-center text-green-700 font-semibold">
        Tickets
      </h1>

      <TicketsList />
    </div>
  );
}
