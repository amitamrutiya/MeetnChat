"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ProfileClient() {
  const session = useSession();
  const user = session.data?.user;

  return (
    user && (
      <div>
        <Image src={user.image ?? ""} alt={user.name ?? ""} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
}
