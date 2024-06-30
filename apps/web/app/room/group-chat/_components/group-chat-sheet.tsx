"use client";

import { AudioLines } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Separator } from "@repo/ui";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useGroup } from "hooks/use-group";
import { useRecoilValue } from "recoil";
import { selectGroupAtom } from "@repo/store";
import { Trash2Icon } from "lucide-react";
import EditGroupDialogue from "./dialogues/edit-group-dialogue";
import ClearChatDialogue from "./dialogues/clear-chats-dialogue";
import AddMemberDialogue from "./dialogues/add-member-dialogue";
import LeaveDeleteGroupDialogue from "./dialogues/leave-delete-group-dialogue";
import { Group } from "@prisma/client";

type GroupChatSheetPropsType = {
  groupMembers: User[];
  localGroup: Group | null;
  setLocalGroup: React.Dispatch<React.SetStateAction<Group | null>>;
};

const GroupChatSheet = ({ groupMembers, localGroup, setLocalGroup }: GroupChatSheetPropsType) => {
  const { getInviteUsersList, handleRemoveMember } = useGroup();
  const selectedGroup = useRecoilValue(selectGroupAtom);
  const currentUser = useSession().data?.user;
  const isCreator = currentUser?.id === selectedGroup?.creator_id;

  useEffect(() => {
    getInviteUsersList({ groupMembers });
    return () => {};
  }, []);

  return (
    <div className="my-10 flex h-full w-full flex-col items-center justify-between overflow-auto">
      <div className="flex flex-col items-center gap-6">
        <Avatar className="h-40 w-40">
          <AvatarImage src={localGroup?.image ?? "https://github.com/shadcn.png"} />
          <AvatarFallback>{localGroup?.name}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1">
          <p className="text-xl font-bold"> {localGroup?.name}</p>
          <p className="text-sm text-gray-300"> {localGroup?.description}</p>
          <p className="font-semibold">
            {groupMembers.length}/{localGroup?.limit} Members
          </p>
          <p className="font-semibold">Created At: {new Date(localGroup?.createdAt!).toLocaleDateString()}</p>
        </div>
        <hr className="thick-hr min-w-full" />
        <AddMemberDialogue groupMembers={groupMembers} />
        <div className="align-center flex min-h-96 w-full flex-col justify-center gap-3 rounded-lg border-2 border-gray-500 p-3">
          <p className="text-xl font-bold">Group Members</p>
          <Separator className="bg-white" />
          <div className="h-96 w-full overflow-auto">
            {groupMembers.map((member, index) => (
              <>
                <div key={index} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.image ?? "https://github.com/shadcn.png"} />
                    <AvatarFallback>{member.name}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-lg font-bold">{member.name}</p>
                    <p className="text-sm text-gray-300">{member.bio}</p>
                  </div>
                  {isCreator && member.id !== currentUser?.id && (
                    <div
                      className="bg-destructive flex cursor-pointer flex-col items-center gap-1 rounded-lg p-2"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <p className="text-sm text-gray-300">Remove</p>
                      <Trash2Icon className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <Separator className="my-2 bg-gray-600" />
              </>
            ))}
          </div>
        </div>
      </div>

      <footer className="mb-16 mt-4 flex flex-col items-center justify-between gap-2 align-middle font-sans text-xl font-bold antialiased">
        <EditGroupDialogue localGroup={localGroup} setLocalGroup={setLocalGroup} />
        {isCreator && <ClearChatDialogue />}
        <LeaveDeleteGroupDialogue isCreator={isCreator} />
        <div className="mt-4 flex">
          <AudioLines className="mr-2 inline" />
          Meet <span className="text-sky-400/100"> ChillChat</span>
        </div>
      </footer>
    </div>
  );
};

export default GroupChatSheet;
