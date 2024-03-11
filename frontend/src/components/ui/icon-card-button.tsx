import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export interface IconCardButtonProps {
  icon: React.ReactNode;
  text: string;
  subtext: string;
  description: string;
  onClick?: () => void;
}

const IconCardButton: React.FC<IconCardButtonProps> = (props) => {
  const { icon, text, subtext, description, onClick } = props;
  return (
    <HoverCard>
      <HoverCardTrigger>
        {" "}
        <div
          onClick={onClick}
          className="tetx-center mx-5 my-5 flex h-[250px] w-[250px] cursor-pointer items-center justify-center rounded-md border-2 shadow-md hover:bg-sky-700 sm:my-0"
        >
          <div className="text-center">
            <span className="mx-auto text-primary">{icon}</span>
            <p className="font-sans text-lg font-bold text-primary">{text}</p>
            <p className="text-md font-sans font-bold text-primary-foreground">
              {subtext}
            </p>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>{description}</HoverCardContent>
    </HoverCard>
  );
};

export default IconCardButton;
