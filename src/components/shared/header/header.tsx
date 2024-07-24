"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Lightbulb, Loader2Icon, LogOut } from "lucide-react";
// import { getUserProfileUseCase } from "@/use-cases/users";
import { ModeToggle } from "./mode-toggle";
import { MenuButton } from "./menu-button";
// import { UserId } from "@/types";
import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useQuery,
} from "convex/react";
import { SignInButton, SignOutButton, UserButton } from "@clerk/clerk-react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { redirect, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

// const profilerLoader = cache(getUserProfileUseCase);

export function Header() {
  // const user = await getCurrentUser();

  const router = useRouter();

  const pathname = usePathname();

  const { isAuthenticated } = useConvexAuth();

  // if (!isAuthenticated) {
  //   return router.push("/");
  // }

  const role = useQuery(api.users.getUserRole, isAuthenticated ? {} : "skip");

  console.log("Inside header");

  return (
    <header className="border-b text-xl py-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex gap-2 items-center text-xl">
          <div className="hidden md:block">
            Ticket<span className="text-green-700 font-semibold">Oasis</span>
          </div>
        </Link>

        <div>
          {/* <Suspense
            fallback={
              <div className="flex items-center justify-center w-40">
                <Loader2Icon className="animate-spin w-4 h-4" />
              </div>
            }
          > */}
          <Authenticated>
            <div className="flex gap-8 items-center">
              <div className="flex items-center gap-2">
                <nav className="flex gap-4 items-center px-10">
                  {role && role.isAdmin && (
                    <>
                      <Link
                        href={"/dashboard"}
                        className={cn("", {
                          "text-green-700 font-semibold":
                            pathname.includes("/dashboard"),
                        })}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href={"/clients"}
                        className={cn("", {
                          "text-green-700 font-semibold":
                            pathname.includes("/clients"),
                        })}
                      >
                        Clients
                      </Link>
                    </>
                  )}

                  {role && role.isOrganizer && (
                    <>
                      <Link
                        href={"/ticket-sales"}
                        className={cn("", {
                          "text-green-700 font-semibold":
                            pathname.includes("/ticket-sales"),
                        })}
                      >
                        Ticket Sales
                      </Link>
                    </>
                  )}

                  <Link
                    href={"/events"}
                    className={cn("", {
                      "text-green-700 font-semibold":
                        pathname.includes("/events"),
                    })}
                  >
                    Events
                  </Link>

                  {role && role.isNormalUser && (
                    <>
                      <Link
                        href={"/tickets"}
                        className={cn("", {
                          "text-green-700 font-semibold":
                            pathname.includes("/tickets"),
                        })}
                      >
                        Tickets
                      </Link>
                    </>
                  )}

                  {/* <Link href={"/dashboard"}>Dashboard</Link> */}
                </nav>
                <UserButton signInUrl="/auth/sign-in" />

                {/* {user && ( */}

                {/* )} */}
              </div>

              {/* <SignOutButton /> */}
            </div>
          </Authenticated>
          {/* </Suspense> */}

          <Unauthenticated>
            <SignInButton>
              <Button
                size={"sm"}
                className="bg-green-700 text-white hover:bg-green-800"
              >
                Sign in
              </Button>
            </SignInButton>
          </Unauthenticated>

          {/* <div className="flex items-center justify-between gap-5"></div>
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-40">
                <Loader2Icon className="animate-spin w-4 h-4" />
              </div>
            }
          ></Suspense> */}
        </div>
      </div>
    </header>
  );
}

// async function ProfileAvatar({ userId }: { userId: number }) {
//   const profile = await profilerLoader(userId);

//   return (
//     <Avatar>
//       <AvatarImage src={"/next.svg"} />
//       <AvatarFallback>
//         {profile.displayName?.substring(0, 2).toUpperCase() ?? "AA"}
//       </AvatarFallback>
//     </Avatar>
//   );
// }

// async function HeaderActions() {
//   const user = await getCurrentUser();
//   const isSignedIn = !!user;

//   return (
//     <>
//       {isSignedIn ? (
//         <>
//           <div className="hidden md:block">
//             <ModeToggle />
//           </div>
//           <ProfileDropdown userId={user.id} />
//           <div className="md:hidden">
//             <MenuButton />
//           </div>
//         </>
//       ) : (
//         <>
//           <ModeToggle />

//           <Button asChild variant="secondary">
//             <Link href="/sign-in">Sign In</Link>
//           </Button>
//         </>
//       )}
//     </>
//   );
// }
// async function ProfileDropdown({ userId }: { userId: UserId }) {
//   const profile = await profilerLoader(userId);
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger>
//         <Suspense
//           fallback={
//             <div className="bg-gray-800 rounded-full h-10 w-10 shrink-0 flex items-center justify-center">
//               ..
//             </div>
//           }
//         >
//           <ProfileAvatar userId={userId} />
//         </Suspense>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent className="space-y-2">
//         <DropdownMenuLabel>{profile.displayName}</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem asChild className="cursor-pointer">
//           <Link className="flex items-center" href={"/api/sign-out"}>
//             <LogOut className="w-4 h-4 mr-2" />
//             Sign Out
//           </Link>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
