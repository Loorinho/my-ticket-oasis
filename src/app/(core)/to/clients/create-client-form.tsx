"use client";

import { z } from "zod";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { pageTitleStyles } from "@/styles/common";
import { cn } from "@/lib/utils";
// import { useServerAction } from "zsa-react";
import { useToast } from "@/components/ui/use-toast";
// import { LoaderButton } from "@/components/loader-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
// import { clientCreateAction } from "./actions";
import { useState } from "react";

const clientCreationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(8),
  telephone: z.string(),
});

export default function CreateClientForm() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof clientCreationSchema>>({
    resolver: zodResolver(clientCreationSchema),
    defaultValues: {
      email: "",
      name: "",
      telephone: "",
    },
  });

  function onSubmit(values: z.infer<typeof clientCreationSchema>) {
    console.log(values);
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"} className="bg-green-700 text-white">
          Create new client
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create new client</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter the client's name"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter your email"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-full"
                      placeholder="Enter the client's telephone number"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>
                  Uhoh, we couldn&apos;t create the client
                </AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )} */}

            <Button>Submit</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
