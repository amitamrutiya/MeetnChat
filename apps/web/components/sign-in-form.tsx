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
      <div className="bg-background w-full max-w-md space-y-6 rounded-lg p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-2xl font-extrabold text-white">Please Login to Use</h1>
          <p className="mb-4 text-white">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...signinForm}>
          <form onSubmit={signinForm.handleSubmit(onSignInFormSubmit)} className="flex flex-col space-y-4">
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
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md px-4 font-medium dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
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
          className="group/btn relative h-10 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
        >
          <span>Sign in with Google</span> <BottomGradient />
        </Button>
      </div>
    </ShineBorder>
  );
}

export default SignInForm;
