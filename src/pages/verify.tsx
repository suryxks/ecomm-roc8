import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../components/ui/input-otp";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function VerifyOTP() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto my-9 flex w-2/3 max-w-xl flex-col justify-around space-y-8 rounded-md border-2 p-8"
      >
        <h1 className="mx-auto w-fit text-4xl font-bold	">Verify your Email </h1>
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem className="mx-auto w-fit p-4">
              <FormLabel>Code</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={8}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} />
                      ))}{" "}
                    </InputOTPGroup>
                  )}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your Email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">VERIFY</Button>
      </form>
    </Form>
  );
}
