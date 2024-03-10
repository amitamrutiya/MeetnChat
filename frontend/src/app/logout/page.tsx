"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Login() {
  const router = useRouter();

  const navigate = () => {
    router.push("/api/auth/logout");
  };

  return <Button onClick={navigate}>Login</Button>;
}
