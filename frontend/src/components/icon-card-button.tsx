"use client";

import React from "react";
import functions from "@/app/data/functions";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { v4 } from "uuid";

const IconCardButton = () => {
  const { isLoading, user } = useUser();
  return functions.map((f, i) => (
    <Link key={i} href={user ? `/room/${v4()}` : "/api/auth/login"} passHref>
      <HoverCard>
        <HoverCardTrigger>
          {" "}
          <div className="text-center mx-5 my-5 px-2 py-2 flex h-[250px] w-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-foreground shadow-md hover:bg-hover sm:my-0">
            <div className="text-center">
              <div className="flex justify-center pb-2">
                <span className="text-primary pr-4">
                  {React.createElement(f.icon1)}
                </span>
                <span className="text-primary">
                  {React.createElement(f.icon2)}
                </span>
              </div>
              <p className="font-sans text-lg font-bold text-primary">
                {f.title}
              </p>
              <p className="text-md font-sans font-bold">{f.subtitle}</p>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent>{f.description}</HoverCardContent>
      </HoverCard>
    </Link>
  ));
};

export default IconCardButton;
