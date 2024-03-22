/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Oval } from "react-loader-spinner";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password mus be atleast 8 characters",
  }),
});

type SignupForm = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<SignupForm>({
    resolver: zodResolver(formSchema),
  });
  const { mutate, isPending } = api.auth.login.useMutation({
    onSuccess: async () => {
      await router.push("/category?page=1");
    },
    onError: (error) => {
      form.setError(
        "root",
        { type: "Invalid", message: error.message },
        {
          shouldFocus: true,
        },
      );
    },
  });

  const onSubmit: SubmitHandler<{
    email: string;
    password: string;
  }> = async ({ email, password }) => {
    mutate({ email, password });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto my-9 flex max-w-xl flex-col justify-center space-y-4 rounded-md border-2 p-8"
      >
        <h1 className="mx-auto mb-0 mt-2 w-fit text-4xl	font-bold">Login </h1>
        <div className="mx-auto mb-0  w-fit text-2xl font-semibold">
          Welcome back to ECOMMERCE
        </div>
        <div className="mx-auto my-0  w-fit ">
          The next gen business marketplace
        </div>
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
        <Button type="submit" className="my-4">
          {isPending ? (
            <Oval
              color="#09090B"
              secondaryColor="#E4E4E7"
              height={32}
              width={32}
            />
          ) : (
            "LOGIN"
          )}
        </Button>
        {form.formState.errors.root && (
          <p className="text-md	 text-semibold mx-auto text-red-700">
            {form.formState.errors.root.message}
          </p>
        )}
        <div className="mx-auto flex gap-1">
          <div>Don’t have an Account? </div>
          <Link href="/signup" className="font-bold">
            Signup
          </Link>
        </div>
      </form>
    </Form>
  );
}
