import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, Wallet } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { toast } from "./ui/use-toast";
import Image from "next/image";
import { useEffect } from "react";

const ticketSchema = z.object({
  tickets: z.string().min(1, "You must select number of tickets"),
  paymentMethod: z.enum(["card", "mobile-money", "paypal"]),
  paymentNumber: z.string().min(1, "You must provide payment details"),
});

export function TicketPurchase({ event }: { event: any }) {
  const formatter = new Intl.DateTimeFormat("en", {
    dateStyle: "full",
  });

  const currencyFormatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "UGX",
  });

  const form = useForm<z.output<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      tickets: "",
      paymentMethod: "card",
      paymentNumber: "",
    },
  });

  async function onSubmit(data: z.output<typeof ticketSchema>) {
    console.log(data);

    // try {

    //   form.reset();
    // } catch (error) {
    //   toast({
    //     title: "Payment unsuccessfull",
    //     description: `Unable to process payment. Please try again later!`,
    //     variant: "destructive",
    //   });
    // }
  }

  const mode = form.getValues().paymentMethod;
  const tickets = form.getValues().tickets;

  // useEffect(() => {}, [mode]);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white py-5 px-6 md:px-8 container">
      <div className="grid gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-700">{event.name}</h1>
          <p className="text-muted-foreground">
            {formatter.format(event.date)} | {event.location}
          </p>
        </div>
        <Card className="py-3">
          <CardContent className="grid gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-3/3 space-y-3 "
              >
                <div>
                  <Label htmlFor="tickets">Tickets</Label>
                  <Controller
                    control={form.control}
                    name="tickets"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of tickets" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 ticket</SelectItem>
                          <SelectItem value="2">2 tickets</SelectItem>
                          <SelectItem value="3">3 tickets</SelectItem>
                          <SelectItem value="4">4 tickets</SelectItem>
                          <SelectItem value="5">5 tickets</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {form.formState.errors.tickets && (
                    <span className="text-red-600 text-xs">
                      {form.formState.errors.tickets.message}
                    </span>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>Payment Method</Label>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        {/* <Label>Select Payment Method</Label> */}
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex items-center gap-4 space-y-1"
                            //  defaultChecked={true}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value="card"
                                  defaultChecked={true}
                                />
                              </FormControl>
                              <CreditCard className="w-5 h-5 text-primary" />
                              Credit/Debit Card
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="mobile-money" />
                              </FormControl>
                              <Wallet className="w-5 h-5 text-primary" />
                              Mobile Money
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="paypal" />
                              </FormControl>
                              <DollarSign className="w-5 h-5 text-primary" />
                              PayPal
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <div className="flex items-center gap-4">
                    <RadioGroup
                      defaultValue="card"
                      className="flex items-center gap-4"
                    >
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <RadioGroupItem id="card" value="card" />
                        <CreditCard className="w-5 h-5 text-primary" />
                        Credit/Debit Card
                      </Label>
                      <Label
                        htmlFor="mobile-money"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <RadioGroupItem
                          id="mobile-money"
                          value="mobile-money"
                        />
                        <Wallet className="w-5 h-5 text-primary" />
                        Mobile Money
                      </Label>
                      <Label
                        htmlFor="paypal"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <RadioGroupItem id="paypal" value="paypal" />
                        <DollarSign className="w-5 h-5 text-primary" />
                        PayPal
                      </Label>
                    </RadioGroup>
                  </div> */}
                </div>

                <>
                  <div className="grid gap-2">
                    <Label htmlFor="">
                      {mode === "paypal"
                        ? "Email"
                        : mode === "mobile-money"
                          ? "Mobile money number"
                          : "Card number"}
                    </Label>

                    <Input
                      id="email"
                      {...form.register("paymentNumber")}
                      type={mode === "paypal" ? "email" : "text"}
                      placeholder={
                        mode === "paypal"
                          ? "Enter your paypal email"
                          : "Enter your number"
                      }
                    />
                  </div>
                </>
                {/* 
                {mode === "mobile-money" && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Mobile money number</Label>
                      <Input
                        // id="email"
                        type="number"
                        placeholder="Enter your mobile money number"
                      />
                    </div>
                  </>
                )} */}

                <Button
                  type="submit"
                  className="w-full bg-green-700 text-white hover:bg-green-800"
                >
                  Buy
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>Ticket(s)</div>
              <div>{tickets}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Fees</div>
              <div>{currencyFormatter.format(event.fee)}</div>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-medium">
              <div>Total</div>
              <div>$110</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-700 text-white hover:bg-green-800">
              Complete Purchase
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
