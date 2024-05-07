"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import roomSchema from "@/schemas/roomSchema";
import { signUpSchema } from "@/schemas/signupSchema";
import { signInSchema } from "@/schemas/signinSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
import { verifySchema } from "@/schemas/verifySchema";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

function JoinRoomForm() {
  const { user } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState("");
  let sendMail = false;
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 300);
  const roomForm = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomId: "",
    },
  });

  const signupForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "000000",
    },
  });

  const signinForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const sendVerificationEmailForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  function onRoomFormSubmit(values: z.infer<typeof roomSchema>) {
    router.push(`/room/group-meet/${values.roomId}`);
  }

  async function onSignUpFormSubmit(values: z.infer<typeof verifySchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username,
        code: values.code,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  async function onSignInFormSubmit(values: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-in", values);
      toast({
        title: "Success",
        description: response.data.message,
      });
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error in signin of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signin failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  async function onSendVerificationEmail(values: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", values);
      toast({
        title: "Success",
        description: response.data.message,
      });
      sendMail = true;
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }
  return (
    <div className="sm:mx-10 sm:my-[70%] w-full flex items-center justify-center mt-10">
      {user ? (
        <Form {...roomForm}>
          <form
            onSubmit={roomForm.handleSubmit(onRoomFormSubmit)}
            className="sm:w-48 space-y-7 w-full pr-5"
          >
            <FormField
              control={roomForm.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Join meet with room Id</FormLabel>
                  <FormControl>
                    <Input placeholder="Room Id" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the room id to join the room.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      ) : sendMail ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-2xl font-extrabold tracking-tighter mb-6">
                Verify Your Account
              </h1>
              <p className="mb-4">
                Enter the verification code sent to your email
              </p>
              <Form {...signupForm}>
                <form
                  onSubmit={signupForm.handleSubmit(onSignUpFormSubmit)}
                  className="w-2/3 space-y-6"
                >
                  <FormField
                    name="code"
                    control={signupForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>
                          Please enter the one-time password sent to your email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-2xl font-extrabold tracking-tighter mb-6">
                Please Login to Use
              </h1>
              <p className="mb-4">Sign up to start your anonymous adventure</p>
            </div>
            <Form {...sendVerificationEmailForm}>
              <form
                onSubmit={sendVerificationEmailForm.handleSubmit(
                  onSendVerificationEmail
                )}
                className="space-y-4"
              >
                <FormField
                  name="username"
                  control={sendVerificationEmailForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
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
                      {isCheckingUsername && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      <p
                        className={`text-sm ${
                          usernameMessage === "Username is unique"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        test {usernameMessage}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={sendVerificationEmailForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={sendVerificationEmailForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          {/* <Link href="/api/auth/login" passHref>
            <Button className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white py-2 px-4 rounded border-2 border-transparent hover:border-purple-500 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 animate-pulse w-[100%]">
              Login in with Google
            </Button>
          </Link> */}
        </div>
      )}
    </div>
  );
}

export default JoinRoomForm;
