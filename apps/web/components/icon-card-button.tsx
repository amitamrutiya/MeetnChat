import React from "react";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger, Meteors } from "@repo/ui";
import { currentUser } from "../app/helpers/auth";
import functions from "../app/utils/data";
import { BackgroundGradient } from "@repo/ui";

const IconCardButton = async () => {
  const user = await currentUser();
  return functions.map((f, i) => (
    <Link key={i} href={user ? f.link : "/"} passHref>
      <HoverCard>
        <HoverCardTrigger>
          <div className="mx-5 my-5 flex h-[250px] w-[250px] cursor-pointer items-center justify-center rounded-md px-2 py-2 text-center shadow-md sm:my-0">
            <BackgroundGradient className="bg-secondary relative max-w-sm overflow-hidden rounded-[22px] p-4 sm:p-10 dark:bg-zinc-900">
              <div className="text-center">
                <div className="flex justify-center pb-2">
                  <span className="text-primary pr-4">{React.createElement(f.icon1)}</span>
                  <span className="text-primary">{React.createElement(f.icon2)}</span>
                </div>
                <p className="text-primary font-sans text-lg font-bold">{f.title}</p>
                <p className="text-md font-sans font-bold">{f.subtitle}</p>
              </div>
              <Meteors number={20} />
            </BackgroundGradient>
          </div>
        </HoverCardTrigger>
        <HoverCardContent>{f.description}</HoverCardContent>
      </HoverCard>
    </Link>
  ));
};

export default IconCardButton;
