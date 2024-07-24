import NextTopLoader from "nextjs-toploader";

import { Header } from "@/components/shared/header/header";
import { Toaster } from "@/components/ui/toaster";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="">{children}</main>;
}
