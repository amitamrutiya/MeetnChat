"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { signInSchema } from "@/schemas/signinSchema";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAuth } from "@/app/hooks/useAuth";

function SignInForm() {
  const { onSignInFormSubmit, isSubmitting } = useAuth();
  const signinForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-secondary rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold mb-6">Please Login to Use</h1>
        <p className="mb-4">Sign in to start your anonymous adventure</p>
      </div>
      <Form {...signinForm}>
        <form
          onSubmit={signinForm.handleSubmit(onSignInFormSubmit)}
          className="space-y-4 flex flex-col"
        >
          <FormField
            name="identifier"
            control={signinForm.control}
            render={({ field }) => (
              <FormItem >
                <FormLabel className="flex">Email/Username</FormLabel>
                <FormControl>
                  <Input placeholder="Email/Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={signinForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
      </Form>
      <Button
        variant={"link"}
        onClick={() => signIn("google")}
        className="w-full"
      >
        Sign in with Google{" "}
      </Button>
    </div>
  );
}

export default SignInForm;
