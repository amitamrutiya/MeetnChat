"use client";

import React from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

function LogoutButton() {
  const session = useSession();
  const user = session.data?.user;

  if (session.status === "loading") {
    return (
      <Skeleton className=" absolute top-0 right-0 m-4 h-9 w-20  bg-secondary-foreground" />
    );
  }

  return (
    <Button
      className="absolute top-0 right-0 m-4"
      onClick={() => {
        window.location.href = "/api/auth/logout";
      }}
    >
      Logout
    </Button>
  );
}

export default LogoutButton;
