"use client";
import { MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaFooter,
  Input,
  toast,
  CredenzaClose,
} from "@repo/ui";
import { deleteChat } from "app/actions/chat/delete-chat";
import { updateChat } from "app/actions/chat/update-chat";
import { updateGroupChat } from "app/actions/group/group-chat/update-group-chat";
import { deleteGroupChat } from "app/actions/group/group-chat/delete-group-chat";

type ChatOperationDropDownProps = {
  chat_id: string;
  chat: string;
  isGroupChat: boolean;
  editChatMessage?: (chat_id: string, message: string) => void;
  editGroupChatMessage?: (chat_id: string, message: string) => void;
  deleteChatMessage?: (chat_id: string) => void;
  deleteGroupChatMessage?: (chat_id: string) => void;
};

const ChatOperationDropDown = ({
  chat_id,
  chat,
  isGroupChat,
  editChatMessage,
  editGroupChatMessage,
  deleteChatMessage,
  deleteGroupChatMessage,
}: ChatOperationDropDownProps) => {
  const [isCredenzaOpen, setIsCredenzaOpen] = useState({
    editeMessage: false,
    deleteMessage: false,
  });
  const [editeMessage, setEditeMessage] = useState("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVerticalIcon className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Credenza
          open={isCredenzaOpen.editeMessage}
          onOpenChange={(value) => setIsCredenzaOpen({ ...isCredenzaOpen, editeMessage: value })}
        >
          <CredenzaTrigger asChild>
            <Button
              variant={"ghost"}
              className="flex w-full justify-center gap-2"
              onClick={() => {
                setEditeMessage(chat);
              }}
            >
              <PencilIcon className="h-5 w-5" />
              <span>Edit Message</span>
            </Button>
          </CredenzaTrigger>
          <CredenzaContent>
            <CredenzaHeader>
              <CredenzaTitle>Edit Message</CredenzaTitle>
              <CredenzaDescription>
                You can edit your message here. Click save to update the message.
              </CredenzaDescription>
            </CredenzaHeader>
            <div className="p-3">
              <Input
                value={editeMessage}
                onChange={(e) => {
                  setEditeMessage(e.target.value);
                }}
              />
            </div>
            <CredenzaFooter>
              <CredenzaClose>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </CredenzaClose>
              <Button
                type="submit"
                onClick={async () => {
                  if (isGroupChat) {
                    editGroupChatMessage && editGroupChatMessage(chat_id, editeMessage);
                  } else {
                    editChatMessage && editChatMessage(chat_id, editeMessage);
                  }
                  setIsCredenzaOpen({ ...isCredenzaOpen, editeMessage: false });
                }}
              >
                Save changes
              </Button>
            </CredenzaFooter>
          </CredenzaContent>
        </Credenza>
        <Credenza
          open={isCredenzaOpen.deleteMessage}
          onOpenChange={(value) => setIsCredenzaOpen({ ...isCredenzaOpen, deleteMessage: value })}
        >
          <CredenzaTrigger asChild>
            <Button variant={"destructive"} className="flex gap-2" onClick={() => setEditeMessage(chat)}>
              <Trash2Icon className="h-5 w-5" />
              <span>Delete Message</span>
            </Button>
          </CredenzaTrigger>
          <CredenzaContent>
            <CredenzaHeader>
              <CredenzaTitle>Delete Message</CredenzaTitle>
              <CredenzaDescription>
                You can delete your message here. Click confirm to delete the message. This action is irreversible.
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaFooter>
              <CredenzaClose>
                <Button type="button" variant="secondary">
                  Cancle
                </Button>
              </CredenzaClose>

              <Button
                type="submit"
                variant={"destructive"}
                onClick={async () => {
                  if (isGroupChat) {
                    deleteGroupChatMessage && deleteGroupChatMessage(chat_id);
                  } else {
                    deleteChatMessage && deleteChatMessage(chat_id);
                  }
                  setIsCredenzaOpen({ ...isCredenzaOpen, deleteMessage: false });
                }}
              >
                Confirm Delete
              </Button>
            </CredenzaFooter>
          </CredenzaContent>
        </Credenza>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatOperationDropDown;
