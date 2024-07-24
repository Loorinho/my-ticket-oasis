import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    // <section className="h-screen flex justify-center items-center">
    <SignUp fallbackRedirectUrl={"/dashboard/health-records"} />
    // </section>
  );
}
