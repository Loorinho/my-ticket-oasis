"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../../convex/_generated/api";
// import { LoaderButton } from "@/components/loader-button";
import { Calendar, CalendarIcon, Loader2Icon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  DateTimePicker,
  TimePicker,
  TimePickerInput,
} from "@/components/ui/date-time-picker";
// import { Calendar } from "@/components/ui/calendar";

const eventSchema = z.object({
  name: z.string(),
  description: z.string(),
  // date: z.string(),
  // newEventDate: z.date(),
  fee: z.number(),
  type: z.enum(
    [
      "Galas and Dinners",
      "Music Concert",
      "Training Seminars or Workshops",
      "Festivals/Carnivals",
    ],
    {
      required_error: "You need to select an event category.",
    }
  ),
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

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<Date | undefined>(undefined);

  const generateUploadUrl = useMutation(api.events.generateUploadUrl);

  const createEvent = useMutation(api.events.createEvent);

  const form = useForm<z.output<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
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
        date: Date.parse(date?.toLocaleDateString() ?? ""),
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

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          size={"sm"}
          className="text-white bg-green-700 hover:bg-green-800"
        >
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
              <Label htmlFor="Event type">Event type</Label>
              <Controller
                control={form.control}
                name="type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Galas and Dinners">
                        Galas and Dinners
                      </SelectItem>
                      <SelectItem value="Music Concert">
                        Music Concert
                      </SelectItem>
                      <SelectItem value="Training Seminars or Workshops">
                        Training Seminars or Workshops
                      </SelectItem>
                      <SelectItem value="Festivals/Carnivals">
                        Festivals/Carnivals
                      </SelectItem>
                      <SelectItem value="Charity">Charity</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {form.formState.errors.type && (
                <span className="text-red-600 text-xs">
                  {form.formState.errors.type.message}
                </span>
              )}
            </div>

            <div>
              <Label htmlFor="name">Event Description</Label>
              <Textarea {...form.register("description")} />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="w-full">
                <Label htmlFor="Event date">Date Picker</Label>
                <DateTimePicker
                  granularity="day"
                  value={date}
                  onChange={setDate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Gates open">Gates Open</Label>
                <TimePicker date={time} onChange={setTime} />
              </div>
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
              className="w-full my-2 bg-green-700 hover:bg-green-800"
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
