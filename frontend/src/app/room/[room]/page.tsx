"use client";
import React from "react";
import { useParams } from "next/navigation";

export default function Room() {
  const params = useParams();

  return (
    <>
      {params.room}
      <div>params</div>
      <div>Room</div>
    </>
  );
}
