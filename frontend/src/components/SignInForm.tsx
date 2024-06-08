"use client";

import React, { useState, useTransition } from "react";
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
import { login } from "@/actions/login";

function SignInForm() {
  const signinForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  const [isPending, startTransaction] = useTransition();

  const onSubmit = (value: z.infer<typeof signInSchema>) => {
    startTransaction(async () => {
      const response = await login(value);
      if (response.success === true) {
        console.log("User Login");
      } else {
        // signinForm.reset();
        console.log(response.message);
      }
    });
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-secondary rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold mb-6">Please Login to Use</h1>
        <p className="mb-4">Sign in to start your anonymous adventure</p>
      </div>
      <Form {...signinForm}>
        <form
          onSubmit={signinForm.handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col"
        >
          <FormField
            name="identifier"
            control={signinForm.control}
            render={({ field }) => (
              <FormItem>
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
          <Button type="submit" disabled={isPending}>
            {isPending ? (
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
        type="button"
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
