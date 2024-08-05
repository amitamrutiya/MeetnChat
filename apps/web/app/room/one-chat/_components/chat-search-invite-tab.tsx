import {
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@repo/ui";
import { useChat } from "hooks/use-chat";
import { CheckIcon, XIcon } from "lucide-react";
import React from "react";

const ChatSearchInviteTab = () => {
  const {
    requestUserData,
    onAcceptFriendRequest,
    onRejectFriendRequest,
    inviteUserData,
    updateUserStatusToPending,
    handleInvite,
  } = useChat();

  return (
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
                    <Button
                      variant="secondary"
                      size={"icon"}
                      onClick={() => onAcceptFriendRequest({ requestId: req_id })}
                    >
                      <CheckIcon />
                    </Button>
                    <Button
                      variant="destructive"
                      size={"icon"}
                      onClick={() => onRejectFriendRequest({ requestId: req_id })}
                    >
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
                      disabled={reqStatus === "Accepted" || reqStatus === "Pending" || reqStatus === "Rejected"}
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
  );
};

export default ChatSearchInviteTab;
