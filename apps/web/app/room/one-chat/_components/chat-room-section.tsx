"use client";

import { oldChatState, selectChatAtom } from "@repo/store";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useWebSocket } from "../../../../components/web-socket-context";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui";
import { useSession } from "next-auth/react";
import { saveChat } from "app/actions/chat/save-chat";
import Image from "next/image";
import { ChatList } from "components/chat/chat-list";
import { getExistingChats } from "app/actions/chat/get-chats";
import { useChat } from "hooks/use-chat";

function ChatRoomSection() {
  const selectedChat = useRecoilValue(selectChatAtom);
  const { sendMessage } = useWebSocket();
  const currentUser = useSession().data?.user;
  const [oldChats, setOldChats] = useRecoilState(oldChatState);
  const { handleEditChat, handleDeleteChat } = useChat();

  async function getOldChats() {
    const response = await getExistingChats({
      sender_id: currentUser?.id!,
      receiver_id: selectedChat?.id!,
    });

    if (response.success) {
      setOldChats(response.data!);
    }
  }

  useEffect(() => {
    getOldChats();
  }, [selectedChat]);

  const handleSubmit = async (message: string) => {
    if (!message) return;
    const response = await saveChat({ message, sender_id: currentUser?.id!, receiver_id: selectedChat?.id! });

    if (!response.success) return;

    if (response.success) {
      const chat = response.data!;
      sendMessage(chat);
    }
  };

  return selectedChat ? (
    <div className="flex h-full flex-col items-center justify-between">
      <nav className="bg-secondary flex h-16 w-full items-center rounded-xl p-3 shadow-sm">
        <div className="flex min-w-full items-center justify-between space-x-3">
          <div>
            <Avatar>
              <AvatarImage src={selectedChat?.image ?? "https://github.com/shadcn.png"} />
              <AvatarFallback>{selectedChat?.username}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="font-sans text-lg text-gray-50">{selectedChat?.name}</p>
            <p className="font-sans text-sm text-gray-300">{selectedChat?.email}</p>
          </div>
          <p className="text-sm text-gray-300">{selectedChat?.is_online ? "Online" : "Offline"}</p>
        </div>
      </nav>

      <ChatList
        currentUserId={currentUser?.id ?? ""}
        selectedUser={selectedChat}
        sendMessage={handleSubmit}
        messages={oldChats}
        currentUserImage={currentUser?.image ?? ""}
        currentUserName={currentUser?.name ?? ""}
        editChatMessage={handleEditChat}
        deleteChatMessage={handleDeleteChat}
      />
    </div>
  ) : (
    <div className="flex min-h-full w-full flex-col items-center justify-center rounded-xl p-3 shadow-sm">
      <p className="font-sans text-lg text-gray-50">Select a chat to start conversation</p>
      <Image className="rounded-[8px]" height={350} width={350} src={"/chat.png"} alt="Find Chats" />
    </div>
  );
}

export default ChatRoomSection;
