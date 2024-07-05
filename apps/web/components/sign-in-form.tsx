"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { BottomGradient, LabelInputContainer } from "./common";
import { signInSchema } from "@repo/common";
import { Button, ShineBorder, Form, FormField, FormItem, FormLabel, FormControl, Input, FormMessage } from "@repo/ui";
import { useAuth } from "hooks/use-auth";

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
    <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={7} borderWidth={4}>
      <div className="w-full max-w-md p-8 space-y-6 bg-background rounded-lg shadow-md ">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold mb-6 text-white">Please Login to Use</h1>
          <p className="mb-4 text-white">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...signinForm}>
          <form onSubmit={signinForm.handleSubmit(onSignInFormSubmit)} className="space-y-4 flex flex-col">
            <FormField
              name="identifier"
              control={signinForm.control}
              render={({ field }) => (
                <FormItem>
                  <LabelInputContainer>
                    <FormLabel className="flex">Email/Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Email/Username" {...field} />
                    </FormControl>
                  </LabelInputContainer>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={signinForm.control}
              render={({ field }) => (
                <FormItem>
                  <LabelInputContainer>
                    <FormLabel className="flex">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                  </LabelInputContainer>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full rounded-md h-10 font-medium shadow-input dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Log In"
              )}
              <BottomGradient />
            </Button>
          </form>
        </Form>
        <Button
          type="button"
          variant={"link"}
          onClick={() => signIn("google")}
          className=" relative group/btn  h-10 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
        >
          <span>Sign in with Google</span> <BottomGradient />
        </Button>
      </div>
    </ShineBorder>
  );
}

export default SignInForm;
