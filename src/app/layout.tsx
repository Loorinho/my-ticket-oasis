import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import NextTopLoader from "nextjs-toploader";

import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Header } from "@/components/shared/header/header";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ticket - Oasis",
  icons: [
    { rel: "icon", type: "image/png", sizes: "48x48", url: "/favicon.ico" },
  ],
  keywords: "yolo",
  description: "Your one stop center for the quickest ticketing service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className
        )}
      >
        <Providers>
          <NextTopLoader />
          <Header />
          <div className="w-full mx-auto container pb-12 pt-4">{children}</div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
