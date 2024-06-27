"use client";

import { Avatar, AvatarFallback, AvatarImage, Input, toast } from "@repo/ui";
import { AudioLines, SearchIcon, Users2Icon } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { groupChatAtom, groupsAtom, loadingAtom, selectGroupAtom } from "@repo/store";
import { useGroup } from "hooks/use-group";
import CreateGroupDialogue from "./dialogues/create-group-dialogue";
import { useWebSocket } from "components/web-socket-context";
import { Group } from "@prisma/client";
import { getGroup } from "app/actions/group/get-group";

const GroupSearchSection = () => {
  const currentUser = useSession().data?.user;
  const { ws } = useWebSocket();
  const loading = useRecoilValue(loadingAtom);
  const groups = useRecoilValue(groupsAtom);
  const { fetchGroups } = useGroup();
  const setGroups = useSetRecoilState(groupsAtom);
  const setGroupChat = useSetRecoilState(groupChatAtom);
  const [selectedGroup, setSelectedGroup] = useRecoilState(selectGroupAtom);

  useEffect(() => {
    if (currentUser) {
      console.log("fetching groups");
      fetchGroups();
    }
    return () => {};
  }, [currentUser]);

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message", message.payload);
      switch (message.type) {
        case "MEMBERS_ADDED": {
          const newGroupId = message.payload.group_id;
          const newMembers = message.payload.members;

          // Perform the asynchronous operation outside of setGroups
          const updateGroups = async (prevGroups: Group[]) => {
            const updatedGroups = await Promise.all(
              prevGroups.map(async (group: Group) => {
                if (group.id === newGroupId) {
                  return { ...group, members: [...group.members, ...newMembers] };
                } else {
                  const newGroup = await getGroup({ group_id: newGroupId });
                  if (newGroup.data) {
                    return newGroup.data;
                  } else {
                    return { ...group };
                  }
                }
              })
            );
            return updatedGroups;
          };

          // Use the result of the async operation to update the state
          updateGroups(groups).then((newGroup) => setGroups(newGroup));

          break;
        }
        case "MEMBER_REMOVED": {
          const group_id = message.payload.group_id;
          const member_id = message.payload.user_id;

          setSelectedGroup(null);

          setGroups((prev) =>
            prev.map((group) => {
              if (group.id === group_id) {
                return { ...group, members: group.members.filter((member) => member !== member_id) };
              }
              return group;
            })
          );

          break;
        }

        case "NEW_GROUP_CREATED": {
          const newGroup = message.payload;
          setGroups((prev) => [...prev, newGroup]);
          break;
        }

        case "GROUP_EDITED": {
          const editedGroup: Group = message.payload;
          setGroups((prev) => prev.map((group) => (group.id === editedGroup.id ? editedGroup : group)));
          setSelectedGroup(editedGroup);
          toast({
            title: "Group Updated",
            description: `Group ${editedGroup.name} has been updated`,
          });

          break;
        }

        case "GROUP_DELETED": {
          const deletedGroupId = message.payload.group_id;
          setGroups((prev) => prev.filter((group) => group.id !== deletedGroupId));
          break;
        }

        case "LEFT_GROUP": {
          const leftGroupId = message.payload.group_id;
          const leftUserId = message.payload.user_id;

          setGroups((prev) =>
            prev.map((group) => {
              if (group.id === leftGroupId) {
                return { ...group, members: group.members.filter((member) => member !== leftUserId) };
              }
              return group;
            })
          );
          break;
        }

        case "GROUP_MESSAGE_SENT": {
          const newMessage = message.payload;
          setGroupChat((prev) => [...prev, newMessage]);
          break;
        }

        case "GROUP_MESSAGE_EDITED": {
          const editedMessage = message.payload;
          setGroupChat((prev) => prev.map((message) => (message.id === editedMessage.id ? editedMessage : message)));
          break;
        }

        case "GROUP_MESSAGE_DELETED": {
          const deletedMessageId = message.payload.id;
          setGroupChat((prev) => prev.filter((message) => message.id !== deletedMessageId));
          break;
        }

        case "ALL_MESSAGES_CLEARED": {
          setGroupChat([]);
          break;
        }

        default:
          break;
      }
    };

    return () => {
      ws.onmessage = null;
    };
  }, [ws]);

  return (
    <div className="flex h-full flex-col gap-7 p-7">
      <header className="relative flex flex-col gap-9 font-sans text-xl font-bold antialiased">
        <div>
          <AudioLines className="mr-2 inline text-white" />
          <span className="text-white"> Meet</span>
          <span className="text-sky-400/100">ChillChat</span>
        </div>
        <div className="flex w-full items-center space-x-2 rounded-lg">
          <SearchIcon className="h-4 w-4" />
          <Input type="search" placeholder="Search" className="h-8 w-full border-0 font-semibold" />
        </div>
      </header>
      <div className="flex h-full w-full flex-col gap-3">
        <div className="flex justify-center gap-3">
          <Users2Icon />
          <p className="text-xl font-bold">Your Groups</p>
        </div>
        <hr className="thick-hr" />
        <div className="flex h-full flex-col justify-between">
          {groups.length > 0 ? (
            <div className="flex flex-col gap-3">
              {groups.map((group) => {
                return (
                  <div
                    key={group.id}
                    className={`flex cursor-pointer justify-between rounded-xl p-3 ${selectedGroup?.id === group.id && "bg-primary-foreground"}`}
                    onClick={() => {
                      console.log("group_id", group.id);
                      setSelectedGroup(group);
                    }}
                  >
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={group.image ?? "https://github.com/shadcn.png"} />
                        <AvatarFallback>{group.name}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <p className="text-lg font-semibold">{group.name}</p>
                        <p className="text-sm text-neutral-400">{group.description}</p>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-400">15:20 PM</div>
                  </div>
                );
              })}
            </div>
          ) : loading ? (
            <div className="flex min-h-96 w-full items-center justify-center">
              <div className="loader h-24 w-24 animate-spin rounded-full border-8 border-t-8 border-gray-200 ease-linear"></div>
            </div>
          ) : (
            <div className="flex min-h-96 w-full items-center justify-center">
              <p className="text-center text-neutral-400">No groups found</p>
            </div>
          )}
          <CreateGroupDialogue />
        </div>
      </div>
    </div>
  );
};

export default GroupSearchSection;
