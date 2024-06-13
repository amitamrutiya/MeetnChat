"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import RoomIdForm from "./RoomIdForm";
import SignInForm from "./SignInForm";
import SignupForm from "./SignupForm";

function JoinRoomForm() {
  const session = useSession();
  const user = session.data?.user;

  return session.status === "loading" ? (
    <Skeleton className="mx-5 sm:w-[400px] w-[350px] flex justify-center items-center lg:mb-96 sm:mb-10 h-[400px] bg-secondary-foreground" />
  ) : (
    <div className="mx-5 sm:w-[400px] w-[350px] flex flex-col justify-center items-center lg:mb-96 sm:mb-10 ">
      {user ? (
        <RoomIdForm />
      ) : (
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">SignUp</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <SignInForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default JoinRoomForm;
