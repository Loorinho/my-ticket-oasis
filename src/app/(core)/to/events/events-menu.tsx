"use client";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Check,
  CheckCircleIcon,
  EllipsisVertical,
  Eye,
  List,
  Loader,
  PenLine,
  Replace,
  TrashIcon,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import Link from "next/link";

const schema = z.object({
  reason: z.string().min(1, "Please provide a reason"),
});

export default function EventMenu({ event }: { event: Doc<"events"> }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  //   const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);

  const approveOrRejectEvent = useMutation(api.events.approveOrRejectEvent);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: "",
    },
  });

  const router = useRouter();

  return (
    // <div className="absolute top-0 right-0 p-4">
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className="text-center ml-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className=" text-green-600 cursor-pointer hover:text-green-700">
            <Link
              href={`/events/${event._id}`}
              className="flex gap-2 items-center"
            >
              <List className="size-4" />
              View details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            // onClick={() => setIsDeleteDialogOpen(true)}
            onClick={async () => {
              await approveOrRejectEvent({
                eventId: event._id,
                approved: true,
              });

              toast({
                title: "Event approval",
                description: `You have successfully approved the event`,
              });
            }}
            className="flex gap-2 items-center text-blue-600 cursor-pointer"
          >
            <Check className="size-4" />
            Approve
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={async () => {
              await approveOrRejectEvent({
                eventId: event._id,
                approved: false,
              });

              toast({
                title: "Event approval",
                description: `You have refused to approve the event`,
                variant: "destructive",
              });

              //TODO: Add a reason for rejection
            }}
            className="flex gap-2 items-center text-red-600 cursor-pointer hover:text-red-700"
          >
            <X className="size-4 " />
            Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
