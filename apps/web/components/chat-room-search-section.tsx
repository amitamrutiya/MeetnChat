"use client";

import {
  Button,
  Input,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  toast,
} from "@repo/ui";
import { CheckIcon, Mail, MessageCircleMore, SettingsIcon, UsersRound, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { getUsers } from "app/actions/user/get-users";
import { useSession } from "next-auth/react";
import { getFrequentChatUsers } from "app/actions/chat/get-chated-users";
import { useRecoilState, useSetRecoilState } from "recoil";
import { selectChatAtom } from "@repo/store";
import { sendFriendRequest } from "app/actions/chat/send-friend-request";
import { getReceivedFriendRequests, getSentFriendRequests } from "app/actions/chat/get-friend-request";
import { acceptFriendRequest } from "app/actions/chat/accept-friend-request";
import { rejectFriendRequest } from "app/actions/chat/reject-friend-request";
import { getUserById } from "app/actions/user/get-user";

function ChatRoomSearchSection() {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [contacts, setContacts] = useState<User[]>([]);
  const [frequentChatUsers, setFrequentChatUsers] = useState<User[]>([]);
  const [selectChat, setSelectChat] = useRecoilState(selectChatAtom);
  const [loading, setLoading] = useState(false);
  const currentUser = useSession().data?.user;
  const [requestUserData, setRequestUserData] = useState<Map<string, User>>();
  const [inviteUserData, setInviteUserData] = useState<Map<string, User>>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  async function fetchInviteUser() {
    if (inviteUserData && requestUserData) return;
    try {
      setLoading(true);
      const allUsers = await getUsers({ page: pageNumber, pageSize: 15 });
      const sendFriendRequestData = await getSentFriendRequests({ userId: currentUser?.id! });
      const receivedFirendRequestData = await getReceivedFriendRequests({ userId: currentUser?.id! });

      if (!sendFriendRequestData.success || !receivedFirendRequestData.success) {
        toast({
          title: "Failed to fetch friend requests",
          variant: "destructive",
        });
        return;
      }

      receivedFirendRequestData.data?.forEach(async (request) => {
        const user = await getUserById({ user_id: request.sender_id });
        if (user) {
          setRequestUserData((prev) => new Map([...(prev ?? []), [request.id, user]]));
        }
      });

      const updatedInviteUserData = new Map();

      allUsers?.forEach((user) => {
        let status = "Invite";

        if (sendFriendRequestData?.data?.length! > 0) {
          const userRequest = sendFriendRequestData.data?.find((request) => request.receiver_id === user?.id);
          if (userRequest) {
            status = userRequest.status;
          }
        }
        const key = `${user.id}-${status}`;
        updatedInviteUserData.set(key, user);
      });

      const invitefilteredResponseArray = Array.from(updatedInviteUserData).filter(([key, user]) => {
        return user.id !== currentUser?.id;
      });

      const invitefilteredResponseMap = new Map(invitefilteredResponseArray);

      setInviteUserData(invitefilteredResponseMap);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onAcceptFriendRequest({ requestId }: { requestId: string }) {
    setRequestUserData((prev) => {
      const newMap = new Map(prev);
      newMap.delete(requestId);
      return newMap;
    });
    const response = await acceptFriendRequest({ requestId });
    await fetchContacts();
    if (!response.success) {
      toast({
        title: response.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: response.message,
    });
  }

  async function onRejectFriendRequest({ requestId }: { requestId: string }) {
    setRequestUserData((prev) => {
      const newMap = new Map(prev);
      newMap.delete(requestId);
      return newMap;
    });
    const response = await rejectFriendRequest({ requestId });
    if (!response.success) {
      toast({
        title: response.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: response.message,
    });
  }

  async function fetchContacts() {
    if (contacts.length > 0) return;
    try {
      setLoading(true);
      currentUser?.friends?.forEach(async (friendId) => {
        const user = await getUserById({ user_id: friendId });
        if (user) {
          setContacts((prev) => [...prev, user]);
        }
      });
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFrequentChatUsers() {
    if (frequentChatUsers.length) return;
    try {
      setLoading(true);
      const response = await getFrequentChatUsers({ user_id: currentUser?.id! });
      console.log("response", response);
      setFrequentChatUsers(response);
      setSelectedTab("Chats");
    } catch (error) {
      console.error("Failed to fetch frequent chat users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchFrequentChatUsers();
      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  async function handleInvite({ receiver_id }: { receiver_id: string }): Promise<void> {
    const response = await sendFriendRequest({ userId: currentUser?.id!, friendId: receiver_id });
    if (!response.success) {
      toast({
        title: response.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: response.message,
    });
  }

  const updateUserStatusToPending = (userId: string) => {
    const updatedInviteUserData = new Map(inviteUserData);
    console.log("updatedInviteUserData", updatedInviteUserData);

    const keys = Array.from(updatedInviteUserData.keys());

    keys.forEach((statusKey) => {
      console.log("this called");
      const user = updatedInviteUserData.get(statusKey);
      if (user && user.id === userId) {
        const parts = statusKey.split("-");
        parts[5] = "Pending";
        const newStatusKey = parts.join("-");

        updatedInviteUserData.delete(statusKey);
        updatedInviteUserData.set(newStatusKey, user);
      }
    });
    console.log("updatedInviteUserData", updatedInviteUserData);
    setInviteUserData(updatedInviteUserData);
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="Search mb-8 p-5">
          <div className="grid w-full max-w-full items-center gap-1.5">
            <Input className="rounded-3xl" type="search" id="search" placeholder="Search" />
            {/* TODO: Add Search Icon */}
          </div>
        </div>
        <div className="Menu mb-4 flex justify-evenly">
          <Button
            variant="outline"
            className={`rounded-2xl p-5 xl:p-8 ${selectedTab === "Chats" ? "bg-primary" : ""}`}
            onClick={async () => {
              setSelectedTab(null);
              await fetchFrequentChatUsers();
              setSelectedTab("Chats");
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <MessageCircleMore />
              <p>Chats</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className={`rounded-2xl p-5 xl:p-8 ${selectedTab === "Contacts" ? "bg-primary" : ""}`}
            onClick={async () => {
              setSelectedTab(null);
              await fetchContacts();
              setSelectedTab("Contacts");
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <UsersRound />
              <p>Contacts</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className={`rounded-2xl p-5 xl:p-8 ${selectedTab === "Invite" ? "bg-primary" : ""}`}
            onClick={async () => {
              setSelectedTab(null);
              await fetchInviteUser();
              setSelectedTab("Invite");
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <Mail />
              <p>Invite</p>
            </div>
          </Button>
        </div>
      </div>
      {selectedTab === "Chats" && (
        <div className="ChatList mb-10 h-full overflow-auto rounded-md border">
          <div className="p-4">
            <h4 className="text-md my-3 text-center font-bold leading-none">Your Recent Chat</h4>
            {frequentChatUsers.map((user) => (
              <React.Fragment key={user.id}>
                <div
                  className={`flex cursor-pointer justify-between rounded-lg p-3 ${selectChat?.id === user.id ? "bg-primary-foreground" : ""}`}
                  onClick={() => setSelectChat(user)}
                >
                  <div className="left-side flex">
                    <Avatar>
                      <AvatarImage src={user.image ?? "https://github.com/shadcn.png"} />
                      <AvatarFallback>{user.username}</AvatarFallback>
                    </Avatar>
                    <div className="chat ml-2 flex-col">
                      <div className="name">{user.name}</div>
                      <div className="message text-xs text-gray-400">{user.bio}</div>
                    </div>
                  </div>
                  <div className="right-side text-xs text-gray-400">03:36</div>
                </div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      {selectedTab === "Contacts" && (
        <div className="Contacts mb-10 h-full overflow-auto rounded-md border">
          <div className="p-4">
            <h4 className="text-md my-3 text-center font-bold leading-none">All Contacts</h4>
            {contacts.map((user) => (
              <React.Fragment key={user.id}>
                <div
                  className={`flex cursor-pointer justify-between rounded-lg p-3 ${selectChat?.id === user.id ? "bg-primary-foreground" : ""}`}
                  onClick={() => setSelectChat(user)}
                >
                  <div className="left-side flex">
                    <Avatar>
                      <AvatarImage src={user.image ?? "https://github.com/shadcn.png"} />
                      <AvatarFallback>{user.username}</AvatarFallback>
                    </Avatar>
                    <div className="chat ml-2 flex-col">
                      <div className="name">{user.name}</div>
                      <div className="message text-xs text-gray-400">{user.bio}</div>
                    </div>
                  </div>
                </div>
                <Separator className="my-2" />
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      {selectedTab === "Invite" && (
        <Tabs defaultValue="invite" className="mx-3 h-full w-[95%]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invite">Invite</TabsTrigger>
            <TabsTrigger value="request">Request</TabsTrigger>
          </TabsList>
          <TabsContent value="request">
            <div className="my-10 h-[30rem] overflow-auto rounded-md border px-2">
              {requestUserData ? (
                Array.from(requestUserData?.entries()!).map(([req_id, user]) => (
                  <React.Fragment key={req_id}>
                    <div className="flex justify-between">
                      <div className="flex">
                        <Avatar>
                          <AvatarImage src={user.image ?? "https://github.com/shadcn.png"} />
                          <AvatarFallback>{user.username}</AvatarFallback>
                        </Avatar>
                        <div className="chat ml-2 flex-col">
                          <div className="name">{user.name}</div>
                          <div className="message text-xs text-gray-400">{user.bio}</div>
                        </div>
                      </div>
                      <div className="">
                        <Button variant="secondary" onClick={() => onAcceptFriendRequest({ requestId: req_id })}>
                          <CheckIcon />
                        </Button>
                        <Button variant="destructive" onClick={() => onRejectFriendRequest({ requestId: req_id })}>
                          <XIcon />
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-2" />
                  </React.Fragment>
                ))
              ) : (
                <>No request Recieved</>
              )}
            </div>
          </TabsContent>
          <TabsContent value="invite">
            <div className="my-10 h-[30rem] overflow-auto rounded-md border px-4">
              {inviteUserData ? (
                Array.from(inviteUserData?.entries()!).map(([status, user]) => {
                  // @ts-ignore
                  let reqStatus = status.split("-")[5].charAt(0).toUpperCase() + status.split("-")[5].slice(1);
                  return (
                    <React.Fragment key={user.id}>
                      <div className="flex justify-between">
                        <div className="flex">
                          <Avatar>
                            <AvatarImage src={user.image ?? "https://github.com/shadcn.png"} />
                            <AvatarFallback>{user.username}</AvatarFallback>
                          </Avatar>
                          <div className="chat ml-2 flex-col">
                            <div className="name">{user.name}</div>
                            <div className="message text-xs text-gray-400">{user.bio}</div>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            updateUserStatusToPending(user.id!);
                            handleInvite({ receiver_id: user.id! });
                          }}
                          disabled={reqStatus === "Accepted" || reqStatus === "Pending"}
                        >
                          {reqStatus}
                        </Button>
                      </div>
                      <Separator className="my-2" />
                    </React.Fragment>
                  );
                })
              ) : (
                <>No Data</>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
      {selectedTab === null && loading && (
        <div className="flex h-full items-center justify-center">
          <div className="loader h-24 w-24 animate-spin rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
        </div>
      )}

      <div className="profile bg-secondary mx-6 mb-6 flex items-center justify-between gap-3 rounded-full">
        <div className="flex flex-row items-center">
          <Avatar className="h-[70px] w-[70px]">
            <AvatarImage src={currentUser?.image ?? "https://github.com/shadcn.png"} />
            <AvatarFallback>{currentUser?.username}</AvatarFallback>
          </Avatar>
          <div className="chat ml-5 flex-col">
            <div className="name">{currentUser?.name}</div>
            <div className="message text-sm text-gray-400">{currentUser?.is_online ? "Online" : "Offline"}</div>
          </div>
        </div>
        <div className="pr-6">
          <SettingsIcon />
        </div>
      </div>
    </div>
  );
}

export default ChatRoomSearchSection;
