"use client";

import { SmileIcon } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Popover, PopoverContent, PopoverTrigger } from "./shad/ui/popover";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Picker
          emojiSize={18}
          theme="light"
          data={data}
          maxFrequentRows={1}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
