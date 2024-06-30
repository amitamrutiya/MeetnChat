"use client";
import { Sheet, AnimatedTooltip, Avatar, AvatarFallback, AvatarImage, SheetContent, SheetTrigger } from "@repo/ui";
import { CircleEllipsis } from "lucide-react";
import GroupChatSheet from "./group-chat-sheet";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { chatLoadingAtom, groupChatAtom, groupMembersAtom, selectGroupAtom } from "@repo/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ChatList } from "components/chat/chat-list";
import { useGroup } from "hooks/use-group";

const GroupChatSection = () => {
  const currentUser = useSession().data?.user;
  const { handleSendMessage, handleEditGroupChat, handleDeleteGroupChat, getGroupChatsUser } = useGroup();
  const chatLoading = useRecoilValue(chatLoadingAtom);
  const groupMembers = useRecoilValue(groupMembersAtom);
  const groupChat = useRecoilValue(groupChatAtom);
  const selectedGroup = useRecoilValue(selectGroupAtom);
  const [localGroup, setLocalGroup] = useState(selectedGroup);

  useEffect(() => {
    if (selectedGroup) {
      getGroupChatsUser();
      setLocalGroup(selectedGroup);
    }
  }, [selectedGroup]);

  return chatLoading ? (
    <div className="flex min-h-96 w-full items-center justify-center">
      <div className="loader h-24 w-24 animate-spin rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
    </div>
  ) : chatLoading === false && localGroup ? (
    <div className="flex h-full w-full flex-col justify-between p-7">
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center justify-center gap-5">
          <Avatar>
            <AvatarImage src={localGroup.image ?? "https://github.com/shadcn.png"} />
            <AvatarFallback>{localGroup.name}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-bold">{localGroup.name}</h3>
            <span className="text-primary text-sm">{localGroup.description}</span>
          </div>
        </div>
        <div className="flex items-center">
          <AnimatedTooltip users={groupMembers} />
          <p className="text-primary text-md ml-10">Rahul Typing...</p>
        </div>

        <Sheet>
          <SheetTrigger>
            <CircleEllipsis />
          </SheetTrigger>
          <SheetContent>
            <GroupChatSheet groupMembers={groupMembers} localGroup={localGroup} setLocalGroup={setLocalGroup} />
          </SheetContent>
        </Sheet>
      </div>
      <hr className="thick-hr mt-5" />

      <main className="flex h-[calc(80dvh)] w-full flex-col items-center gap-4 rounded-lg border px-4 text-sm lg:flex xl:px-10">
        <ChatList
          messages={groupChat}
          selectedUser={localGroup}
          sendMessage={handleSendMessage}
          currentUserId={currentUser?.id ?? ""}
          editGroupChatMessage={handleEditGroupChat}
          deleteGroupChatMessage={handleDeleteGroupChat}
        />
      </main>
    </div>
  ) : (
    <div className="flex min-h-full w-full flex-col items-center justify-center rounded-xl p-3 shadow-sm">
      <p className="font-sans text-lg text-gray-50">Select a chat to start conversation</p>
      <Image className="rounded-[8px]" height={350} width={350} src={"/chat.png"} alt="Find Chats" />
    </div>
  );
};

export default GroupChatSection;
