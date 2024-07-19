"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../convex/_generated/api";
// import { LoaderButton } from "@/components/loader-button";
import { Loader2Icon } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";

const eventSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string(),
  fee: z.number(),
  slots: z.number(),
  location: z.string(),
  image: z
    .custom<FileList>(
      (val) => val instanceof FileList,
      "Banner image is required"
    )
    .refine((files) => files.length > 0, "Event image is required"),
});

export default function CreateEventForm() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const generateUploadUrl = useMutation(api.events.generateUploadUrl);

  const createEvent = useMutation(api.events.createEvent);

  const form = useForm<z.output<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      date: date!!.toLocaleDateString(),
      fee: 0,
      slots: 0,
      location: "",
      image: undefined,
    },
  });

  const fileRef = form.register("image");

  async function onSubmit(data: z.infer<typeof eventSchema>) {
    try {
      const postUrl = await generateUploadUrl();

      const postResult = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": data.image[0].type },
        body: data.image[0],
      });
      const { storageId } = await postResult.json();

      await createEvent({
        name: data.name,
        description: data.description,
        date: Date.parse(data.date),
        fee: data.fee,
        slots: data.slots,
        location: data.location,
        image: storageId,
      });

      toast({
        title: "Success",
        description: `Event added successfully`,
      });

      form.reset();
      setSheetOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Sorry! Unable to add event. Please try again later`,
        variant: "destructive",
      });
    }
  }

  // console.log(form.formState.errors);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"} className="text-white bg-green-700">
          Create Event
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create a new event</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div>
              <Label htmlFor="name">Event Name</Label>
              <Input {...form.register("name")} />
            </div>

            <div>
              <Label htmlFor="name">Event Description</Label>
              <Textarea {...form.register("description")} />
            </div>

            <div>
              <Label htmlFor="name">Event Date</Label>
              {/* <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Choose a date</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover> */}

              <Input {...form.register("date")} type="date" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Entry fare</Label>
                <Input
                  {...form.register("fee", { valueAsNumber: true })}
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="name">Available slots</Label>
                <Input
                  {...form.register("slots", { valueAsNumber: true })}
                  type="number"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="name">Location</Label>
              <Input {...form.register("location")} />
            </div>

            <div>
              <Label>Image</Label>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="file" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <Button
              className="w-full my-2 bg-green-700"
              size={"sm"}
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2Icon className="animate-spin w-4 h-4 mr-2" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Event</span>
              )}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
