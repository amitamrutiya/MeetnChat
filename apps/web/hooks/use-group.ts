import { useRecoilState, useSetRecoilState } from "recoil";
import {
  chatLoadingAtom,
  groupChatAtom,
  groupMembersAtom,
  groupsAtom,
  inviteUserListAtom,
  isOpenAtom,
  loadingAtom,
  selectedAtom,
  selectGroupAtom,
} from "@repo/store";
import { User, Group } from "@prisma/client";
import { useSession } from "next-auth/react";
import { getSelectedUsers } from "app/actions/user/get-selected-users";
import { addMembers } from "app/actions/group/add-members";
import { updateGroup } from "app/actions/group/update-group";
import { deleteGroup } from "app/actions/group/delete-group";
import { leaveGroup } from "app/actions/group/leave-group";
import { toast } from "@repo/ui";
import { saveGroupChat } from "app/actions/group/group-chat/save-group-chat";
import { updateGroupChat } from "app/actions/group/group-chat/update-group-chat";
import { getMembers } from "app/actions/group/get-members";
import getGroupChats from "app/actions/group/group-chat/get-group-chats";
import { getGroups } from "app/actions/group/get-groups";
import { createGroup } from "app/actions/group/create-group";
import { deleteAllGroupChats, deleteGroupChat } from "app/actions/group/group-chat/delete-group-chat";
import { removeMemeberFromGroup } from "app/actions/group/remove-member";
import { useWebSocket } from "components/web-socket-context";

