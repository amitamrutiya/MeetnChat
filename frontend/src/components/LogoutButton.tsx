"use client";

import React from "react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "next-auth/react";

function LogoutButton() {
  const session = useSession();
  const user = session.data?.user;

  if (session.status === "loading") {
    return <Skeleton className="relative h-9 w-20 bg-secondary-foreground" />;
  }

  if (!user) {
    return null;
  }

  return (
    <Button className="relative" onClick={() => signOut()}>
      Logout
    </Button>
  );
}

export default LogoutButton;
