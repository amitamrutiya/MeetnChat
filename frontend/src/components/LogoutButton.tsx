"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

function LogoutButton(user: { user: any }) {
  if (!user) {
    return null;
  }

  return (
    <Button
      className="relative"
      onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
    >
      Logout
    </Button>
  );
}

export default LogoutButton;
