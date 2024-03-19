import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormSubmitHandler,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
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
import { Input } from "../components/ui/input";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password mus be atleast 8 characters",
  }),
});

type LoginForm = z.infer<typeof formSchema>;
export default function LoginPage() {
  const router = useRouter();
  const { mutate } = api.auth.signup.useMutation({
    onSuccess: async () => await router.push("/verify"),
  });
  const form = useForm<LoginForm>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<{
    name: string;
    email: string;
    password: string;
  }> = async ({ name, email, password }) => {
    mutate({ name, email, password });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto my-9 flex max-w-xl flex-col justify-center space-y-8 rounded-md border-2 p-8"
      >
        <h1 className="mx-auto w-fit text-4xl font-bold	">
          Create your Account
        </h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
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
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">CREATE ACCOUNT</Button>
      </form>
    </Form>
  );
}
