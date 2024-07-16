import { MessageCircleMoreIcon, SendHorizonalIcon } from "lucide-react";
import { useState, useRef, useEffect, useCallback, useContext } from "react";
import MessageDiv from "../../../../components/message-div";
import FileTransfer from "../../../../components/file-transfer";
import FileCard from "../../../../components/file-card";
import { Message } from "@repo/common";
import {
  Button,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Textarea,
  TooltipContent,
} from "@repo/ui";
import { useRecoilValue } from "recoil";
import { availableFilesAtom, SocketContext } from "@repo/store";

function ChatButton(props: { remoteSocketId: string }) {
  const { remoteSocketId } = props;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputChatMessage, setInputChatMessage] = useState<string | undefined>();
  const socket = useContext(SocketContext);
  const availableFiles = useRecoilValue(availableFilesAtom);
  const chatBoxContainerRef = useRef<HTMLDivElement>(null);
  const combined = [...availableFiles, ...messages].sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    if (chatBoxContainerRef.current) {
      chatBoxContainerRef.current.scrollTo(0, chatBoxContainerRef.current.scrollHeight);
    }
  }, [messages, isChatOpen]);

  const handleOnMessage = useCallback((data: any) => {
    const { from, message, user, self = false } = data;
    setMessages((e: Message[]) => [
      ...e,
      {
        from: user.name,
        displayPicture: user.picture,
        message: message,
        isSelf: self,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const submitMessage = () => {
    if (inputChatMessage && inputChatMessage.length > 0 && socket) {
      socket.emit("chat:message", {
        to: remoteSocketId,
        message: inputChatMessage,
      });
      setInputChatMessage("");
    }
  };

  useEffect(() => {
    if (socket) socket.on("chat:message", handleOnMessage);

    return () => {
      if (socket) socket.off("chat:message", handleOnMessage);
    };
  }, [handleOnMessage]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Sheet>
            <SheetTrigger>
              <Button
                size={"icon"}
                className="bg-foreground"
                onClick={() => {
                  setIsChatOpen(!isChatOpen);
                }}
              >
                <MessageCircleMoreIcon />
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col justify-between">
              <SheetHeader>
                <SheetTitle>Chat</SheetTitle>
                <SheetDescription>Start a conversation</SheetDescription>
              </SheetHeader>
              <div ref={chatBoxContainerRef} className="h-full w-full overflow-y-auto rounded-md border p-2">
                <div className="max-w-[752px] flex-grow">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="col-span-1">
                      <ul className="list-none">
                        {combined.map((item, index) => {
                          if ("message" in item) {
                            return (
                              <li key={item.from}>
                                <MessageDiv {...item} />
                              </li>
                            );
                          } else {
                            return <FileCard key={`${item.name}-${index}`} file={item} />;
                          }
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
                {messages && messages.length <= 0 && (
                  <div className="flex h-full w-full items-center justify-center font-sans">
                    <p>No new messages</p>
                  </div>
                )}
              </div>
              <SheetFooter>
                <div className="grid w-full gap-2">
                  <Textarea
                    value={inputChatMessage}
                    onChange={(e: any) => setInputChatMessage(e.target.value)}
                    placeholder="Type your message here."
                    typeof="text"
                  />
                  <div className="flex gap-2">
                    <Button className="w-full" onClick={submitMessage}>
                      Send message
                      <SendHorizonalIcon />
                    </Button>
                    <FileTransfer />
                  </div>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chat</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ChatButton;
