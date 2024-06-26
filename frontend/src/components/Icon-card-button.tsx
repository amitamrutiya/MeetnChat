import React from "react";
import functions from "@/app/data/functions";
import Link from "next/link";
import { PinContainer } from "./ui/3d-pin";
import { BackgroundGradient } from "./ui/background-gradient";
import { Meteors } from "./ui/meteors";
import { currentUser } from "@/lib/auth";

const IconCardButton = async () => {
  const user = await currentUser();
  return functions.map((f, i) => (
    <Link key={i} href={user ? f.link : "/" } passHref>
      <PinContainer title={f.description}>
        <div className="text-center mx-5 my-5 px-2 py-2 flex h-[250px] w-[250px] cursor-pointer items-center justify-center rounded-md shadow-md hover:bg-hover sm:my-0">
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-secondary dark:bg-zinc-900">
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
              <Meteors number={20} />
            </div>
          </BackgroundGradient>
        </div>
      </PinContainer>
    </Link>
    // <div key={i}></div>
  ));
};

export default IconCardButton;
