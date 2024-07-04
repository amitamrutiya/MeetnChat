import { useState } from "react";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { AxiosError } from "axios";
import { toast } from "@repo/ui";
import {
  ApiResponse,
  signInSchema,
  signUpSchema,
  verifySchema,
} from "@repo/common";
import { verifyCode } from "../app/actions/auth/verify-code";
import { register } from "../app/actions/auth/register";

export function useAuth() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [sendMail, setSendMail] = useState(false);

  async function onSignInFormSubmit(values: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: true,
      identifier: values.identifier,
      password: values.password,
    });

    setIsSubmitting(false);
    console.log("sign in result", result);
    if (result?.error) {
      console.log("Sign in failed", result.error);
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
  }

  async function onSignUpFormSubmit(
    values: z.infer<typeof verifySchema>,
    username: string
  ) {
    setIsSubmitting(true);
    try {
      const response = await verifyCode({
        username,
        code: { code: values.code },
      });
      if (response.success) {
        await onSignInFormSubmit({ identifier: username, password });
        toast({
          title: "Success",
          description: response.message,
        });
      } else {
        toast({
          title: response.message,
          variant: "destructive",
        });
      }
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

  async function onSendVerificationEmail(values: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);
    try {
      const response = await register(values);
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        setSendMail(true);
        setPassword(values.password);
      } else {
        toast({
          title: response.message,
          variant: "destructive",
        });
      }
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

  return {
    onSignInFormSubmit,
    isSubmitting,
    sendMail,
    onSignUpFormSubmit,
    onSendVerificationEmail,
  };
}
