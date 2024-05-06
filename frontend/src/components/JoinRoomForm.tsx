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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import roomSchema from "@/schemas/roomSchema";
import { signUpSchema } from "@/schemas/signupSchema";
import { signInSchema } from "@/schemas/signinSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "./ui/use-toast";

function JoinRoomForm() {
  const { user } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState("");
  let sendMail = false;
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceValue(username, 300);
  const roomForm = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomId: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const signinForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?${debouncedUsername}`
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
  }, [debouncedUsername]);

  function onRoomFormSubmit(values: z.infer<typeof roomSchema>) {
    router.push(`/room/group-meet/${values.roomId}`);
  }

  async function onSignUpFormSubmit(values: z.infer<typeof signUpSchema>) {
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
      ) : (
        <div>
          <div className="text-2xl font-bold text-primary mb-5">
            Please Login to Use
          </div>
          <Link href="/api/auth/login" passHref>
            <Button className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white py-2 px-4 rounded border-2 border-transparent hover:border-purple-500 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 animate-pulse w-[100%]">
              Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default JoinRoomForm;
