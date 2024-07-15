import { toast } from "@repo/ui";
import { getUsers } from "app/actions/user/get-users";
import { getFrequentChatUsers } from "app/actions/chat/get-chated-users";
import { sendFriendRequest } from "app/actions/chat/send-friend-request";
import { getReceivedFriendRequests, getSentFriendRequests } from "app/actions/chat/get-friend-request";
import { acceptFriendRequest } from "app/actions/chat/accept-friend-request";
import { rejectFriendRequest } from "app/actions/chat/reject-friend-request";
import { getUserById } from "app/actions/user/get-user";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { useState } from "react";
import { useWebSocket } from "components/web-socket-context";

export function chat() {
  const currentUser = useSession().data?.user;
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [contacts, setContacts] = useState<User[]>([]);
  const [frequentChatUsers, setFrequentChatUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestUserData, setRequestUserData] = useState<Map<string, User>>();
  const [inviteUserData, setInviteUserData] = useState<Map<string, User>>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { ws } = useWebSocket();

  async function handleInvite({ receiver_id }: { receiver_id: string }): Promise<void> {
    const response = await sendFriendRequest({ userId: currentUser?.id!, friendId: receiver_id });
    if (!response.success) {
      toast({
        title: response.message,
        variant: "destructive",
      });
      return;
    }
    ws?.send(
      JSON.stringify({
        type: "NEW_FRIEND_REQUEST",
        payload: { sender_id: currentUser?.id, receiver_id, request_id: response.data?.id },
      })
    );
    toast({
      title: response.message,
    });
  }

  async function updateUserStatusToPending(userId: string) {
    const updatedInviteUserData = new Map(inviteUserData);

    const keys = Array.from(updatedInviteUserData.keys());

    keys.forEach((statusKey) => {
      const user = updatedInviteUserData.get(statusKey);
      if (user && user.id === userId) {
        const parts = statusKey.split("-");
        parts[5] = "Pending";
        const newStatusKey = parts.join("-");

        updatedInviteUserData.delete(statusKey);
        updatedInviteUserData.set(newStatusKey, user);
      }
    });
    setInviteUserData(updatedInviteUserData);
  }

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

      const invitefilteredResponseArray = Array.from(updatedInviteUserData).filter(([, user]) => {
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
    ws?.send(
      JSON.stringify({
        type: "ACCEPT_FRIEND_REQUEST",
        payload: { sender_id: currentUser?.id, receiver_id: requestId },
      })
    );
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
    ws?.send(
      JSON.stringify({
        type: "REJECT_FRIEND_REQUEST",
        payload: { sender_id: currentUser?.id, receiver_id: requestId },
      })
    );
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

  return {
    currentUser,
    selectedTab,
    setSelectedTab,
    contacts,
    setContacts,
    frequentChatUsers,
    setFrequentChatUsers,
    loading,
    setLoading,
    requestUserData,
    setRequestUserData,
    inviteUserData,
    setInviteUserData,
    pageNumber,
    setPageNumber,
    ws,
    handleInvite,
    updateUserStatusToPending,
    fetchInviteUser,
    onAcceptFriendRequest,
    onRejectFriendRequest,
    fetchContacts,
    fetchFrequentChatUsers,
  };
}
