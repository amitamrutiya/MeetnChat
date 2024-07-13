"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { BottomGradient, LabelInputContainer } from "./common";
import { useSearchParams } from "next/navigation";
import { verifySchema, signUpSchema, ApiResponse } from "@repo/common";
import {
  Button,
  ShineBorder,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@repo/ui";
import { checkUsernameUnique } from "../app/actions/auth/check-username-unique";
import { useAuth } from "../hooks/use-auth";
import { useDebounceCallback } from "usehooks-ts";

function SignupForm() {
  const { onSignUpFormSubmit, onSendVerificationEmail, isSubmitting, sendMail } = useAuth();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 300);

  const signupForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const sendVerificationEmailForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const handleCheckUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await checkUsernameUnique({ username });
          setUsernameMessage(response.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    handleCheckUsernameUnique();
  }, [username]);

  return sendMail ? (
    <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={7} borderWidth={4}>
      <div className="flex bg-black">
        <div className="w-full max-w-md p-8 space-y-8  bg-black rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold mb-6 text-white">Verify Your Account</h1>
            <p className="mb-4 text-white">Enter the verification code sent to your email</p>
            <Form {...signupForm}>
              <form
                onSubmit={signupForm.handleSubmit(() => onSignUpFormSubmit(signupForm.getValues(), username))}
                className="w-full space-y-6 flex flex-col"
              >
                <FormField
                  name="code"
                  control={signupForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup className="flex mx-auto text-white">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>Please enter the one-time password sent to your email.</FormDescription>
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
                    <span>Submit</span>
                  )}
                  <BottomGradient />
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </ShineBorder>
  ) : (
    <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} duration={7} borderWidth={4}>
      <div className="flex items-start justify-start">
        <div className="w-full max-w-md p-8 space-y-8 bg-background rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tighter mb-6 text-white">Please SignUp to Use</h1>
            <p className="mb-4 text-white">Sign up to start your anonymous adventure</p>
          </div>
          <Form {...sendVerificationEmailForm}>
            <form
              onSubmit={sendVerificationEmailForm.handleSubmit(onSendVerificationEmail)}
              className="space-y-4 flex-col flex "
            >
              <FormField
                name="fullname"
                control={sendVerificationEmailForm.control}
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <FormLabel className="flex">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Full Name" {...field} />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="username"
                control={sendVerificationEmailForm.control}
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <FormLabel className="flex">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debouncedUsername(e.target.value);
                          }}
                        />
                      </FormControl>
                    </LabelInputContainer>
                    <div className="flex gap-3">
                      {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin text-red-500" />}
                      <p
                        className={`flex text-xs ${
                          usernameMessage === "username is unique" ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {username} {usernameMessage}
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={sendVerificationEmailForm.control}
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <FormLabel className="flex">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sendVerificationEmailForm.control}
                name="password"
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
                disabled={isSubmitting || usernameMessage !== "username is unique"}
                className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full rounded-md h-10 font-medium shadow-input dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
                <BottomGradient />
              </Button>
            </form>
          </Form>
          <Button
            type="button"
            variant={"link"}
            onClick={() =>
              signIn("google", {
                callbackUrl: callbackUrl || "/",
              })
            }
            className=" relative group/btn  h-10 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          >
            <span>Sign in with Google</span> <BottomGradient />
          </Button>
        </div>
      </div>
    </ShineBorder>
  );
}

export default SignupForm;
