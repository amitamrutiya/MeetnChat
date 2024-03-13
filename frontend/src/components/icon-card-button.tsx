import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useUser } from "@auth0/nextjs-auth0/client";

export interface IconCardButtonProps {
  icon1: React.ReactNode;
  icon2: React.ReactNode;
  text: string;
  subtext: string;
  description: string;
  onClick?: () => void;
}

const IconCardButton: React.FC<IconCardButtonProps> = (props) => {
  const { isLoading } = useUser();
  const { icon1, icon2, text, subtext, description, onClick } = props;
  return (
    <HoverCard>
      <HoverCardTrigger>
        {" "}
        <div
          onClick={onClick}
          className="text-center mx-5 my-5 px-2 flex h-[250px] w-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-foreground shadow-md hover:bg-hover sm:my-0"
        >
          <div className="text-center">
            <div className="flex justify-center pb-2">
              <span className="text-primary pr-4">{icon1}</span>
              <span className="text-primary">{icon2}</span>
            </div>
            <p className="font-sans text-lg font-bold text-primary">{text}</p>
            <p className="text-md font-sans font-bold">{subtext}</p>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>{description}</HoverCardContent>
    </HoverCard>
  );
};

export default IconCardButton;
