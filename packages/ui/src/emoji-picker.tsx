"use client";

import { SmileIcon } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./shad/ui/dropdown-menu";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SmileIcon className="text-muted-foreground hover:text-foreground h-5 w-5 transition" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <Picker
          emojiSize={18}
          theme="light"
          data={data}
          maxFrequentRows={1}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
