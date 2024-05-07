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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn, useSession } from "next-auth/react";

function JoinRoomForm() {
  const sesstion = useSession();
  const user = sesstion.data?.user;
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [sendMail, setSendMail] = useState(false);
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
      code: "------",
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
            `/api/check-username-unique?username=${username}`
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
      onSignInFormSubmit({ identifier: username, password });
    } catch (error) {
      console.log("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSignInFormSubmit(values: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: values.identifier,
      password: values.password,
    });
    setIsSubmitting(false);
    if (result?.error) {
      toast({
        title: "Sign in failed",
        description: "Incorrect username or password",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Sign in successful",
      });
    }

    if (result?.url) {
      router.replace("/");
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
      setSendMail(true);
      setPassword(values.password);
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
    <div className="mx-5 sm:w-[400px] w-[350px] flex justify-center items-center lg:mb-96 sm:mb-10">
      {user ? (
        <Form {...roomForm}>
          <form
            onSubmit={roomForm.handleSubmit(onRoomFormSubmit)}
            className="w-full p-8 space-y-8 bg-secondary rounded-lg shadow-md"
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
      ) : (
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">SignUp</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <div className="w-full max-w-md p-8 space-y-8 bg-secondary rounded-lg shadow-md">
              <div className="text-center">
                <h1 className="text-2xl font-extrabold mb-6">
                  Please Login to Use
                </h1>
                <p className="mb-4">
                  Sign up to start your anonymous adventure
                </p>
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
                    control={sendVerificationEmailForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex">Password</FormLabel>
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
                      "Log In"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
          <TabsContent value="signup">
            {sendMail ? (
              <div className="flex  bg-secondary">
                <div className="w-full max-w-md p-8 space-y-8  bg-secondary rounded-lg shadow-md">
                  <div className="text-center">
                    <h1 className="text-2xl font-extrabold mb-6">
                      Verify Your Account
                    </h1>
                    <p className="mb-4">
                      Enter the verification code sent to your email
                    </p>
                    <Form {...signupForm}>
                      <form
                        onSubmit={signupForm.handleSubmit(onSignUpFormSubmit)}
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
                                  <InputOTPGroup className="flex mx-auto">
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
                                Please enter the one-time password sent to your
                                email.
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
              <div className="flex items-start justify-start">
                <div className="w-full max-w-md p-8 space-y-8 bg-secondary rounded-lg shadow-md">
                  <div className="text-center">
                    <h1 className="text-2xl font-extrabold tracking-tighter mb-6">
                      Please SignUp to Use
                    </h1>
                    <p className="mb-4">
                      Sign up to start your anonymous adventure
                    </p>
                  </div>
                  <Form {...sendVerificationEmailForm}>
                    <form
                      onSubmit={sendVerificationEmailForm.handleSubmit(
                        onSendVerificationEmail
                      )}
                      className="space-y-4 flex-col flex"
                    >
                      <FormField
                        name="username"
                        control={sendVerificationEmailForm.control}
                        render={({ field }) => (
                          <FormItem>
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
                            {isCheckingUsername && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            <p
                              className={`flex text-xs ${
                                usernameMessage === "username is unique"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {username} {usernameMessage}
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
                            <FormLabel className="flex">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Email"
                                {...field}
                              />
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
                            <FormLabel className="flex">Password</FormLabel>
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
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Please wait
                          </>
                        ) : (
                          "Sign Up"
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default JoinRoomForm;
