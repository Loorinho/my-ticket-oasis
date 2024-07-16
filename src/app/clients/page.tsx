// import { pageTitleStyles } from "@/styles/common";
import { cn } from "@/lib/utils";
import CreateClientForm from "./create-client-form";
// import { getAppClients } from "@/data-access/clients";

export default async function ClientsPage() {
  //   const clients = await getAppClients();

  // console.log(clients);
  return (
    <div className="pt-5 mx-auto w-full space-y-6">
      <h1 className="text-center text-3xl font-semibold">Registered clients</h1>

      <CreateClientForm />

      {/* {clients.map((client) => {
        return <p key={client.id}>{client.name}</p>;
      })} */}

      <p>Clients go here</p>
    </div>
  );
}
