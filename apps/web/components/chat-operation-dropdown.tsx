"use client";
import { MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import {
  Input,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuGroup,
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  Button,
  DialogFooter,
} from "@repo/ui";
import { Chat } from "@prisma/client";
import { updateChat } from "app/actions/chat/update-chat";
import { deleteChat } from "app/actions/chat/delete-chat";

const ChatOperationDropDown = ({ chat }: { chat: Chat }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editeMessage, setEditeMessage] = useState("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVerticalIcon className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant={"ghost"}
                className="flex gap-2"
                onClick={() => {
                  setEditeMessage(chat.message);
                  setIsDialogOpen(true);
                }}
              >
                <PencilIcon className="h-5 w-5" />
                <span>Edit Message</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Message</DialogTitle>
                <DialogDescription>You can edit your message here. Click save to update the message.</DialogDescription>
              </DialogHeader>
              <div className="p-3">
                <Input
                  value={editeMessage}
                  onChange={(e) => {
                    setEditeMessage(e.target.value);
                  }}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={async () => {
                    const response = await updateChat({
                      chatId: chat.id,
                      message: editeMessage,
                    });
                    if (response.success) {
                      setIsDialogOpen(false);
                    }
                  }}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant={"destructive"}
                className="flex gap-2"
                onClick={() => {
                  setEditeMessage(chat.message);
                  setIsDialogOpen(true);
                }}
              >
                <Trash2Icon className="h-5 w-5" />
                <span>Delete Message</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Message</DialogTitle>
                <DialogDescription>
                  You can delete your message here. Click confirm to delete the message. This action is irreversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancle
                </Button>
                <Button
                  type="submit"
                  variant={"destructive"}
                  onClick={async () => {
                    const response = await deleteChat({
                      chatId: chat.id,
                    });
                    if (response.success) {
                      setIsDialogOpen(false);
                    }
                  }}
                >
                  Confirm Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatOperationDropDown;
