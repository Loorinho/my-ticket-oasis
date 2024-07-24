import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      fallbackRedirectUrl={"/events"}
      forceRedirectUrl="/events"
      afterSignOutUrl={"/auth/sign-in"}
    />
  );
}