export function useGroup() {
  const setInviteUserList = useSetRecoilState(inviteUserListAtom);
  const setLoading = useSetRecoilState(loadingAtom);
  const setChatLoading = useSetRecoilState(chatLoadingAtom);
  const [selected, setSelected] = useRecoilState(selectedAtom);
  const [isOpen, setIsOpen] = useRecoilState(isOpenAtom);
  const [groupMembers, setGroupMembers] = useRecoilState(groupMembersAtom);
  const setGroupChat = useSetRecoilState(groupChatAtom);
  const setGroups = useSetRecoilState(groupsAtom);
  const [selectedGroup, setSelectedGroup] = useRecoilState(selectGroupAtom);
  const { ws } = useWebSocket();
  const currentUser = useSession().data?.user;

  async function getInviteUsersList({ groupMembers }: { groupMembers: User[] }) {
    const userIds = currentUser?.friends.filter((friend) => !groupMembers.find((member) => member.id === friend));
    if (userIds) {
      setLoading(true);
      const response = await getSelectedUsers({ userList: userIds });
      setLoading(false);
      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
        });
        return;
      }

      setInviteUserList(response.data!);
    }
  }

  async function handleAddMembers({ event, groupMembers }: { event: any; groupMembers: User[] }): Promise<void> {

    if (selected.length <= 0) {
      toast({
        title: "Error",
        description: "Please selecte at least One User",
        variant: "destructive",
      });
      return;
    }
    event.preventDefault();
    const response = await addMembers({ group_id: selectedGroup?.id!, members: selected.map((user) => user.id) });

    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: response.message,
    });
    const newGroupMembers = [...groupMembers, ...selected];
    setGroupMembers(newGroupMembers);
    setIsOpen({ ...isOpen, addMembers: false });
    setInviteUserList((prev) => prev.filter((user) => !selected.includes(user)));
    setSelected([]);
    ws?.send(
      JSON.stringify({
        type: "ADD_MEMBERS",
        payload: {
          group_id: selectedGroup?.id,
          members: selected.map((user) => user.id),
        },
      })
    );
  }

  async function handleRemoveMember(member_id: string): Promise<void> {
    const response = await removeMemeberFromGroup({
      group_id: selectedGroup?.id!,
      user_id: member_id,
      current_user_id: currentUser?.id!,
    });
    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
      });
      return;
    }

    setGroupMembers((prev) => prev.filter((member) => member.id !== member_id));
    toast({
      title: "Success",
      description: response.message,
    });

    if (member_id === currentUser?.id) {
      setSelectedGroup(null);
    }

    setInviteUserList((prev) => [...prev, groupMembers.find((member) => member.id === member_id)!]);

    ws?.send(
      JSON.stringify({
        type: "REMOVE_MEMBER",
        payload: {
          group_id: selectedGroup?.id,
          user_id: member_id,
        },
      })
    );
  }

  async function handleCreatGroup(event: any): Promise<void> {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());
    const name = userData.name?.toString()!;
    const description = userData.description?.toString() ?? "Chat with friends";
    const limit = Number(userData.limit);
    const image = userData.image?.toString() ?? "https://github.com/shadcn.png";
    const response = await createGroup({
      name,
      description,
      limit,
      image,
      creator_id: currentUser?.id!,
      members: selected.map((user) => user.id),
    });

    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
      });
      return;
    }

    toast({
      title: "Success",
      description: response.message,
    });
    setGroups((prev) => [...prev, response.data!]);
    setIsOpen({ ...isOpen, createGroup: false });
    setSelectedGroup(response.data!);
    setLoading(false);

    ws?.send(
      JSON.stringify({
        type: "NEW_GROUP",
        payload: response.data!,
      })
    );
  }

  async function handleEditGroup({
    event,
    localGroup,
    setLocalGroup,
  }: {
    event: any;
    localGroup: Group;
    setLocalGroup: (group: Group) => void;
  }): Promise<void> {
    if (localGroup) {
      // setLoading(true);
      event.preventDefault();
      const formData = new FormData(event.target);
      const groupData = Object.fromEntries(formData.entries());
      const name = groupData.name?.toString()!;
      const description = groupData.description?.toString() ?? "Chat with friends";
      const limit = Number(groupData.limit);
      const image = groupData.image?.toString() ?? "";

      const response = await updateGroup({
        name,
        image,
        description,
        limit,
        group_id: localGroup?.id!,
        last_limit: localGroup?.limit!,
        user_id: currentUser?.id!,
      });

      // setLoading(false);

      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: response.message,
      });

      setIsOpen({ ...isOpen, editGroup: false });
      setLocalGroup(response.data!);
      setGroups((prev) =>
        prev.map((group) => {
          if (group.id === response.data?.id) {
            return response.data!;
          }
          return group;
        })
      );

      ws?.send(
        JSON.stringify({
          type: "EDIT_GROUP",
          payload: response.data!,
        })
      );
    }
  }

  async function handleDeleteGroup(event: any): Promise<void> {
    event.preventDefault();
    setLoading(true);

    const response = await deleteGroup({ group_id: selectedGroup?.id! });
    setLoading(false);
    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: response.message,
    });

    setIsOpen({ ...isOpen, deleteGroup: false });
    setSelectedGroup(null);

    ws?.send(
      JSON.stringify({
        type: "DELETE_GROUP",
        payload: selectedGroup,
      })
    );
  }

  async function handleLeaveGroup(event: any): Promise<void> {
    event.preventDefault();
    setLoading(true);

    const response = await leaveGroup({ group_id: selectedGroup?.id!, user_id: currentUser?.id! });
    setLoading(false);

    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: response.message,
    });

    setIsOpen({ ...isOpen, deleteGroup: false });
    setSelectedGroup(null);

    ws?.send(
      JSON.stringify({
        type: "LEAVE_GROUP",
        payload: {
          group_id: selectedGroup?.id,
          user_id: currentUser?.id,
        },
      })
    );
  }

  async function handleSendMessage(newMessage: string): Promise<void> {
    if (!currentUser) return;
    if (!selectedGroup) return;

    const response = await saveGroupChat({
      group_id: selectedGroup.id,
      sender_id: currentUser?.id,
      message: newMessage,
      sender_name: currentUser?.name ?? "Unknown",
      sender_image: currentUser?.image ?? "https://github.com/shadcn.png",
    });

    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
      });
      return;
    }

    // Add new message to the chat list
    setGroupChat((prev) => [...prev, response.data!]);

    // Send the message to the server
    ws?.send(
      JSON.stringify({
        type: "SEND_GROUP_MESSAGE",
        payload: response.data!,
      })
    );
  }

  async function handleEditGroupChat(chat_id: string, message: string): Promise<void> {
    const response = await updateGroupChat({
      chat_id,
      message,
    });

    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
      });
      return;
    }

    setGroupChat((prev) =>
      prev.map((chat) => {
        if (chat.id === chat_id) {
          return { ...chat, message };
        }
        return chat;
      })
    );

    toast({
      title: "Success",
      description: response.message,
    });

    ws?.send(
      JSON.stringify({
        type: "EDIT_GROUP_MESSAGE",
        payload: response.data!,
      })
    );
  }

  async function handleDeleteGroupChat(chat_id: string): Promise<void> {
    const response = await deleteGroupChat({ chat_id: chat_id });

    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
      });
      return;
    }

    setGroupChat((prev) => prev.filter((chat) => chat.id !== chat_id));
    toast({
      title: "Success",
      description: response.message,
    });

    ws?.send(
      JSON.stringify({
        type: "DELETE_GROUP_MESSAGE",
        payload: response.data!,
      })
    );
  }

  async function getGroupChatsUser() {
    if (selectedGroup) {
      setGroupMembers([]);
      setGroupChat([]);
      try {
        setChatLoading(true);
        const response = await getMembers({ group_id: selectedGroup.id });
        if (!response.success) {
          toast({
            title: "Error",
            description: response.message,
          });
          return;
        }
        const groupChatResponse = await getGroupChats({ group_id: selectedGroup.id });
        if (!groupChatResponse.success) {
          toast({
            title: "Error",
            description: groupChatResponse.message,
          });
          return;
        }

        setGroupMembers(response.data!);
        setGroupChat(groupChatResponse.data!);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
        });
      } finally {
        setChatLoading(false);
      }
    }
  }

  async function fetchGroups() {
    setLoading(true);
    const response = await getGroups({ user_id: currentUser?.id ?? "" });
    setLoading(false);
    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
      });
    }
    setGroups(response.data!);
  }

  async function fetchInviteUserList() {
    setLoading(true);
    const userIds = currentUser?.friends;
    if (!userIds) {
      throw new Error("No user IDs provided");
    }
    const inviteUserList = await getSelectedUsers({ userList: userIds });
    setLoading(false);
    if (!inviteUserList.success) {
      toast({
        title: "Error",
        description: inviteUserList.message,
      });
    }
    setInviteUserList(inviteUserList.data!);
  }

  async function handleClearAllGroupChat() {
    const response = await deleteAllGroupChats({ group_id: selectedGroup?.id! });
    if (!response.success) {
      toast({
        title: "Error",
        description: response.message,
      });
      return;
    }

    toast({
      title: "Success",
      description: response.message,
    });

    setIsOpen({ ...isOpen, clearChat: false });
    setGroupChat([]);

    ws?.send(
      JSON.stringify({
        type: "CLEAR_GROUP_CHAT",
        payload: {
          group_id: selectedGroup?.id,
        },
      })
    );
  }
  
  return {
    getInviteUsersList,
    handleAddMembers,
    handleEditGroup,
    handleDeleteGroup,
    handleLeaveGroup,
    handleSendMessage,
    handleEditGroupChat,
    handleDeleteGroupChat,
    getGroupChatsUser,
    fetchGroups,
    fetchInviteUserList,
    handleCreatGroup,
    handleRemoveMember,
    handleClearAllGroupChat,
  };
}
