"use client";
// import { pageTitleStyles } from "@/styles/common";
import { cn } from "@/lib/utils";
import CreateClientForm from "./create-client-form";
import { Authenticated, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import ClientsList from "./clients-table";
// import { getAppClients } from "@/data-access/clients";

export default function ClientsPage() {
  const clients = useQuery(api.users.getClients, {});

  return (
    <div className="pt-5 mx-auto w-full space-y-6">
      <h1 className="text-center text-3xl text-green-700 font-semibold">
        Registered clients
      </h1>

      <CreateClientForm />

      <Authenticated>
        <ClientsList />
      </Authenticated>
    </div>
  );
}
