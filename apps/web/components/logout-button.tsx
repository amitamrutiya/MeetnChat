"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@repo/ui";

function LogoutButton(user: { user: any }) {
  if (!user) {
    return null;
  }

  return (
    <Button className="relative" onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>
      Logout
    </Button>
  );
}

export default LogoutButton;
