import { MessageCircleMoreIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "./ui/button";
function ChatButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button size={"icon"} className="bg-foreground">
            <MessageCircleMoreIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chat</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ChatButton;
